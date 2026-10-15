<?php

namespace Database\Seeders;

use App\Models\Place;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PlaceSeeder extends Seeder
{
    /**
     * Koordinat di bawah ini PERKIRAAN. Cek dan sesuaikan di OpenStreetMap
     * atau Google Maps (klik kanan di titik yang benar -> salin lat, lng).
     */
    public function run(): void
    {
        $places = [
            ['name' => 'Istana Maimun',            'lat' => 3.5752, 'lng' => 98.6837, 'category' => 'Sejarah'],
            ['name' => 'Masjid Raya Al Mashun',    'lat' => 3.5751, 'lng' => 98.6871, 'category' => 'Sejarah'],
            ['name' => 'Tjong A Fie Mansion',      'lat' => 3.5862, 'lng' => 98.6821, 'category' => 'Sejarah'],
            ['name' => 'Kesawan',                  'lat' => 3.5875, 'lng' => 98.6790, 'category' => 'Jalan'],
            ['name' => 'Lapangan Merdeka',         'lat' => 3.5886, 'lng' => 98.6738, 'category' => 'Taman'],
            ['name' => 'Universitas Sumatera Utara', 'lat' => 3.5652, 'lng' => 98.6566, 'category' => 'Kampus'],
        ];

        foreach ($places as $data) {
            // firstOrNew + slug: aman dijalankan berulang (tidak menggandakan data).
            $place = Place::firstOrNew(['slug' => Str::slug($data['name'])]);
            $place->fill($data);
            $place->status = Place::STATUS_APPROVED; // 'status' tidak mass-assignable
            $place->save();
        }
    }
}
