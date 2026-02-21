'use client';

import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import PageTransition from '@/components/PageTransition';
import { Mail, Lock, Sparkles, ArrowRight, Eye, EyeOff, Waves } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { QalbyLogo } from '@/components/QalbyLogo';

export default function LoginPage() {
    const t = useTranslations('auth');
    const router = useRouter();
    const locale = useLocale();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
            <div className="min-h-[100dvh] flex items-center justify-center p-4 md:p-6 bg-[#030806] relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <motion.div
                        animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.4, 0.6, 0.4],
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-25%] right-[-15%] w-[70%] aspect-square bg-gradient-to-br from-emerald-500/25 via-teal-500/20 to-cyan-500/15 blur-[140px] rounded-full"
                    />
                    <motion.div
                        animate={{
                            scale: [1.1, 1, 1.1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-[-25%] left-[-15%] w-[70%] aspect-square bg-gradient-to-tr from-teal-500/20 via-emerald-500/25 to-green-500/15 blur-[140px] rounded-full"
                    />

                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }} />

                    {mounted && [...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                x: Math.random() * 100 + '%',
                                y: Math.random() * 100 + '%',
                                scale: Math.random() * 0.5 + 0.5
                            }}
                            animate={{
                                y: [null, Math.random() * -30 - 10],
                                opacity: [0.15, 0.5, 0.15]
                            }}
                            transition={{
                                duration: 4 + Math.random() * 4,
                                repeat: Infinity,
                                delay: Math.random() * 3,
                                ease: "easeInOut"
                            }}
                            className="absolute w-0.5 h-0.5 bg-emerald-300 rounded-full blur-[0.5px]"
                        />
                    ))}

                    <motion.div
                        animate={{ x: [-20, 20, -20], opacity: [0.05, 0.1, 0.05] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-10 left-0 right-0 flex justify-center"
                    >
                        <Waves className="w-96 h-12 text-emerald-500/20" />
                    </motion.div>
                </div>

                <div className="w-full max-w-md relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <GlassCard
                            elevated={true}
                            hover={false}
                            className="p-0 border border-white/8 overflow-hidden bg-gradient-to-b from-[#0a1512]/90 to-[#06100c]/95 backdrop-blur-2xl"
                        >
                            <div className="relative px-6 sm:px-8 pb-6 pt-8 text-center overflow-hidden">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-emerald-400/30 to-teal-400/20 blur-2xl rounded-full"
                                />

                                <motion.div
                                    initial={{ y: -15, opacity: 0, scale: 0.9 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="relative w-18 h-18 mx-auto mb-5"
                                >
                                    <div className="w-18 h-18 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl shadow-emerald-900/40">
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                                        <div className="relative z-10">
                                            <QalbyLogo size={48} />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.h1
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-2.5xl sm:text-3xl font-display font-bold mb-2 tracking-tight"
                                >
                                    <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                                        {t('welcomeBack')}
                                    </span>
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

                            <div className="px-6 sm:px-8 pb-8 pt-4">
                                <form onSubmit={handleCredentialsSignIn} className="space-y-6">
                                    <motion.div
                                        initial={{ x: -15, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] ml-1">
                                            {t('email')}
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                                <Mail className="text-text-muted/60 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="your@email.com"
                                                required
                                                autoComplete="email"
                                                className="w-full bg-[#030806]/60 border border-white/8 rounded-xl py-4 pl-12 pr-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 transition-all font-medium placeholder:text-text-muted/30 text-sm"
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ x: -15, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] ml-1">
                                            {t('password')}
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                                <Lock className="text-text-muted/60 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                required
                                                autoComplete="current-password"
                                                className="w-full bg-[#030806]/60 border border-white/8 rounded-xl py-4 pl-12 pr-12 text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 transition-all font-medium placeholder:text-text-muted/30 text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted/40 hover:text-text-muted transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </motion.div>

                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20"
                                            >
                                                <Sparkles size={14} className="text-red-400 flex-shrink-0" />
                                                <span className="text-red-400 text-xs font-medium">{error}</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <motion.button
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 rounded-xl font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                        style={{
                                            background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #0d9488 100%)',
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {loading ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                />
                                            ) : (
                                                <>
                                                    {t('signIn')}
                                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                    </motion.button>
                                </form>

                                <div className="mt-10 mb-8 relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/6" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-[#0a1512] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/50 border border-white/5 rounded-full">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                <motion.button
                                    initial={{ y: 15, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                    onClick={handleGoogleSignIn}
                                    className="mt-5 w-full flex items-center justify-center gap-3 h-12 rounded-xl font-semibold transition-all duration-300 bg-white/[0.03] border border-white/8 hover:bg-white/[0.06] hover:border-white/15 text-text-primary hover:shadow-lg hover:shadow-black/20"
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
                                    className="mt-10 text-center"
                                >
                                    <span className="text-text-secondary text-sm font-medium">{t('noAccount')} </span>
                                    <Link
                                        href={`/${locale}/register`}
                                        className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors underline decoration-1 underline-offset-4"
                                    >
                                        {t('signUp')}
                                    </Link>
                                </motion.div>

                                <p className="mt-6 text-[11px] text-text-muted/40 font-medium leading-relaxed max-w-[280px] mx-auto text-center tracking-wide">
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
