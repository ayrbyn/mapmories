<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('place_id')->constrained()->cascadeOnDelete();
            $table->string('cloudinary_public_id')->unique();
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->string('caption', 200)->nullable();
            $table->string('status')->default('pending'); // pending|approved|flagged|removed
            $table->string('delete_token_hash', 64);
            $table->string('ip_hash', 64)->nullable();
            $table->timestamps();

            $table->index(['place_id', 'status', 'created_at']);
        });

        DB::statement('ALTER TABLE photos ENABLE ROW LEVEL SECURITY');
    }

    public function down(): void
    {
        Schema::dropIfExists('photos');
    }
};