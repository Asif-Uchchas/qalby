'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';

export default function LanguageToggle() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLocale = () => {
        const newLocale = locale === 'en' ? 'bn' : 'en';
        // Replace the locale segment in the pathname
        const segments = pathname.split('/');
        segments[1] = newLocale;
        router.push(segments.join('/'));
    };

    return (
        <motion.button
            onClick={toggleLocale}
            className="press-effect glass-card flex items-center gap-2 px-3 py-2 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={locale === 'en' ? 'বাংলায় পড়ুন' : 'Switch to English'}
            style={{
                border: '1px solid rgba(139, 92, 246, 0.3)',
            }}
        >
            <Languages size={16} style={{ color: '#A78BFA' }} />
            <span style={{ color: '#A78BFA', fontWeight: 600 }}>
                {locale === 'en' ? 'বাং' : 'EN'}
            </span>
        </motion.button>
    );
}
