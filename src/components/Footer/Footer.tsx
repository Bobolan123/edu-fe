'use client';

import { Box, Container, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import {
    YouTube,
    Facebook,
    Pinterest,
    Instagram,
    Twitter,
    LinkedIn,
    MusicNote,
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';

const socialLinks = [
    { Icon: YouTube, href: 'https://youtube.com' },
    { Icon: Facebook, href: 'https://facebook.com' },
    { Icon: Pinterest, href: 'https://pinterest.com' },
    { Icon: Instagram, href: 'https://instagram.com' },
    { Icon: Twitter, href: 'https://twitter.com' },
    { Icon: LinkedIn, href: 'https://linkedin.com' },
    { Icon: MusicNote, href: 'https://tiktok.com' },
];

export default function Footer() {
    const t = useTranslations('Footer');
    
    const footerLinks = {
        explore: {
            title: t('section_explore'),
            links: [
                { name: t('products'), href: '/products' },
                { name: t('features'), href: '/features' },
                { name: t('pricing'), href: '/pricing' },
                { name: t('staff_picks'), href: '/staff-picks' },
                { name: t('product_demo'), href: '/demo' },
            ],
        },
        company: {
            title: t('section_company'),
            links: [
                { name: t('careers'), href: '/careers' },
                { name: t('blog'), href: '/blog' },
                { name: t('press'), href: '/press' },
                { name: t('partners'), href: '/partners' },
                { name: t('newsletter'), href: '/newsletter' },
            ],
        },
        support: {
            title: t('section_support'),
            links: [
                { name: t('help_center'), href: '/help' },
                { name: t('house_rules'), href: '/rules' },
                { name: t('content_guidelines'), href: '/guidelines' },
            ],
        },
    };
    
    const legalLinks = [
        { name: t('privacy_policy'), href: '/privacy' },
        { name: t('terms_of_use'), href: '/terms' },
        { name: t('cookies_policy'), href: '/cookies' },
        { name: t('cookie_preferences'), href: '/cookie-preferences' },
        { name: t('ethics_line'), href: '/ethics' },
        { name: t('accessibility'), href: '/accessibility' },
    ];
    return (
        <Box className="bg-[#1B1B1B] text-white pt-8 pb-4">
            <Container maxWidth="lg">
                {/* Main Footer Content */}
                <Grid container spacing={4}>
                    {/* Logo and Description */}
                    <Grid item xs={12} md={4}>
                        <Box className="mb-3">
                            <Typography variant="h4" className="font-bold mb-2">
                                MindfulMaze
                            </Typography>
                        </Box>
                        <Typography variant="body2" className="mb-3 opacity-80">
                            {t('brand_description')}
                        </Typography>
                        {/* Social Media Icons */}
                        <Box className="flex gap-4">
                            {socialLinks.map(({ Icon, href }, index) => (
                                <a
                                    key={index}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-primary-500 transition-colors"
                                >
                                    <Icon className="text-2xl" />
                                </a>
                            ))}
                        </Box>
                    </Grid>

                    {/* Navigation Links */}
                    {Object.entries(footerLinks).map(([key, section]) => (
                        <Grid item xs={12} sm={6} md={2} key={key}>
                            <Typography variant="h6" className="mb-4">
                                {section.title}
                            </Typography>
                            <Box className="flex flex-col gap-2">
                                {section.links.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-white opacity-80 hover:opacity-100 no-underline transition-opacity"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                {/* Bottom Section */}
                <Box className="mt-8 pt-3 border-t border-white/10 flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                    <Typography variant="body2" className="opacity-80">
                        {t('copyright', { year: new Date().getFullYear() })}
                    </Typography>
                    <Box className="flex gap-6 flex-wrap justify-center">
                        {legalLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-white opacity-80 hover:opacity-100 no-underline text-sm transition-opacity"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
} 