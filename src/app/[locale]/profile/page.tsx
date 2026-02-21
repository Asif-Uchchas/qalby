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
    User as UserIcon,
    ChevronRight,
    Camera,
    Lock,
    X,
    Check,
    Loader2,
    KeyRound,
    Upload,
} from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { updatePassword, updateProfilePhoto, updateUserName } from './actions';

export default function ProfilePage() {
    const t = useTranslations('profile');
    const router = useRouter();
    const locale = useLocale();
    const { theme, setTheme } = useAppStore();
    const { data: session, status, update: updateSession } = useSession();
    const isLoggedIn = status === 'authenticated';

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [photoLoading, setPhotoLoading] = useState(false);
    const [nameLoading, setNameLoading] = useState(false);
    const [name, setName] = useState(session?.user?.name || '');
    const [editingName, setEditingName] = useState(false);
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
        }
    }, [session?.user?.name]);

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

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            return;
        }

        setPhotoLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                await updateSession({ image: data.url });
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setPhotoLoading(false);
        }
    };

    const handleNameSave = async () => {
        if (!name.trim() || name === session?.user?.name) {
            setEditingName(false);
            return;
        }

        setNameLoading(true);
        try {
            await updateUserName(name);
            await updateSession({ name });
            setEditingName(false);
        } catch (error) {
            console.error('Name update failed:', error);
        } finally {
            setNameLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        setPasswordLoading(true);
        try {
            const result = await updatePassword(currentPassword, newPassword);
            if (result.error) {
                setPasswordError(result.error);
            } else {
                setPasswordSuccess('Password updated successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => {
                    setShowPasswordModal(false);
                    setPasswordSuccess('');
                }, 2000);
            }
        } catch (error) {
            setPasswordError('Failed to update password');
        } finally {
            setPasswordLoading(false);
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
                                        <>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                            />
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={photoLoading}
                                                className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-background rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-600 transition-colors disabled:opacity-50"
                                            >
                                                {photoLoading ? (
                                                    <Loader2 size={14} className="text-white animate-spin" />
                                                ) : (
                                                    <Camera size={14} className="text-white" />
                                                )}
                                            </button>
                                        </>
                                    )}
                                    <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-green-500 border-4 border-background rounded-full shadow-lg" />
                                </div>
                                <div className="flex-1">
                                    {isLoggedIn ? (
                                        <>
                                            {editingName ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="bg-[#030806]/60 border border-white/10 rounded-lg px-3 py-1.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={handleNameSave}
                                                        disabled={nameLoading}
                                                        className="p-1.5 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
                                                    >
                                                        {nameLoading ? (
                                                            <Loader2 size={14} className="text-white animate-spin" />
                                                        ) : (
                                                            <Check size={14} className="text-white" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingName(false);
                                                            setName(session?.user?.name || '');
                                                        }}
                                                        className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                    >
                                                        <X size={14} className="text-text-primary" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <h2 
                                                        onClick={() => setEditingName(true)}
                                                        className="text-xl font-bold text-text-primary cursor-pointer hover:text-emerald-400 transition-colors"
                                                    >
                                                        {session?.user?.name || 'Your Name'}
                                                    </h2>
                                                </div>
                                            )}
                                            <p className="text-sm text-text-muted flex items-center gap-2">
                                                {session?.user?.email}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <h2 className="text-xl font-bold text-text-primary mb-1">
                                                {t('guest')}
                                            </h2>
                                            <p className="text-sm text-text-muted flex items-center gap-2">
                                                {t('loginPrompt')}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {isLoggedIn && (
                        <motion.div variants={itemVariants}>
                            <GlassCard elevated={false} className="border-white/5">
                                <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-6 px-1">
                                    Account Settings
                                </h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setShowPasswordModal(true)}
                                        className="w-full group flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:bg-white/5"
                                        style={{
                                            border: '1px solid rgba(255, 255, 255, 0.05)',
                                        }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-500">
                                                <KeyRound size={20} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-text-primary">Change Password</p>
                                                <p className="text-xs text-text-muted">Update your account password</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

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

                    <motion.div variants={itemVariants}>
                        <GlassCard elevated={false} className="border-white/5">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-6 px-1">
                                {t('appearance')}
                            </h3>
                            <div className="space-y-4">
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

                    <motion.div variants={itemVariants}>
                        <GlassCard elevated={false} className="border-white/5">
                            <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-6 px-1">
                                {t('settings')}
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { icon: () => <span className="text-lg">🔔</span>, label: t('notifications'), color: 'var(--primary-400)' },
                                    { icon: () => <span className="text-lg">🔒</span>, label: t('privacy'), color: 'var(--secondary-400)' },
                                    { icon: () => <span className="text-lg">❓</span>, label: t('help'), color: 'var(--accent-400)' },
                                ].map((item, idx) => (
                                    <button
                                        key={idx}
                                        className="w-full group flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:bg-white/5"
                                    >
                                        <div className="flex items-center gap-4">
                                            <item.icon />
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

                    <motion.div variants={itemVariants} className="text-center py-8">
                        <div className="inline-block p-2 rounded-lg bg-white/5 border border-white/10 mb-3">
                            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">Qalby v1.0.0</p>
                        </div>
                        <p className="text-text-muted text-xs opacity-60">Your Premium Spiritual Companion</p>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {showPasswordModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowPasswordModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="w-full max-w-md"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <GlassCard elevated={true} className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                                            <Lock size={20} className="text-amber-500" />
                                            Change Password
                                        </h2>
                                        <button
                                            onClick={() => setShowPasswordModal(false)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <X size={20} className="text-text-muted" />
                                        </button>
                                    </div>

                                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-[0.15em] ml-1 block mb-2">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                required
                                                className="w-full bg-[#030806]/60 border border-white/8 rounded-xl py-3 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-[0.15em] ml-1 block mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                                minLength={6}
                                                className="w-full bg-[#030806]/60 border border-white/8 rounded-xl py-3 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-[0.15em] ml-1 block mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                minLength={6}
                                                className="w-full bg-[#030806]/60 border border-white/8 rounded-xl py-3 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>

                                        {passwordError && (
                                            <p className="text-red-400 text-sm font-medium">{passwordError}</p>
                                        )}

                                        {passwordSuccess && (
                                            <p className="text-emerald-400 text-sm font-medium flex items-center gap-2">
                                                <Check size={16} />
                                                {passwordSuccess}
                                            </p>
                                        )}

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswordModal(false)}
                                                className="flex-1 py-3 rounded-xl font-semibold bg-white/5 border border-white/10 text-text-primary hover:bg-white/10 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={passwordLoading}
                                                className="flex-1 py-3 rounded-xl font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {passwordLoading ? (
                                                    <Loader2 size={18} className="animate-spin" />
                                                ) : (
                                                    'Update Password'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </GlassCard>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </PageTransition>
    );
}
