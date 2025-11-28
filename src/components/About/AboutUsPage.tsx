import {
    Box,
    Container,
    Typography,
    Grid,
    Card,   
    CardContent,
    Avatar,
} from '@mui/material';
import {
    School as SchoolIcon,
    EmojiObjects as IdeaIcon,
    People as PeopleIcon,
    Star as StarIcon,
} from '@mui/icons-material';
import { getTranslations } from 'next-intl/server';

export default async function AboutUsPage() {
    const t = await getTranslations('AboutUs');

    const values = [
        {
            icon: <SchoolIcon sx={{ fontSize: 40 }} />,
            title: t('values.excellence.title'),
            description: t('values.excellence.description'),
        },
        {
            icon: <IdeaIcon sx={{ fontSize: 40 }} />,
            title: t('values.innovation.title'),
            description: t('values.innovation.description'),
        },
        {
            icon: <PeopleIcon sx={{ fontSize: 40 }} />,
            title: t('values.community.title'),
            description: t('values.community.description'),
        },
        {
            icon: <StarIcon sx={{ fontSize: 40 }} />,
            title: t('values.quality.title'),
            description: t('values.quality.description'),
        },
    ];

    const team = [
        {
            name: t('team.member1.name'),
            role: t('team.member1.role'),
            description: t('team.member1.description'),
        },
        {
            name: t('team.member2.name'),
            role: t('team.member2.role'),
            description: t('team.member2.description'),
        },
        {
            name: t('team.member3.name'),
            role: t('team.member3.role'),
            description: t('team.member3.description'),
        },
    ];

    return (
        <Box>
       
            {/* Mission Section */}
            <Container maxWidth="lg" sx={{ mb: 8, mt: 8 }}>
                <Typography
                    variant="h3"
                    component="h2"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ textAlign: 'center', mb: 4 }}
                >
                    {t('mission.title')}
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        textAlign: 'center',
                        color: 'text.secondary',
                        maxWidth: 800,
                        mx: 'auto',
                        lineHeight: 1.8,
                    }}
                >
                    {t('mission.description')}
                </Typography>
            </Container>

            {/* Values Section */}
            <Box sx={{ bgcolor: 'grey.50', py: 8, mb: 8 }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        component="h2"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ textAlign: 'center', mb: 6 }}
                    >
                        {t('values.title')}
                    </Typography>
                    <Grid container spacing={4}>
                        {values.map((value, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        textAlign: 'center',
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 4 }}>
                                        <Box
                                            sx={{
                                                color: 'primary.main',
                                                mb: 2,
                                                display: 'flex',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {value.icon}
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            component="h3"
                                            fontWeight="bold"
                                            gutterBottom
                                        >
                                            {value.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {value.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Story Section */}
            <Container maxWidth="lg" sx={{ mb: 8 }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="h3"
                            component="h2"
                            fontWeight="bold"
                            gutterBottom
                        >
                            {t('story.title')}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ mb: 2, lineHeight: 1.8, color: 'text.secondary' }}
                        >
                            {t('story.paragraph1')}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ lineHeight: 1.8, color: 'text.secondary' }}
                        >
                            {t('story.paragraph2')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                height: 400,
                                bgcolor: 'grey.200',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundImage: 'url(/about/story.jpg)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <Typography variant="h6" color="white" sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                                {t('story.imageAlt')}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Team Section */}
            <Box sx={{ bgcolor: 'grey.50', py: 8, mb: 0 }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        component="h2"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ textAlign: 'center', mb: 6 }}
                    >
                        {t('team.title')}
                    </Typography>
                    <Grid container spacing={4}>
                        {team.map((member, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card
                                    sx={{
                                        textAlign: 'center',
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 4 }}>
                                        <Avatar
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                mx: 'auto',
                                                mb: 2,
                                                bgcolor: 'primary.main',
                                                fontSize: 48,
                                            }}
                                        >
                                            {member.name.charAt(0)}
                                        </Avatar>
                                        <Typography
                                            variant="h6"
                                            component="h3"
                                            fontWeight="bold"
                                            gutterBottom
                                        >
                                            {member.name}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            color="primary"
                                            gutterBottom
                                        >
                                            {member.role}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mt: 2 }}
                                        >
                                            {member.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Stats Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Grid container spacing={4} sx={{ textAlign: 'center' }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h3" color="primary" fontWeight="bold">
                            {t('stats.students')}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {t('stats.studentsLabel')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h3" color="primary" fontWeight="bold">
                            {t('stats.courses')}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {t('stats.coursesLabel')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h3" color="primary" fontWeight="bold">
                            {t('stats.instructors')}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {t('stats.instructorsLabel')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h3" color="primary" fontWeight="bold">
                            {t('stats.satisfaction')}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {t('stats.satisfactionLabel')}
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
