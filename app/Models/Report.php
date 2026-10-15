<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    public const REASONS = ['inappropriate', 'spam', 'privacy', 'other'];

    /** Jumlah report dari IP berbeda sebelum foto disembunyikan otomatis. */
    public const FLAG_THRESHOLD = 3;

    protected $fillable = [
        'photo_id',
        'reason',
        'ip_hash',
    ];

    protected $hidden = [
        'ip_hash',
    ];

    protected static function booted(): void
    {
        static::created(function (Report $report) {
            $distinctReporters = static::where('photo_id', $report->photo_id)
                ->whereNotNull('ip_hash')
                ->distinct()
                ->count('ip_hash');

            if ($distinctReporters >= self::FLAG_THRESHOLD) {
                Photo::where('id', $report->photo_id)
                    ->where('status', Photo::STATUS_APPROVED)
                    ->update(['status' => Photo::STATUS_FLAGGED]);
            }
        });
    }

    public function photo(): BelongsTo
    {
        return $this->belongsTo(Photo::class);
    }
}