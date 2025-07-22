'use client';

import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function HeroSection() {
    const t = useTranslations('HeroSection');
    return (
        <div className="flex items-center h-[500px] relative">
            <section>
                <video
                    className="absolute top-0 left-0 w-full h-full object-fill z-0"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="/video.mp4" type="video/mp4" />
                    {t('video_not_supported')}
                </video>
            </section>

            <div className="w-1/3 z-10 text-white mx-60">
                <Typography variant="h2" className="text-white italic">
                    {t('title')}
                </Typography>
                <Typography variant="inherit">
                    {t('description')}
                </Typography>
            </div>
        </div>
    );
} 