<?php

namespace App\Http\Controllers;

use App\Models\Place;
use Illuminate\Http\JsonResponse;

class PlacePhotoController extends Controller
{
    /**
     * GET /api/places/{slug}/photos?cursor=...
     * Mading: foto approved milik satu tempat, terbaru dulu.
     */
    public function index(Place $place): JsonResponse
    {
        abort_unless($place->status === Place::STATUS_APPROVED, 404);

        $photos = $place->approvedPhotos()
            ->select(['id', 'place_id', 'cloudinary_public_id', 'width', 'height', 'caption', 'created_at'])
            ->orderByDesc('id')
            ->cursorPaginate(24);

        return response()->json($photos);
    }
}
