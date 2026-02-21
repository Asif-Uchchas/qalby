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
        const segments = pathname.split('/');
        segments[1] = newLocale;
        router.push(segments.join('/'));
    };

    return (
        <motion.div
            className="flex items-center gap-2 px-4 py-3 glass-card hover:border-accent-gold/40 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
                minWidth: '100px',
                justifyContent: 'center',
                border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
        >
            <Languages size={20} style={{ color: '#10B981' }} />
            <span style={{ color: '#10B981', fontWeight: 600 }}>
                {locale === 'en' ? 'বাং' : 'EN'}
            </span>
            <motion.div
                className="w-2 h-2 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                style={{ backgroundColor: '#10B981' }}
            />
        </motion.div>
    );
}
