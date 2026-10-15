<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photo_id')->constrained()->cascadeOnDelete();
            $table->string('reason', 30);
            $table->string('ip_hash', 64)->nullable();
            $table->timestamps();

            // Satu IP hanya bisa melaporkan satu foto satu kali.
            $table->unique(['photo_id', 'ip_hash']);
        });

        DB::statement('ALTER TABLE reports ENABLE ROW LEVEL SECURITY');
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};