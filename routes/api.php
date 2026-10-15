<?php

use App\Http\Controllers\PlaceController;
use App\Http\Controllers\PlacePhotoController;
use Illuminate\Support\Facades\Route;

// Semua route di sini otomatis berawalan /api dan TIDAK memakai session
// (jadi menggeser peta tidak menulis ke tabel sessions di Supabase).
Route::middleware('throttle:120,1')->group(function () {
    Route::get('places', [PlaceController::class, 'index']);
    Route::get('places/{place}/photos', [PlacePhotoController::class, 'index']);
});
