<?php

namespace App\Http\Controllers;

use App\Models\Place;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PlaceController extends Controller
{
    private const MAX_PINS = 500;

    /**
     * GET /api/places?bbox=minLng,minLat,maxLng,maxLat
     * Pin (approved) yang terlihat di viewport peta.
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bbox' => ['required', 'string', 'regex:/^-?\d+(\.\d+)?(,-?\d+(\.\d+)?){3}$/'],
        ]);

        [$minLng, $minLat, $maxLng, $maxLat] = array_map('floatval', explode(',', $validated['bbox']));

        $valid = $minLat >= -90 && $maxLat <= 90
            && $minLng >= -180 && $maxLng <= 180
            && $minLat < $maxLat
            && $minLng < $maxLng;

        if (! $valid) {
            throw ValidationException::withMessages(['bbox' => 'Batas peta tidak valid.']);
        }

        $places = Place::query()
            ->approved()
            ->inBbox($minLng, $minLat, $maxLng, $maxLat)
            ->select(['id', 'name', 'slug', 'lat', 'lng', 'category'])
            ->withCount(['approvedPhotos as photos_count'])
            ->orderBy('id')
            ->limit(self::MAX_PINS)
            ->get();

        return response()->json(['data' => $places]);
    }
}
