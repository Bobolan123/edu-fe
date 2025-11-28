'use client';

import { Box, Container, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import {
    YouTube,
    Facebook,
    Pinterest,
    Instagram,
    Twitter,
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';

const socialLinks = [
    { Icon: Facebook, href: 'https://facebook.com' },
    { Icon: Pinterest, href: 'https://pinterest.com' },
    { Icon: Twitter, href: 'https://twitter.com' },
    { Icon: Instagram, href: 'https://instagram.com' },
    { Icon: YouTube, href: 'https://youtube.com' },
];

export default function Footer() {
    const t = useTranslations('Footer');
    
    const footerSections = {
        help: {
            title: 'GET HELP',
            links: [
                { name: 'About Us', href: '/about' },
                { name: 'Contact Us', href: '/contact' },
                { name: 'Latest Articles', href: '/articles' },
                { name: 'FAQ', href: '/faq' },
            ],
        },
        programs: {
            title: 'PROGRAMS',
            links: [
                { name: 'Art & Design', href: '/programs/art-design' },
                { name: 'Business', href: '/programs/business' },
                { name: 'IT & Software', href: '/programs/it-software' },
                { name: 'Languages', href: '/programs/languages' },
                { name: 'Programming', href: '/programs/programming' },
            ],
        },
    };

    return (
        <Box className="bg-[#E8E8E8] text-[#333333] py-12">
            <Container maxWidth="lg">
                <Grid container spacing={6}>
                    {/* Brand Section */}
                    <Grid item xs={12} md={3}>
                        <Typography 
                            variant="h5" 
                            className="font-bold mb-3"
                            sx={{ fontWeight: 700 }}
                        >
                            Mindful Maze
                        </Typography>
                        <Typography 
                            variant="body2" 
                            className="text-[#666666] leading-relaxed"
                            sx={{ lineHeight: 1.6 }}
                        >
                            Enhancing learning experiences and bring international knowledge to Vietnam
                        </Typography>
                    </Grid>

                    {/* GET HELP Section */}
                    <Grid item xs={12} sm={6} md={2.5}>
                        <Typography 
                            variant="h6" 
                            className="font-semibold mb-4"
                            sx={{ fontWeight: 600, fontSize: '1rem' }}
                        >
                            {footerSections.help.title}
                        </Typography>
                        <Box className="flex flex-col gap-2.5">
                            {footerSections.help.links.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-[#666666] hover:text-[#333333] no-underline transition-colors text-sm"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    {/* PROGRAMS Section */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography 
                            variant="h6" 
                            className="font-semibold mb-4"
                            sx={{ fontWeight: 600, fontSize: '1rem' }}
                        >
                            {footerSections.programs.title}
                        </Typography>
                        <Box className="flex flex-col gap-2.5">
                            {footerSections.programs.links.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-[#666666] hover:text-[#333333] no-underline transition-colors text-sm"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    {/* CONTACT US Section */}
                    <Grid item xs={12} md={3.5}>
                        <Typography 
                            variant="h6" 
                            className="font-semibold mb-4"
                            sx={{ fontWeight: 600, fontSize: '1rem' }}
                        >
                            CONTACT US
                        </Typography>
                        <Box className="flex flex-col gap-2">
                            <Typography variant="body2" className="text-[#666666] text-sm">
                                <strong>Address:</strong> 536 Nguyen Thai Hoc
                            </Typography>
                            <Typography variant="body2" className="text-[#666666] text-sm">
                                <strong>Tel:</strong> + (84) 2500-567-8988
                            </Typography>
                            <Typography variant="body2" className="text-[#666666] text-sm">
                                <strong>Mail:</strong> mindfulmaze@gmail.com
                            </Typography>
                            
                            {/* Social Media Icons */}
                            <Box className="flex gap-3 mt-3">
                                {socialLinks.map(({ Icon, href }, index) => (
                                    <a
                                        key={index}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#666666] hover:text-[#333333] transition-colors"
                                    >
                                        <Icon sx={{ fontSize: 20 }} />
                                    </a>
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
} 