'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import PageTransition from '@/components/PageTransition';
import { UserPlus, Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { registerUser } from './actions';

export default function RegisterPage() {
    const t = useTranslations('auth');
    const router = useRouter();
    const locale = useLocale();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);

        const result = await registerUser(formData);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push(`/${locale}/login?registered=true`);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-[#0A0A0F] relative overflow-hidden star-pattern">
                {/* Celestial Background Elements - Teal Focus */}
                <div className="absolute inset-0 z-0">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                            rotate: [0, 45, 0]
                        }}
                        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square bg-gradient-to-br from-secondary-500/30 to-primary-500/20 blur-[120px] rounded-full"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.2, 0.4, 0.2],
                            rotate: [0, -45, 0]
                        }}
                        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-[-20%] right-[-10%] w-[60%] aspect-square bg-gradient-to-tr from-accent-500/20 to-secondary-500/30 blur-[120px] rounded-full"
                    />

                    {/* Floating Orbs */}
                    {mounted && [...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
                            animate={{
                                y: [-10, 20, -10],
                                opacity: [0.1, 0.4, 0.1]
                            }}
                            transition={{
                                duration: 4 + Math.random() * 3,
                                repeat: Infinity,
                                delay: Math.random() * 2
                            }}
                            className="absolute w-1 h-1 bg-secondary-400 rounded-full blur-[1px]"
                            style={{ left: Math.random() * 100 + '%', top: Math.random() * 100 + '%' }}
                        />
                    ))}
                </div>

                <div className="w-full max-w-md relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <GlassCard elevated={false} hover={false} className="p-0 border-white/5 overflow-hidden shadow-2xl shadow-black/50">
                            {/* Card Header with Animated Gradient */}
                            <div className="relative p-8 pb-4 text-center">
                                <motion.div
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-2xl" />
                                    <UserPlus size={32} className="text-white relative z-10" />
                                </motion.div>

                                <motion.h1
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-3xl font-display font-bold mb-2 tracking-tight"
                                >
                                    <span className="gradient-text-secondary">{t('signUp')}</span>
                                </motion.h1>
                                <motion.p
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-text-secondary text-sm font-medium"
                                >
                                    Join the Qalby community today
                                </motion.p>
                            </div>

                            <div className="px-8 pb-8 pt-4">
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <motion.div
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="space-y-1.5"
                                    >
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">{t('name')}</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="text-text-muted group-focus-within:text-secondary-400 transition-colors" size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Full Name"
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary-500/30 focus:border-secondary-500/50 transition-all font-medium placeholder:text-text-muted/50"
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                        className="space-y-1.5"
                                    >
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">{t('email')}</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="text-text-muted group-focus-within:text-secondary-400 transition-colors" size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="email@example.com"
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary-500/30 focus:border-secondary-500/50 transition-all font-medium placeholder:text-text-muted/50"
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="space-y-1.5"
                                    >
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">{t('password')}</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="text-text-muted group-focus-within:text-secondary-400 transition-colors" size={18} />
                                            </div>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary-500/30 focus:border-secondary-500/50 transition-all font-medium placeholder:text-text-muted/50"
                                            />
                                        </div>
                                    </motion.div>

                                    <AnimatePresence>
                                        {error && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="text-warm-400 text-xs font-semibold flex items-center gap-1.5"
                                            >
                                                <Sparkles size={12} /> {error}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>

                                    <motion.button
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.9 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-[54px] rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 relative overflow-hidden group/btn shadow-xl shadow-secondary-500/20"
                                        style={{ background: 'var(--gradient-secondary)' }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {loading ? '...' : (
                                                <>
                                                    {t('signUp')}
                                                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                    </motion.button>
                                </form>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="mt-10 text-center"
                                >
                                    <span className="text-text-secondary text-sm font-medium">{t('hasAccount')} </span>
                                    <Link
                                        href={`/${locale}/login`}
                                        className="text-secondary-400 font-bold hover:text-secondary-300 transition-colors"
                                    >
                                        {t('signIn')}
                                    </Link>
                                </motion.div>

                                <p className="mt-8 text-[10px] text-text-muted/40 font-medium leading-relaxed max-w-[280px] mx-auto uppercase tracking-tighter text-center">
                                    {t('termsDisclaimer')}
                                </p>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
}
