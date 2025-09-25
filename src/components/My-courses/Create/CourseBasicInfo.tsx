"use client";

import type React from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { LANGUAGES } from "../../../../common/constant";
import { CourseBasicInfoProps } from "./types";
import { useCurrency } from "@/context/CurrencyContext";
import { currencyService } from "@/services/currency";

export default function     CourseBasicInfo({
    course,
    categories,
    thumbnailFile,
    currency,
    onCourseChange,
    onCategoryChange,
    onThumbnailUpload,
    onSubmit,
    isSubmitting,
}: CourseBasicInfoProps) {
    const t = useTranslations("CreateCourse");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await onSubmit(course, thumbnailFile);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <Typography
                    variant="h4"
                    component="h1"
                    className="mb-8 font-bold text-gray-900"
                >
                    {t("title")}
                </Typography>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="shadow-lg">
                        <CardHeader
                            title={
                                <Typography
                                    variant="h6"
                                    component="h2"
                                    className="font-semibold"
                                >
                                    {t("course_information")}
                                </Typography>
                            }
                        />
                        <CardContent className="space-y-4">
                            <TextField
                                fullWidth
                                label={t("course_title")}
                                value={course.title}
                                onChange={(e) =>
                                    onCourseChange("title", e.target.value)
                                }
                                required
                            />

                            <TextField
                                fullWidth
                                label={t("description")}
                                multiline
                                rows={4}
                                value={course.description}
                                onChange={(e) =>
                                    onCourseChange("description", e.target.value)
                                }
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormControl fullWidth>
                                    <InputLabel>{t("language")}</InputLabel>
                                    <Select
                                        value={course.language}
                                        label={t("language")}
                                        onChange={(e) =>
                                            onCourseChange("language", e.target.value)
                                        }
                                    >
                                        <MenuItem value="English">🇺🇸 English</MenuItem>
                                        <MenuItem value="Vietnamese">🇻🇳 Tiếng Việt</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label={`${t("price")} (${
                                        currency === "VND" ? "₫" : "$"
                                    })`}
                                    type="number"
                                    value={course.price}
                                    onChange={(e) =>
                                        onCourseChange(
                                            "price",
                                            Number.parseFloat(e.target.value) || 0
                                        )
                                    }
                                    helperText={
                                        currency === "VND"
                                            ? `VND - ${currencyService.formatPrice(course.price, currency)}`
                                            : `USD - ${currencyService.formatPrice(course.price, currency)}`
                                    }
                                />
                            </div>
                          

                            <TextField
                                fullWidth
                                label={t("preview_url")}
                                type="url"
                                value={course.preview_url}
                                onChange={(e) =>
                                    onCourseChange("preview_url", e.target.value)
                                }
                            />

                            <div className="space-y-2">
                                <Typography
                                    variant="subtitle2"
                                    className="font-medium"
                                >
                                    {t("course_thumbnail")}
                                </Typography>
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<CloudUploadIcon />}
                                        className="shrink-0"
                                    >
                                        {t("upload_thumbnail")}
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={onThumbnailUpload}
                                        />
                                    </Button>
                                    {course.thumbnail_url && (
                                        <img
                                            src={course.thumbnail_url}
                                            alt="Thumbnail preview"
                                            className="w-20 h-20 object-cover rounded-lg border"
                                        />
                                    )}
                                </div>
                            </div>

                            <FormControl fullWidth>
                                <InputLabel>{t("categories")}</InputLabel>
                                <Select
                                    multiple
                                    value={course.categories}
                                    onChange={onCategoryChange}
                                    input={<OutlinedInput label={t("categories")} />}
                                    renderValue={(selected) => (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: 0.5,
                                            }}
                                        >
                                            {selected.map((value) => (
                                                <Chip
                                                    key={value}
                                                    label={value}
                                                    size="small"
                                                />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {categories.map((category) => (
                                        <MenuItem
                                            key={category.id}
                                            value={category.name}
                                        >
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </CardContent>
                    </Card>

                    <div className="flex justify-center items-center gap-4 mt-8">
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t("creating") : "Create Course & Continue"}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}