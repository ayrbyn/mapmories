import { useEffect, useState } from 'react';
import type { Photo, PhotoPage, Place } from '@/types/place';

// Kemiringan tetap per foto (tidak berubah tiap render): -2.4 sampai +2.4 derajat.
const tiltFor = (id: number) => (((id * 37) % 7) - 3) * 0.8;

async function fetchPage(slug: string, cursor: string | null, signal?: AbortSignal): Promise<PhotoPage> {
    const qs = cursor ? `?cursor=${encodeURIComponent(cursor)}` : '';
    const res = await fetch(`/api/places/${slug}/photos${qs}`, {
        headers: { Accept: 'application/json' },
        signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

type Props = {
    place: Place;
    onClose: () => void;
};

export default function PlacePanel({ place, onClose }: Props) {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [loadingMore, setLoadingMore] = useState(false);
    const [moreFailed, setMoreFailed] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const [lightbox, setLightbox] = useState<Photo | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        setPhotos([]);
        setNextCursor(null);
        setStatus('loading');
        setMoreFailed(false);

        fetchPage(place.slug, null, controller.signal)
            .then((page) => {
                setPhotos(page.data);
                setNextCursor(page.next_cursor);
                setStatus('ready');
            })
            .catch((err: Error) => {
                if (err.name !== 'AbortError') setStatus('error');
            });

        return () => controller.abort();
    }, [place.slug, reloadKey]);

    useEffect(() => {
        if (!lightbox) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightbox(null);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [lightbox]);

    async function loadMore() {
        if (!nextCursor || loadingMore) return;
        setLoadingMore(true);
        setMoreFailed(false);
        try {
            const page = await fetchPage(place.slug, nextCursor);
            setPhotos((prev) => [...prev, ...page.data]);
            setNextCursor(page.next_cursor);
        } catch {
            setMoreFailed(true);
        } finally {
            setLoadingMore(false);
        }
    }

    const focusRing =
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9C46A]';

    return (
        <aside
            aria-label={`Mading ${place.name}`}
            className="absolute inset-x-0 bottom-0 z-10 max-h-[65dvh] overflow-y-auto rounded-t-2xl bg-[#2F4A43] text-[#F3EFE4] shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[420px] md:rounded-none"
        >
            <header className="sticky top-0 z-10 flex items-start justify-between gap-3 bg-[#2F4A43] px-5 pb-3 pt-4">
                <div>
                    <h2 className="text-2xl font-semibold leading-tight">{place.name}</h2>
                    {place.category && <p className="mt-1 text-sm text-[#F3EFE4]/75">{place.category}</p>}
                    <p className="text-sm text-[#F3EFE4]/75">{place.photos_count} foto</p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup mading"
                    className={`rounded-full p-2 text-xl leading-none hover:bg-white/10 ${focusRing}`}
                >
                    ×
                </button>
            </header>

            {status === 'loading' && <p className="px-5 py-10">Memuat foto…</p>}

            {status === 'error' && (
                <div className="px-5 py-10">
                    <p>Foto belum bisa dimuat.</p>
                    <button
                        type="button"
                        onClick={() => setReloadKey((k) => k + 1)}
                        className={`mt-3 rounded-md bg-[#E9C46A] px-4 py-2 font-medium text-[#1D2A26] ${focusRing}`}
                    >
                        Coba lagi
                    </button>
                </div>
            )}

            {status === 'ready' && photos.length === 0 && (
                <p className="px-5 py-10 text-lg">Belum ada foto di tempat ini.</p>
            )}

            {photos.length > 0 && (
                <div className="columns-2 gap-4 px-5 pb-8 pt-3">
                    {photos.map((photo) => (
                        <figure
                            key={photo.id}
                            className="mb-6 break-inside-avoid"
                            style={{ transform: `rotate(${tiltFor(photo.id)}deg)` }}
                        >
                            <button
                                type="button"
                                onClick={() => setLightbox(photo)}
                                className={`relative block w-full bg-[#FBFAF6] p-2 pb-3 text-left shadow-md ${focusRing}`}
                            >
                                <span
                                    aria-hidden="true"
                                    className="absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2 rotate-2 bg-[#E9C46A]/80"
                                />
                                <img
                                    src={photo.thumb_url}
                                    alt={photo.caption || `Foto kenangan di ${place.name}`}
                                    loading="lazy"
                                    className="block w-full bg-[#E6E2D6]"
                                    style={{
                                        aspectRatio:
                                            photo.width && photo.height ? `${photo.width} / ${photo.height}` : '4 / 3',
                                    }}
                                />
                                {photo.caption && (
                                    <span className="mt-2 block text-lg leading-tight text-[#1D2A26] [font-family:Caveat,cursive]">
                                        {photo.caption}
                                    </span>
                                )}
                            </button>
                        </figure>
                    ))}
                </div>
            )}

            {nextCursor && (
                <div className="px-5 pb-8 text-center">
                    {moreFailed && <p className="mb-2 text-sm">Gagal memuat. Coba lagi.</p>}
                    <button
                        type="button"
                        onClick={loadMore}
                        disabled={loadingMore}
                        className={`rounded-md bg-[#E9C46A] px-4 py-2 font-medium text-[#1D2A26] disabled:opacity-60 ${focusRing}`}
                    >
                        {loadingMore ? 'Memuat…' : 'Muat foto lainnya'}
                    </button>
                </div>
            )}

            {lightbox && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Foto ukuran penuh"
                    className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4"
                    onClick={() => setLightbox(null)}
                >
                    <img
                        src={lightbox.full_url}
                        alt={lightbox.caption || `Foto kenangan di ${place.name}`}
                        className="max-h-full max-w-full object-contain"
                    />
                    <button
                        type="button"
                        aria-label="Tutup foto"
                        onClick={() => setLightbox(null)}
                        className={`absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 text-2xl text-white ${focusRing}`}
                    >
                        ×
                    </button>
                </div>
            )}
        </aside>
    );
}
