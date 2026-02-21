import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Qalby - Ramadan Companion',
        short_name: 'Qalby',
        description: 'A premium spiritual companion for Ramadan. Track prayers, Quran progress, duas, and daily goals.',
        start_url: '/',
        display: 'standalone',
        background_color: '#050D09',
        theme_color: '#10B981',
        orientation: 'portrait-primary',
        icons: [
            {
                src: '/icon?size=192',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon?size=512',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
        categories: ['lifestyle', 'religion'],
        lang: 'en',
        dir: 'ltr',
    };
}
