<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Photo extends Model
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_FLAGGED = 'flagged'; // disembunyikan otomatis karena banyak report
    public const STATUS_REMOVED = 'removed';

    protected $fillable = [
        'place_id',
        'cloudinary_public_id',
        'width',
        'height',
        'caption',
        'delete_token_hash',
        'ip_hash',
    ];

    // Jangan pernah ikut ke JSON/Inertia props.
    protected $hidden = [
        'delete_token_hash',
        'ip_hash',
    ];

    protected $appends = [
        'thumb_url',
        'full_url',
    ];

    protected function casts(): array
    {
        return [
            'width' => 'integer',
            'height' => 'integer',
        ];
    }

    // ---- Relasi ----

    public function place(): BelongsTo
    {
        return $this->belongsTo(Place::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    // ---- Scope ----

    /** Wajib dipakai di semua endpoint publik. */
    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    // ---- Delete token (hapus foto tanpa akun) ----

    /**
     * @return array{0: string, 1: string} [token plaintext untuk browser, hash untuk database]
     */
    public static function newDeleteToken(): array
    {
        $plain = Str::random(48);

        return [$plain, hash('sha256', $plain)];
    }

    public function matchesDeleteToken(string $token): bool
    {
        return hash_equals($this->delete_token_hash, hash('sha256', $token));
    }

    // ---- URL Cloudinary (selalu lewat transformasi, jangan expose original) ----

    public function transformedUrl(string $transformation): string
    {
        $cloud = config('services.cloudinary.cloud_name');

        return "https://res.cloudinary.com/{$cloud}/image/upload/{$transformation}/{$this->cloudinary_public_id}";
    }

    protected function thumbUrl(): Attribute
    {
        return Attribute::get(fn () => $this->transformedUrl('c_limit,w_600,f_auto,q_auto'));
    }

    protected function fullUrl(): Attribute
    {
        return Attribute::get(fn () => $this->transformedUrl('c_limit,w_1600,f_auto,q_auto'));
    }
}