'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    CalendarDays,
    BookOpen,
    Moon,
    Heart,
    User,
} from 'lucide-react';

const navItems = [
    { id: 'dashboard', href: '/', icon: LayoutDashboard },
    { id: 'planner', href: '/planner', icon: CalendarDays },
    { id: 'quran', href: '/quran', icon: BookOpen },
    { id: 'prayers', href: '/prayers', icon: Moon },
    { id: 'duas', href: '/duas', icon: Heart },
    { id: 'profile', href: '/profile', icon: User },
];

export default function BottomNav() {
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations('nav');

    const getHref = (href: string) => `/${locale}${href === '/' ? '' : href}`;

    const isActive = (href: string) => {
        const localePath = `/${locale}${href === '/' ? '' : href}`;
        if (href === '/') {
            return pathname === `/${locale}` || pathname === `/${locale}/`;
        }
        return pathname.startsWith(localePath);
    };

    return (
        <nav
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderTop: '1px solid var(--glass-border)',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    height: '72px',
                    maxWidth: '500px',
                    margin: '0 auto',
                    padding: '0 8px',
                }}
            >
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;
                    const label = t(item.id as 'dashboard' | 'planner' | 'quran' | 'prayers' | 'duas');

                    return (
                        <Link key={item.id} href={getHref(item.href)} style={{ textDecoration: 'none' }}>
                            <motion.div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '8px 12px',
                                    borderRadius: 'var(--radius-md)',
                                    position: 'relative',
                                    cursor: 'pointer',
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="activeTab"
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.15))',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid rgba(16, 185, 129, 0.4)',
                                        }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <Icon
                                    size={22}
                                    style={{
                                        color: active ? '#10B981' : 'var(--text-muted)',
                                        position: 'relative',
                                        zIndex: 1,
                                        filter: active ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))' : 'none',
                                        transition: 'color 0.2s ease',
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: '10px',
                                        fontWeight: active ? 700 : 500,
                                        color: active ? '#10B981' : 'var(--text-muted)',
                                        position: 'relative',
                                        zIndex: 1,
                                        transition: 'color 0.2s ease',
                                    }}
                                >
                                    {label}
                                </span>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
