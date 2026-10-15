export type Place = {
    id: number;
    name: string;
    slug: string;
    lat: number;
    lng: number;
    category: string | null;
    photos_count: number;
};

export type Photo = {
    id: number;
    place_id: number;
    cloudinary_public_id: string;
    width: number | null;
    height: number | null;
    caption: string | null;
    created_at: string;
    thumb_url: string;
    full_url: string;
};

export type PhotoPage = {
    data: Photo[];
    next_cursor: string | null;
};
