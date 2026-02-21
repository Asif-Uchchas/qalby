import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DM_Sans, Amiri, JetBrains_Mono, Noto_Sans_Bengali } from 'next/font/google';
import { routing } from '@/i18n/routing';
import BottomNav from '@/components/BottomNav';
import ThemeProvider from '@/components/ThemeProvider';
import AuthProvider from '@/components/AuthProvider';
import '../globals.css';

const dmSans = DM_Sans({
    subsets: ['latin'],
    variable: '--font-dm-sans',
    display: 'swap',
});

const amiri = Amiri({
    subsets: ['arabic', 'latin'],
    weight: ['400', '700'],
    variable: '--font-amiri',
    display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains',
    display: 'swap',
});

const notoBangla = Noto_Sans_Bengali({
    subsets: ['bengali'],
    variable: '--font-noto-bangla',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Qalby — Your Ramadan Companion',
    description:
        'A premium spiritual companion for Ramadan. Track prayers, Quran progress, duas, and daily goals with a beautiful celestial interface.',
    keywords: ['Ramadan', 'Prayer Tracker', 'Quran', 'Islamic', 'Dua', 'Dhikr', 'Planner'],
    manifest: '/manifest.json',
};

export const viewport: Viewport = {
    themeColor: '#0A0A0F',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Validate locale
    if (!routing.locales.includes(locale as 'en' | 'bn')) {
        notFound();
    }

    setRequestLocale(locale);

    const messages = await getMessages();

    return (
        <html
            lang={locale}
            dir="ltr"
            className={`${dmSans.variable} ${amiri.variable} ${jetbrainsMono.variable} ${notoBangla.variable}`}
        >
            <body
                style={{
                    fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                }}
            >
                <ThemeProvider>
                    <NextIntlClientProvider messages={messages}>
                        <AuthProvider>
                            <div className="geometric-bg" style={{ minHeight: '100dvh' }}>
                                <main className="main-content pt-4" style={{ position: 'relative', zIndex: 1 }}>
                                    {children}
                                </main>
                                <BottomNav />
                            </div>
                        </AuthProvider>
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
