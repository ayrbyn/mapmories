<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('places', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->decimal('lat', 10, 7);
            $table->decimal('lng', 10, 7);
            $table->string('category')->nullable();
            $table->string('status')->default('pending'); // pending|approved|rejected
            $table->timestamps();

            $table->index(['status', 'lat', 'lng']);
        });

        // Tutup akses lewat REST API publik Supabase (Laravel konek sebagai owner, tidak terpengaruh).
        DB::statement('ALTER TABLE places ENABLE ROW LEVEL SECURITY');
    }

    public function down(): void
    {
        Schema::dropIfExists('places');
    }
};