import { Typography } from '@mui/material';

export default function HeroSection() {
    return (
        <div className="flex items-center h-[500px] relative">
            <section>
                <video
                    className="absolute top-0 left-0 w-full h-full object-fill"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="/video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </section>

            <div className="w-1/3 z-10 text-white mx-60">
                <Typography variant="h2" className="text-white italic">
                    Studying Online is now much easier
                </Typography>
                <Typography variant="inherit">
                    Mindful Maze is an interesting platform that will teach
                    you in a more interactive way
                </Typography>
            </div>
        </div>
    );
} 