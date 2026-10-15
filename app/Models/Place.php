<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
 
class Place extends Model
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';
 
    // 'status' sengaja tidak masuk $fillable: pin baru dari publik selalu
    // 'pending' (default di database). Moderasi mengubahnya secara eksplisit.
    protected $fillable = [
        'name',
        'slug',
        'lat',
        'lng',
        'category',
    ];
 
    protected function casts(): array
    {
        return [
            'lat' => 'float',
            'lng' => 'float',
        ];
    }
 
    protected static function booted(): void
    {
        static::creating(function (Place $place) {
            if (blank($place->slug)) {
                $place->slug = static::uniqueSlug($place->name);
            }
        });
    }
 
    public static function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'tempat';
        $slug = $base;
 
        while (static::where('slug', $slug)->exists()) {
            $slug = $base . '-' . Str::lower(Str::random(5));
        }
 
        return $slug;
    }
 
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
 
    // ---- Relasi ----
 
    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class);
    }
 
    public function approvedPhotos(): HasMany
    {
            return $this->hasMany(Photo::class)->where('status', Photo::STATUS_APPROVED);
    }
 
    // ---- Scope ----
 
    /** Wajib dipakai di semua endpoint publik. */
    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_APPROVED);
    }
 
    /** Pin yang terlihat di viewport peta. */
    public function scopeInBbox(
        Builder $query,
        float $minLng,
        float $minLat,
        float $maxLng,
        float $maxLat
    ): Builder {
        return $query
            ->whereBetween('lat', [$minLat, $maxLat])
            ->whereBetween('lng', [$minLng, $maxLng]);
    }
}
