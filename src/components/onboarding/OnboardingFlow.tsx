'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import { ChevronRight, MapPin, Target, Heart } from 'lucide-react';

interface OnboardingFlowProps {
    locale: string;
}

export default function OnboardingFlow({ locale }: OnboardingFlowProps) {
    const [step, setStep] = useState(0);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const { setOnboarded, setLocation: saveLocation } = useAppStore();
    const router = useRouter();

    const steps = [
        {
            title: locale === 'bn' ? 'স্বাগতম!' : 'Welcome to Qalby',
            subtitle: locale === 'bn' 
                ? 'আপনার রমজান যাত্রা শুরু করুন'
                : 'Begin your Ramadan journey',
            icon: Heart,
        },
        {
            title: locale === 'bn' ? 'আপনার নাম কী?' : "What's your name?",
            subtitle: locale === 'bn'
                ? 'আমরা আপনাকে ব্যক্তিগত অভিজ্ঞতা দিতে চাই'
                : 'We want to personalize your experience',
            icon: Target,
        },
        {
            title: locale === 'bn' ? 'আপনি কোথায় থাকেন?' : 'Where are you located?',
            subtitle: locale === 'bn'
                ? 'আমরা আপনার জন্য সঠিক প্রার্থনার সময় জানতে চাই'
                : "We'll use this for prayer times",
            icon: MapPin,
        },
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            setOnboarded(true);
            router.push(`/${locale}`);
        }
    };

    const handleSkip = () => {
        setOnboarded(true);
        router.push(`/${locale}`);
    };

    return (
        <div className="fixed inset-0 z-50 bg-void flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="text-center"
                    >
                        <div className="w-24 h-24 mx-auto mb-8 rounded-full glass-card flex items-center justify-center">
                            {step === 0 && <Heart className="w-12 h-12 text-accent-gold" />}
                            {step === 1 && <Target className="w-12 h-12 text-accent-gold" />}
                            {step === 2 && <MapPin className="w-12 h-12 text-accent-gold" />}
                        </div>
                        
                        <h1 className="text-3xl font-display text-text-primary mb-4">
                            {steps[step].title}
                        </h1>
                        <p className="text-text-muted mb-8 max-w-xs">
                            {steps[step].subtitle}
                        </p>

                        {step === 1 && (
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={locale === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your name'}
                                className="w-full max-w-xs px-4 py-3 rounded-xl glass-card border border-glass-border focus:border-accent-gold focus:outline-none text-text-primary placeholder:text-text-muted/50"
                            />
                        )}

                        {step === 2 && (
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder={locale === 'bn' ? 'শহরের নাম লিখুন' : 'Enter your city'}
                                className="w-full max-w-xs px-4 py-3 rounded-xl glass-card border border-glass-border focus:border-accent-gold focus:outline-none text-text-primary placeholder:text-text-muted/50"
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="p-8 flex gap-4">
                <button
                    onClick={handleSkip}
                    className="flex-1 py-4 rounded-xl glass-card text-text-muted hover:text-text-primary transition-colors"
                >
                    {locale === 'bn' ? 'এড়িয়ে যান' : 'Skip'}
                </button>
                <button
                    onClick={handleNext}
                    className="flex-1 py-4 rounded-xl gold-gradient text-void font-semibold flex items-center justify-center gap-2"
                >
                    {locale === 'bn' ? 'পরবর্তী' : 'Next'}
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            <div className="flex justify-center gap-2 pb-8">
                {steps.map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors ${
                            i === step ? 'bg-accent-gold' : 'bg-text-muted/30'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
