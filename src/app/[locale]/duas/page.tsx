'use client';

import { useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import PageTransition from '@/components/PageTransition';
import { Search, Heart, RotateCcw } from 'lucide-react';

interface Dua {
    id: string;
    category: string;
    arabic: string;
    transliteration: string;
    translation_en: string;
    translation_bn: string;
    reference: string;
}

const duasData: Dua[] = [
    {
        id: '1',
        category: 'morning',
        arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
        transliteration: 'Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namootu, wa ilaykan nushoor',
        translation_en: 'O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the resurrection.',
        translation_bn: 'হে আল্লাহ, আপনার অনুগ্রহে আমরা সকালে উপনীত হয়েছি, আপনার অনুগ্রহে আমরা সন্ধ্যায় উপনীত হই, আপনার দ্বারা আমরা জীবিত থাকি, আপনার দ্বারা আমরা মৃত্যুবরণ করি এবং আপনার কাছেই আমাদের পুনরুত্থান।',
        reference: 'Abu Dawud 5068',
    },
    {
        id: '2',
        category: 'evening',
        arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
        transliteration: 'Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namootu, wa ilaykal maseer',
        translation_en: 'O Allah, by You we enter the evening, by You we enter the morning, by You we live, by You we die, and to You is the final return.',
        translation_bn: 'হে আল্লাহ, আপনার অনুগ্রহে আমরা সন্ধ্যায় উপনীত হয়েছি, আপনার অনুগ্রহে আমরা সকালে উপনীত হই, আপনার দ্বারা আমরা জীবিত থাকি, আপনার দ্বারা আমরা মৃত্যুবরণ করি এবং আপনার কাছেই আমাদের প্রত্যাবর্তন।',
        reference: 'Tirmidhi 3391',
    },
    {
        id: '3',
        category: 'fasting',
        arabic: 'وَبِصَوْمِ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانَ',
        transliteration: 'Wa bisawmi ghadin nawaytu min shahri Ramadan',
        translation_en: 'I intend to fast tomorrow in the month of Ramadan.',
        translation_bn: 'আমি রমজান মাসে আগামীকালের রোজা রাখার নিয়্যাত করছি।',
        reference: 'Abu Dawud 2454',
    },
    {
        id: '4',
        category: 'breakingFast',
        arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
        transliteration: 'Dhahaba adh-dhama-u wab-tallat il-urooqu wa thabat al-ajru in sha Allah',
        translation_en: 'The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills.',
        translation_bn: 'তৃষ্ণা নিবারিত হয়েছে, শিরা-উপশিরা আর্দ্র হয়েছে এবং ইনশাআল্লাহ প্রতিদান নিশ্চিত হয়েছে।',
        reference: 'Abu Dawud 2357',
    },
    {
        id: '5',
        category: 'afterPrayer',
        arabic: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ',
        transliteration: 'Astaghfirullah, Astaghfirullah, Astaghfirullah',
        translation_en: 'I seek forgiveness from Allah (3 times)',
        translation_bn: 'আমি আল্লাহর কাছে ক্ষমা চাই (৩ বার)',
        reference: 'Muslim 591',
    },
    {
        id: '6',
        category: 'nightPrayer',
        arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
        transliteration: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni",
        translation_en: 'O Allah, You are the Pardoner, You love to pardon, so pardon me.',
        translation_bn: 'হে আল্লাহ, আপনি ক্ষমাশীল, আপনি ক্ষমা করতে ভালোবাসেন, তাই আমাকে ক্ষমা করুন।',
        reference: 'Tirmidhi 3513',
    },
    {
        id: '7',
        category: 'general',
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        transliteration: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar',
        translation_en: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the torment of the Fire.',
        translation_bn: 'হে আমাদের প্রতিপালক, আমাদেরকে দুনিয়াতে কল্যাণ দিন এবং আখিরাতেও কল্যাণ দিন এবং আমাদেরকে জাহান্নামের আযাব থেকে রক্ষা করুন।',
        reference: 'Quran 2:201',
    },
    {
        id: '8',
        category: 'morning',
        arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        transliteration: "Bismillahilladhi la yadurru ma'asmihi shay'un fil ardi wa la fis-sama'i wa huwas-sami'ul 'aleem",
        translation_en: "In the name of Allah, with whose name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, All-Knowing.",
        translation_bn: 'আল্লাহর নামে, যাঁর নামের সাথে পৃথিবীতে বা আকাশে কোনো কিছুই ক্ষতি করতে পারে না এবং তিনি হলেন সর্বশ্রোতা, সর্বজ্ঞ।',
        reference: 'Abu Dawud 5088',
    },
];

const categoryKeys = ['morning', 'evening', 'afterPrayer', 'fasting', 'breakingFast', 'nightPrayer', 'general'] as const;

function DuaCard({
    dua,
    locale,
    isFavorite,
    onToggleFavorite,
}: {
    dua: Dua;
    locale: string;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}) {
    const translation = locale === 'bn' ? dua.translation_bn : dua.translation_en;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            layout
        >
            <GlassCard hover={false}>
                {/* Arabic */}
                <p
                    className="font-display"
                    dir="rtl"
                    lang="ar"
                    style={{
                        fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
                        color: 'var(--primary-400)',
                        lineHeight: 2,
                        textAlign: 'center',
                        marginBottom: '16px',
                        textShadow: '0 0 20px var(--glow-primary)',
                        padding: '12px',
                        borderBottom: '1px solid var(--glass-border)',
                    }}
                >
                    {dua.arabic}
                </p>

                {/* Transliteration */}
                <p
                    style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        fontStyle: 'italic',
                        marginBottom: '8px',
                        lineHeight: 1.6,
                    }}
                >
                    {dua.transliteration}
                </p>

                {/* Translation */}
                <p
                    className={locale === 'bn' ? 'font-bangla' : ''}
                    style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-primary)',
                        lineHeight: 1.7,
                        marginBottom: '12px',
                    }}
                >
                    {translation}
                </p>

                {/* Footer */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '8px',
                        borderTop: '1px solid var(--glass-border)',
                    }}
                >
                    <span
                        style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-muted)',
                            fontStyle: 'italic',
                        }}
                    >
                        {dua.reference}
                    </span>
                    <motion.button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite();
                        }}
                        whileTap={{ scale: 0.8 }}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                        }}
                    >
                        <Heart
                            size={20}
                            fill={isFavorite ? 'var(--accent-500)' : 'none'}
                            color={isFavorite ? 'var(--accent-500)' : 'var(--text-muted)'}
                        />
                    </motion.button>
                </div>
            </GlassCard>
        </motion.div>
    );
}

function DhikrCounter({ t }: { t: ReturnType<typeof useTranslations<'duas'>> }) {
    const [count, setCount] = useState(0);
    const [target] = useState(33);
    const dhikrTypes = [
        { key: 'subhanallah', arabic: 'سُبْحَانَ اللّٰهِ' },
        { key: 'alhamdulillah', arabic: 'اَلْحَمْدُ لِلّٰهِ' },
        { key: 'allahuakbar', arabic: 'اَللّٰهُ أَكْبَرُ' },
    ];
    const [activeType, setActiveType] = useState(0);

    const increment = () => {
        if (count < target) {
            setCount((c) => c + 1);
        }
    };

    const pct = (count / target) * 100;

    return (
        <GlassCard elevated hover={false}>
            <p
                style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '12px',
                    textAlign: 'center',
                }}
            >
                {t('dhikrCounter')}
            </p>

            {/* Type Selector */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '16px',
                }}
            >
                {dhikrTypes.map((type, i) => (
                    <motion.button
                        key={type.key}
                        onClick={() => { setActiveType(i); setCount(0); }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            padding: '6px 14px',
                            borderRadius: 'var(--radius-full)',
                            border: activeType === i
                                ? '1px solid var(--primary-500)'
                                : '1px solid var(--glass-border)',
                            background: activeType === i ? 'var(--glow-primary)' : 'transparent',
                            color: activeType === i ? 'var(--primary-400)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                        }}
                    >
                        {t(type.key as 'subhanallah' | 'alhamdulillah' | 'allahuakbar')}
                    </motion.button>
                ))}
            </div>

            {/* Counter Button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <motion.button
                    onClick={increment}
                    whileTap={{ scale: 0.9, boxShadow: '0 0 0 rgba(201,151,74,0)' }}
                    whileHover={{ scale: 1.05 }}
                    style={{
                        width: '140px',
                        height: '140px',
                        borderRadius: '50%',
                        border: '3px solid var(--primary-500)',
                        background: 'radial-gradient(circle, var(--glow-primary) 0%, var(--bg-card) 70%)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        boxShadow: '0 0 30px var(--glow-primary), 0 0 60px rgba(139, 92, 246, 0.1)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Progress ring inside button */}
                    <svg
                        style={{ position: 'absolute', inset: '-3px', width: 'calc(100% + 6px)', height: 'calc(100% + 6px)' }}
                        viewBox="0 0 146 146"
                    >
                        <circle
                            cx="73"
                            cy="73"
                            r="70"
                            fill="none"
                            stroke="var(--primary-400)"
                            strokeWidth="3"
                            strokeDasharray={2 * Math.PI * 70}
                            strokeDashoffset={2 * Math.PI * 70 * (1 - pct / 100)}
                            strokeLinecap="round"
                            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.2s ease' }}
                        />
                    </svg>

                    <span
                        className="font-display"
                        dir="rtl"
                        style={{
                            fontSize: '1rem',
                            color: 'var(--primary-400)',
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        {dhikrTypes[activeType].arabic}
                    </span>
                    <span
                        className="font-mono"
                        style={{
                            fontSize: '2rem',
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        {count}
                    </span>
                </motion.button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {t('target')}: {target}
                    </span>
                    <motion.button
                        onClick={() => setCount(0)}
                        whileTap={{ scale: 0.8 }}
                        style={{
                            background: 'none',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-full)',
                            padding: '4px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'var(--text-muted)',
                            fontSize: '0.75rem',
                        }}
                    >
                        <RotateCcw size={12} />
                        {t('reset')}
                    </motion.button>
                </div>
            </div>
        </GlassCard>
    );
}

export default function DuasPage() {
    const t = useTranslations('duas');
    const locale = useLocale();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const toggleFavorite = useCallback((id: string) => {
        setFavorites((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const filteredDuas = duasData.filter((dua) => {
        const matchesCategory = !activeCategory || dua.category === activeCategory;
        const matchesSearch =
            !searchQuery ||
            dua.arabic.includes(searchQuery) ||
            dua.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dua.translation_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dua.translation_bn.includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    return (
        <PageTransition>
            <div
                style={{
                    padding: '16px',
                    maxWidth: '500px',
                    margin: '0 auto',
                }}
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                    }}
                >
                    <h1
                        className="font-display"
                        style={{
                            fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
                            color: 'var(--text-primary)',
                            fontWeight: 700,
                            margin: 0,
                        }}
                    >
                        {t('title')}
                    </h1>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1, transition: { staggerChildren: 0.08 } },
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                    {/* Search */}
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                        <div
                            style={{
                                position: 'relative',
                            }}
                        >
                            <Search
                                size={16}
                                style={{
                                    position: 'absolute',
                                    left: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)',
                                }}
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('searchPlaceholder')}
                                style={{
                                    width: '100%',
                                    padding: '12px 14px 12px 40px',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--glass-border)',
                                    background: 'var(--glass-bg)',
                                    backdropFilter: 'blur(8px)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    fontFamily: 'var(--font-dm-sans)',
                                    outline: 'none',
                                }}
                            />
                        </div>
                    </motion.div>

                    {/* Category Filters */}
                    <motion.div
                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                        style={{
                            display: 'flex',
                            gap: '6px',
                            overflowX: 'auto',
                            paddingBottom: '4px',
                        }}
                    >
                        <motion.button
                            onClick={() => setActiveCategory(null)}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                padding: '6px 14px',
                                borderRadius: 'var(--radius-full)',
                                border: !activeCategory
                                    ? '1px solid var(--primary-500)'
                                    : '1px solid var(--glass-border)',
                                background: !activeCategory ? 'var(--glow-primary)' : 'transparent',
                                color: !activeCategory ? 'var(--primary-400)' : 'var(--text-muted)',
                                cursor: 'pointer',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                            }}
                        >
                            All
                        </motion.button>
                        {categoryKeys.map((cat) => (
                            <motion.button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: 'var(--radius-full)',
                                    border: activeCategory === cat
                                        ? '1px solid var(--primary-500)'
                                        : '1px solid var(--glass-border)',
                                    background: activeCategory === cat ? 'var(--glow-primary)' : 'transparent',
                                    color: activeCategory === cat ? 'var(--primary-400)' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                }}
                            >
                                {t(`categories.${cat}` as 'categories.morning')}
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Dhikr Counter */}
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                        <DhikrCounter t={t} />
                    </motion.div>

                    {/* Dua Cards */}
                    <AnimatePresence>
                        {filteredDuas.map((dua) => (
                            <DuaCard
                                key={dua.id}
                                dua={dua}
                                locale={locale}
                                isFavorite={favorites.has(dua.id)}
                                onToggleFavorite={() => toggleFavorite(dua.id)}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </PageTransition>
    );
}
