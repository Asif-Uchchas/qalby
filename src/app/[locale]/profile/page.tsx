'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import GlassCard from '@/components/GlassCard';
import PageTransition from '@/components/PageTransition';
import {
    Sun,
    Moon,
    Languages,
    LogOut,
    LogIn,
    UserPlus,
    Settings,
    Bell,
    Shield,
    HelpCircle,
    User as UserIcon,
    ChevronRight,
} from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
    const t = useTranslations('profile');
    const router = useRouter();
    const locale = useLocale();
    const { theme, setTheme } = useAppStore();
    const { data: session, status } = useSession();
    const isLoggedIn = status === 'authenticated';

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };

    const toggleLocale = () => {
        const newLocale = locale === 'en' ? 'bn' : 'en';
        router.push(`/${newLocale}/profile`);
    };

    const handleAuth = () => {
        if (isLoggedIn) {
            signOut();
        } else {
            router.push(`/${locale}/login`);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <PageTransition>
            <motion.div
                className="max-w-2xl mx-auto p-6 w-full min-h-screen pb-24"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
                        {t('title')}
                    </h1>
                </div>

                <div className="space-y-6">
                    {/* Profile Card */}
                    <motion.div variants={itemVariants}>
                        <GlassCard elevated={false} className="relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-colors" />
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="relative group/avatar">
                                    <div
                                        className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden ring-2 ring-white/10 shadow-xl transition-transform duration-500 group-hover/avatar:scale-105"
                                        style={{
                                            background: 'linear-gradient(135deg, var(--primary-500), var(--accent-400))',
                                        }}
                                    >
                                        {session?.user?.image ? (
                                            <Image
                                                src={session.user.image}
                                                alt={session.user.name || 'User'}
                                                width={80}
                                                height={80}
                                                className="object-cover"
                                            />
                                        ) : (
                                            <UserIcon size={36} className="text-white" />
                                        )}
                                    </div>
                                    {isLoggedIn && (
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-background rounded-full shadow-lg" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-text-primary mb-1">
                                        {isLoggedIn ? session?.user?.name : t('guest')}
                                    </h2>
                                    <p className="text-sm text-text-muted flex items-center gap-2">
                                        {isLoggedIn ? session?.user?.email : t('loginPrompt')}
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Account Actions */}
                    <motion.div variants={itemVariants}>
                        <GlassCard elevated={false} className="border-white/5">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-6 px-1">
                                {t('account')}
                            </h3>
                            <div className="space-y-4">
                                {isLoggedIn ? (
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full group flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-[1.01]"
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.08)',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                        }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 rounded-lg bg-red-500/20 text-red-500">
                                                <LogOut size={20} />
                                            </div>
                                            <span className="font-semibold text-red-500">{t('logout')}</span>
                                        </div>
                                        <ChevronRight size={18} className="text-red-500/50 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => router.push(`/${locale}/login`)}
                                            className="group flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                                            style={{
                                                background: 'rgba(16, 185, 129, 0.08)',
                                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                            }}
                                        >
                                            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                                                <LogIn size={24} />
                                            </div>
                                            <span className="font-bold text-emerald-400">{t('login')}</span>
                                        </button>
                                        <button
                                            onClick={() => router.push(`/${locale}/login`)}
                                            className="group flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                                            style={{
                                                background: 'rgba(46, 207, 196, 0.08)',
                                                border: '1px solid rgba(46, 207, 196, 0.2)',
                                            }}
                                        >
                                            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                                                <UserPlus size={24} />
                                            </div>
                                            <span className="font-bold text-amber-400">{t('register')}</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Appearance Settings */}
                    <motion.div variants={itemVariants}>
                        <GlassCard elevated={false} className="border-white/5">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-6 px-1">
                                {t('appearance')}
                            </h3>
                            <div className="space-y-4">
                                {/* Theme Toggle */}
                                <button
                                    onClick={toggleTheme}
                                    className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:bg-white/5"
                                    style={{
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                    }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-lg ${theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-500'}`}>
                                            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-text-primary">{t('theme')}</p>
                                            <p className="text-xs text-text-muted">{theme === 'dark' ? t('darkMode') : t('lightMode')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-6 rounded-full bg-white/10 relative p-1 transition-colors">
                                            <motion.div
                                                className={`w-4 h-4 rounded-full ${theme === 'dark' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                animate={{ x: theme === 'dark' ? 24 : 0 }}
                                            />
                                        </div>
                                    </div>
                                </button>

                                {/* Language Toggle */}
                                <button
                                    onClick={toggleLocale}
                                    className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:bg-white/5"
                                    style={{
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                    }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 rounded-lg bg-teal-500/20 text-teal-400">
                                            <Languages size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-text-primary">{t('language')}</p>
                                            <p className="text-xs text-text-muted">{locale === 'en' ? 'English' : 'বাংলা'}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-text-muted" />
                                </button>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Other Settings */}
                    <motion.div variants={itemVariants}>
                        <GlassCard elevated={false} className="border-white/5">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-6 px-1">
                                {t('settings')}
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { icon: Bell, label: t('notifications'), color: 'var(--primary-400)' },
                                    { icon: Shield, label: t('privacy'), color: 'var(--secondary-400)' },
                                    { icon: HelpCircle, label: t('help'), color: 'var(--accent-400)' },
                                ].map((item, idx) => (
                                    <button
                                        key={idx}
                                        className="w-full group flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:bg-white/5"
                                    >
                                        <div className="flex items-center gap-4">
                                            <item.icon size={20} style={{ color: item.color }} className="opacity-80" />
                                            <span className="font-medium text-text-primary group-hover:text-white transition-colors">
                                                {item.label}
                                            </span>
                                        </div>
                                        <ChevronRight size={18} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* App Info */}
                    <motion.div variants={itemVariants} className="text-center py-8">
                        <div className="inline-block p-2 rounded-lg bg-white/5 border border-white/10 mb-3">
                            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">Qalby v1.0.0</p>
                        </div>
                        <p className="text-text-muted text-xs opacity-60">Your Premium Spiritual Companion</p>
                    </motion.div>
                </div>
            </motion.div>
        </PageTransition>
    );
}
