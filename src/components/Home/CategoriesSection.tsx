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
  Category as CategoryIcon,
} from "@mui/icons-material";
import { ICategory } from "../../../types/entities"; // Keep your original type if already defined

interface ICategoriesSectionProps {
  categories: ICategory[] | undefined;
}

export default function CategoriesSection({ categories }: ICategoriesSectionProps) {
  const categoryRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (categoryRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      categoryRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box className="py-16 bg-gradient-to-br from-blue-50 to-slate-50">
      <Container maxWidth="lg">
        <Box className="flex items-center justify-between mb-8">
          <Box>
            <Typography variant="h4" component="h2" className="font-bold text-gray-900 mb-1">
              Browse Categories
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              Discover courses across different subjects
            </Typography>
          </Box>
          <Box className="flex gap-2">
            <IconButton
              onClick={() => scroll("left")}
              className="bg-white hover:bg-gray-100 shadow-sm hover:shadow transition-all"
              size="medium"
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={() => scroll("right")}
              className="bg-white hover:bg-gray-100 shadow-sm hover:shadow transition-all"
              size="medium"
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          ref={categoryRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          sx={{
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {categories?.map((category) => (
            <Card
              key={category.id}
              className="min-w-[280px] cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              sx={{
                borderRadius: 2,
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent className="p-6">
               
                <Typography variant="h6" component="h3" className="mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="text-gray-600 leading-relaxed"
                >
                  {category.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
