import React from 'react';

export const QalbyLogo = ({ size = 48, className = "" }: { size?: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-500)" />
                <stop offset="100%" stopColor="var(--primary-400)" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        {/* Outer Geometric Shape (Islamic Star Influence) */}
        <path
            d="M50 5 L63 35 L95 37 L70 60 L78 92 L50 75 L22 92 L30 60 L5 37 L37 35 Z"
            fill="none"
            stroke="url(#logoGradient)"
            strokeWidth="3"
            filter="url(#glow)"
        />
        {/* Inner Heart / Q Shape */}
        <path
            d="M50 30 C50 30 40 20 25 25 C10 30 15 50 50 75 C85 50 90 30 75 25 C60 20 50 30 50 30Z"
            fill="url(#logoGradient)"
            opacity="0.8"
        />
        <circle cx="50" cy="50" r="8" fill="white" opacity="0.2" />
    </svg>
);
