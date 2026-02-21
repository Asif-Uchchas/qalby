import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DM_Sans, Amiri, JetBrains_Mono, Noto_Sans_Bengali } from 'next/font/google';
import { routing } from '@/i18n/routing';
import BottomNav from '@/components/BottomNav';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
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
            data-theme="dark"
            className={`${dmSans.variable} ${amiri.variable} ${jetbrainsMono.variable} ${notoBangla.variable}`}
        >
            <body
                style={{
                    fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                }}
            >
                <NextIntlClientProvider messages={messages}>
                    <div className="geometric-bg" style={{ minHeight: '100dvh' }}>
                        <header 
                            className="fixed top-0 left-0 right-0 z-40 px-4 py-3 flex justify-end gap-2"
                            style={{
                                background: 'rgba(10, 10, 15, 0.7)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            }}
                        >
                            <LanguageToggle />
                            <ThemeToggle />
                        </header>
                        <main className="main-content pt-16" style={{ position: 'relative', zIndex: 1 }}>
                            {children}
                        </main>
                        <BottomNav />
                    </div>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
