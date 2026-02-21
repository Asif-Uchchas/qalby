'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import PageTransition from '@/components/PageTransition';
import { UserPlus, Mail, Lock, User, Sparkles, ArrowRight, Eye, EyeOff, Camera, Upload, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { registerUser } from './actions';
import { QalbyLogo } from '@/components/QalbyLogo';
import Image from 'next/image';

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
    const [showPassword, setShowPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => setMounted(true), []);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size must be less than 5MB');
                return;
            }
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);

        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

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
            <div className="min-h-[100dvh] flex items-center justify-center p-4 md:p-6 bg-[#030806] relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <motion.div
                        animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.4, 0.6, 0.4],
                        }}
                        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-25%] left-[-15%] w-[70%] aspect-square bg-gradient-to-br from-teal-500/25 via-emerald-500/20 to-cyan-500/15 blur-[140px] rounded-full"
                    />
                    <motion.div
                        animate={{
                            scale: [1.1, 1, 1.1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-[-25%] right-[-15%] w-[70%] aspect-square bg-gradient-to-tr from-emerald-500/20 via-teal-500/25 to-green-500/15 blur-[140px] rounded-full"
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
                                y: [null, Math.random() * 30 + 10],
                                opacity: [0.15, 0.5, 0.15]
                            }}
                            transition={{
                                duration: 4 + Math.random() * 4,
                                repeat: Infinity,
                                delay: Math.random() * 3,
                                ease: "easeInOut"
                            }}
                            className="absolute w-0.5 h-0.5 bg-teal-300 rounded-full blur-[0.5px]"
                        />
                    ))}
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
                                    className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-teal-400/30 to-emerald-400/20 blur-2xl rounded-full"
                                />

                                <motion.div
                                    initial={{ y: -15, opacity: 0, scale: 0.9 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="relative w-18 h-18 mx-auto mb-5"
                                >
                                    <div className="w-18 h-18 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl shadow-teal-900/40">
                                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500" />
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
                                    <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                                        {t('signUp')}
                                    </span>
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

                            <div className="px-6 sm:px-8 pb-8 pt-4">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Avatar Upload */}
                                    <motion.div
                                        initial={{ x: -15, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.55 }}
                                        className="flex flex-col items-center"
                                    >
                                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] mb-3">
                                            Profile Photo (Optional)
                                        </label>
                                        <div className="relative">
                                            <div
                                                className="w-24 h-24 rounded-full overflow-hidden cursor-pointer transition-all duration-300 group"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                {avatarPreview ? (
                                                    <Image
                                                        src={avatarPreview}
                                                        alt="Avatar preview"
                                                        width={96}
                                                        height={96}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-[#030806]/60 border-2 border-dashed border-white/20 flex items-center justify-center group-hover:border-teal-500/50 group-hover:bg-[#030806]/80 transition-all">
                                                        <Camera className="w-8 h-8 text-text-muted/50 group-hover:text-teal-400 transition-colors" />
                                                    </div>
                                                )}
                                            </div>

                                            {avatarPreview && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeAvatar();
                                                    }}
                                                    className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <X size={14} className="text-white" />
                                                </button>
                                            )}

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                            />
                                        </div>
                                        <p className="mt-2 text-xs text-text-muted/50">Click to upload • Max 5MB</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ x: -15, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] ml-1">
                                            {t('name')}
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                                <User className="text-text-muted/60 group-focus-within:text-teal-400 transition-colors" size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Full Name"
                                                required
                                                autoComplete="name"
                                                className="w-full bg-[#030806]/60 border border-white/8 rounded-xl py-4 pl-12 pr-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/40 transition-all font-medium placeholder:text-text-muted/30 text-sm"
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
                                            {t('email')}
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                                <Mail className="text-text-muted/60 group-focus-within:text-teal-400 transition-colors" size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="your@email.com"
                                                required
                                                autoComplete="email"
                                                className="w-full bg-[#030806]/60 border border-white/8 rounded-xl py-4 pl-12 pr-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/40 transition-all font-medium placeholder:text-text-muted/30 text-sm"
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ x: -15, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] ml-1">
                                            {t('password')}
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                                <Lock className="text-text-muted/60 group-focus-within:text-teal-400 transition-colors" size={18} />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                required
                                                minLength={6}
                                                autoComplete="new-password"
                                                className="w-full bg-[#030806]/60 border border-white/8 rounded-xl py-4 pl-12 pr-12 text-text-primary focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/40 transition-all font-medium placeholder:text-text-muted/30 text-sm"
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
                                        transition={{ delay: 0.9 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 rounded-xl font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                        style={{
                                            background: 'linear-gradient(135deg, #14b8a6 0%, #10b981 50%, #0d9488 100%)',
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
                                                    {t('signUp')}
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

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="mt-10 text-center"
                                >
                                    <span className="text-text-secondary text-sm font-medium">{t('hasAccount')} </span>
                                    <Link
                                        href={`/${locale}/login`}
                                        className="text-teal-400 font-semibold hover:text-teal-300 transition-colors underline decoration-1 underline-offset-4"
                                    >
                                        {t('signIn')}
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
