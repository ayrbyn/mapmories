import { useCallback, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import MapGL, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import PlacePanel from '@/components/PlacePanel';
import type { Place } from '@/types/place';

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';
const START_VIEW = { longitude: 98.6785, latitude: 3.5845, zoom: 12.5 };

function Pin({ active }: { active: boolean }) {
    const w = active ? 38 : 30;
    const h = active ? 48 : 38;

    return (
        <svg width={w} height={h} viewBox="0 0 30 38" aria-hidden="true" className="drop-shadow-md">
            <path
                d="M15 37C15 37 2 23.5 2 14.5a13 13 0 0 1 26 0C28 23.5 15 37 15 37Z"
                fill="#D64045"
                stroke="#FBFAF6"
                strokeWidth="2"
            />
            <circle cx="15" cy="14.5" r="5" fill="#FBFAF6" />
        </svg>
    );
}

export default function MapPage() {
    const mapRef = useRef<MapRef>(null);
    const abortRef = useRef<AbortController | null>(null);
    const [places, setPlaces] = useState<Place[]>([]);
    const [selected, setSelected] = useState<Place | null>(null);

    const loadPlaces = useCallback(() => {
        const map = mapRef.current;
        if (!map) return;

        const b = map.getBounds();
        const bbox = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]
            .map((n) => n.toFixed(5))
            .join(',');

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        fetch(`/api/places?bbox=${bbox}`, {
            signal: controller.signal,
            headers: { Accept: 'application/json' },
        })
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
            .then((json: { data: Place[] }) => setPlaces(json.data))
            .catch((err: Error) => {
                if (err.name !== 'AbortError') console.error('Gagal memuat pin:', err);
            });
    }, []);

    function selectPlace(place: Place) {
        setSelected(place);

        const map = mapRef.current;
        if (!map) return;

        const wide = window.innerWidth >= 768;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Geser pusat peta supaya pin tidak tertutup panel mading.
        map.flyTo({
            center: [place.lng, place.lat],
            zoom: Math.max(map.getZoom(), 14),
            padding: wide ? { right: 420 } : { bottom: Math.round(window.innerHeight * 0.4) },
            duration: reduceMotion ? 0 : 600,
        });
    }

    return (
        <>
            <Head title="Mapmories" />

            <div className="relative h-dvh w-full overflow-hidden">
                <MapGL
                    ref={mapRef}
                    initialViewState={START_VIEW}
                    mapStyle={MAP_STYLE}
                    style={{ width: '100%', height: '100%' }}
                    onLoad={loadPlaces}
                    onMoveEnd={loadPlaces}
                >
                    <NavigationControl position="top-left" showCompass={false} />

                    {places.map((place) => (
                        <Marker key={place.id} longitude={place.lng} latitude={place.lat} anchor="bottom">
                            <button
                                type="button"
                                aria-label={`Buka mading ${place.name}`}
                                onClick={() => selectPlace(place)}
                                className="block cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4A43]"
                            >
                                <Pin active={selected?.id === place.id} />
                            </button>
                        </Marker>
                    ))}
                </MapGL>

                <div className="absolute right-4 top-4 z-10 rounded-full bg-[#FBFAF6]/95 px-4 py-2 text-sm font-semibold text-[#1D2A26] shadow md:left-16 md:right-auto">
                    Mapmories
                </div>

                {selected && <PlacePanel place={selected} onClose={() => setSelected(null)} />}
            </div>
        </>
    );
}
