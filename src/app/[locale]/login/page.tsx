'use client';

import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import PageTransition from '@/components/PageTransition';
import { LogIn, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function LoginPage() {
    const t = useTranslations('auth');
    const router = useRouter();
    const locale = useLocale();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/' });
    };

    const handleCredentialsSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError('Invalid email or password');
            setLoading(false);
        } else {
            router.push(`/${locale}`);
            router.refresh();
        }
    };

    return (
        <PageTransition>
            <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-[#050D09] relative overflow-hidden star-pattern">
                {/* Celestial Background Elements */}
                <div className="absolute inset-0 z-0">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                            rotate: [0, 45, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-20%] right-[-10%] w-[60%] aspect-square bg-gradient-to-br from-primary-500/30 to-accent-500/20 blur-[120px] rounded-full"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.2, 0.4, 0.2],
                            rotate: [0, -45, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-[-20%] left-[-10%] w-[60%] aspect-square bg-gradient-to-tr from-secondary-500/20 to-primary-500/30 blur-[120px] rounded-full"
                    />

                    {/* Floating Orbs */}
                    {mounted && [...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
                            animate={{
                                y: [0, -20, 0],
                                opacity: [0.2, 0.5, 0.2]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2
                            }}
                            className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
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
                        <GlassCard elevated={false} hover={false} className="p-0 border-white/10 overflow-hidden shadow-2xl shadow-black/50 bg-[#0A1410]/60 backdrop-blur-xl">
                            {/* Card Header with Animated Gradient */}
                            <div className="relative px-8 pb-6 pt-8 text-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent pointer-events-none" />
                                <motion.div
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl" />
                                    <div className="relative z-10 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                                        <LogIn size={28} className="text-white" />
                                    </div>
                                </motion.div>

                                <motion.h1
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-3xl font-display font-bold mb-2 tracking-tight"
                                >
                                    <span className="gradient-text">{t('welcomeBack')}</span>
                                </motion.h1>
                                <motion.p
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-text-secondary text-sm font-medium"
                                >
                                    {t('subtitle')}
                                </motion.p>
                            </div>

                            <div className="px-8 pb-8 pt-2">
                                <form onSubmit={handleCredentialsSignIn} className="space-y-6">
                                    <motion.div
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">{t('email')}</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="text-text-muted group-focus-within:text-primary-400 transition-colors" size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="email@example.com"
                                                required
                                                className="w-full bg-[#0A1410]/80 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 transition-all font-medium placeholder:text-text-muted/40 shadow-inner"
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">{t('password')}</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="text-text-muted group-focus-within:text-primary-400 transition-colors" size={18} />
                                            </div>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                required
                                                className="w-full bg-[#0A1410]/80 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 transition-all font-medium placeholder:text-text-muted/40 shadow-inner"
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
                                        transition={{ delay: 0.8 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-14 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 relative overflow-hidden group/btn shadow-2xl shadow-emerald-900/30 hover:shadow-emerald-600/40"
                                        style={{ background: 'var(--gradient-primary)' }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {loading ? '...' : (
                                                <>
                                                    {t('signIn')}
                                                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                    </motion.button>
                                </form>

                                <div className="mt-8 relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/8" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-[#0A1410]/80 backdrop-blur-md px-5 py-1 text-[11px] font-black uppercase tracking-[0.25em] text-text-muted/60 border border-white/5 rounded-full">Or continue with</span>
                                    </div>
                                </div>

                                <motion.button
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                    onClick={handleGoogleSignIn}
                                    className="mt-6 w-full flex items-center justify-center gap-3 h-14 rounded-xl font-bold transition-all duration-300 bg-[#0A1410]/80 border border-white/10 hover:bg-[#0F1F1A] hover:border-white/25 text-text-primary shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="text-sm">{t('signInWithGoogle')}</span>
                                </motion.button>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="mt-8 text-center"
                                >
                                    <span className="text-text-secondary text-sm font-medium">{t('noAccount')} </span>
                                    <Link
                                        href={`/${locale}/register`}
                                        className="text-primary-400 font-bold hover:text-primary-300 transition-colors underline decoration-1 underline-offset-4"
                                    >
                                        {t('signUp')}
                                    </Link>
                                </motion.div>

                                <p className="mt-8 text-[11px] text-text-muted/50 font-medium leading-relaxed max-w-[300px] mx-auto text-center tracking-wide">
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
