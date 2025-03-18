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

const footerLinks = {
    explore: {
        title: 'Explore',
        links: [
            { name: 'Products', href: '/products' },
            { name: 'Features', href: '/features' },
            { name: 'Pricing', href: '/pricing' },
            { name: 'Staff picks', href: '/staff-picks' },
            { name: 'Product demo', href: '/demo' },
        ],
    },
    company: {
        title: 'Company',
        links: [
            { name: 'Careers', href: '/careers' },
            { name: 'Blog', href: '/blog' },
            { name: 'Press', href: '/press' },
            { name: 'Partners', href: '/partners' },
            { name: 'Newsletter', href: '/newsletter' },
        ],
    },
    support: {
        title: 'Support',
        links: [
            { name: 'Help Center', href: '/help' },
            { name: 'House Rules', href: '/rules' },
            { name: 'Content Guidelines', href: '/guidelines' },
        ],
    },
};

const socialLinks = [
    { Icon: YouTube, href: 'https://youtube.com' },
    { Icon: Facebook, href: 'https://facebook.com' },
    { Icon: Pinterest, href: 'https://pinterest.com' },
    { Icon: Instagram, href: 'https://instagram.com' },
    { Icon: Twitter, href: 'https://twitter.com' },
    { Icon: LinkedIn, href: 'https://linkedin.com' },
    { Icon: MusicNote, href: 'https://tiktok.com' },
];

const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Use', href: '/terms' },
    { name: 'Cookies Policy', href: '/cookies' },
    { name: 'Cookie Preferences', href: '/cookie-preferences' },
    { name: 'Ethics Line', href: '/ethics' },
    { name: 'Accessibility', href: '/accessibility' },
];

export default function Footer() {
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
                            Join the more than 150,000 creators who use MindfulMaze to share their knowledge.
                            Easily create and sell courses, coaching, and digital downloads with our powerful
                            yet simple no-code platform.
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
                        Copyright © {new Date().getFullYear()} MindfulMaze, Inc. All rights reserved.
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