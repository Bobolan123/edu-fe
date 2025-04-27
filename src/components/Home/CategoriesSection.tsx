"use client";

import { useRef } from "react";
import {
    Box,
    Typography,
    IconButton,
    Card,
    CardContent,
    Container,
} from "@mui/material";
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { ICategory } from "../../../types/entities";



interface ICategoriesSectionProps {
    categories: ICategory[] | undefined;
}

export default function CategoriesSection(props: ICategoriesSectionProps) {
    const { categories } = props;
    const categoryRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (categoryRef.current) {
            const scrollAmount = direction === "left" ? -300 : 300;
            categoryRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h4" component="h2">
                    Browse Categories
                </Typography>
                <Box display="flex" gap={1}>
                    <IconButton onClick={() => scroll("left")}>
                        <ChevronLeftIcon />
                    </IconButton>
                    <IconButton onClick={() => scroll("right")}>
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
            </Box>

            <Box
                ref={categoryRef}
                sx={{
                    display: "flex",
                    overflowX: "auto",
                    gap: 2,
                    pb: 2,
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                }}
            >
                {categories?.map((category) => (
                    <Card
                        key={category.id}
                        sx={{
                            backgroundColor: "#f4f4f4",
                            minWidth: 200,
                            cursor: "pointer",
                            transition: "box-shadow 0.3s",
                            "&:hover": { boxShadow: 6 },
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" component="h3">
                                {category.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {category.description}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Container>
    );
}
