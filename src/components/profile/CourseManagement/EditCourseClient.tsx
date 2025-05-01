"use client";

import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Grid,
  Box,
  Card,
  CardMedia,
  CardContent,
  Chip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ICourse } from "../../../../types/entities";
import { sendRequest } from "../../../../ultils/api";
import dynamic from "next/dynamic";

// Dynamically import RichTextEditor
const RichTextEditor = dynamic(() => import("@/components/common/RichTextEditor"), { ssr: false });

// RichTextEditor handle type
type RichTextEditorHandle = {
  getContent: () => string;
};

interface Props {
  course: ICourse;
}

export default function EditCourseClient({ course }: Props) {
  const router = useRouter();
  const editorRef = useRef<RichTextEditorHandle>(null);

  const [form, setForm] = useState({
    title: course.title,
    price: course.price.toString(),
    duration: course.duration.toString(),
    categories: course.categories.map((cat) => cat.name),
    thumbnail: course.thumbnail_url || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedDescription = editorRef.current?.getContent() || "";

    await sendRequest({
      method: "PATCH",
      url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${course.id}`,
      body: {
        ...course,
        title: form.title,
        description: updatedDescription,
        price: parseFloat(form.price),
        duration: parseInt(form.duration),
      },
    });

    setLoading(false);
    router.push("/profile/courses");
  };

  // After the editor is mounted, manually insert the initial description
  useEffect(() => {
    const timer = setTimeout(() => {
      const quillRoot = (editorRef.current as any)?.quillRef?.root;
      if (quillRoot) {
        quillRoot.innerHTML = course.description || "";
      }
    }, 500); // Slight delay to ensure Quill is mounted

    return () => clearTimeout(timer);
  }, [course.description]);

  return (
    <Container maxWidth="md" className="py-10">
      <Typography variant="h4" gutterBottom>
        Edit Course
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <TextField
              label="Title"
              value={form.title}
              onChange={handleChange("title")}
              fullWidth
            />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Description
              </Typography>
              <RichTextEditor ref={editorRef} />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Price ($)"
                  type="number"
                  value={form.price}
                  onChange={handleChange("price")}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Duration (minutes)"
                  type="number"
                  value={form.duration}
                  onChange={handleChange("duration")}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Box>
              <Typography variant="subtitle1" className="mb-1">
                Categories
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {form.categories.map((cat, index) => (
                  <Chip
                    key={index}
                    label={cat}
                    onDelete={() => {
                      const updated = [...form.categories];
                      updated.splice(index, 1);
                      setForm({ ...form, categories: updated });
                    }}
                  />
                ))}
              </Box>
              <TextField
                label="Add Category"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const value = (e.target as HTMLInputElement)?.value.trim();
                    if (value) {
                      setForm({
                        ...form,
                        categories: [...form.categories, value],
                      });
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
                fullWidth
                margin="normal"
              />
            </Box>

            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={20} /> : "Update Course"}
            </Button>
          </form>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            {form.thumbnail && (
              <CardMedia
                component="img"
                height="200"
                image={form.thumbnail}
                alt="Course Thumbnail"
              />
            )}
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Instructor: {course.instructor.name}
              </Typography>
              <Typography variant="body2">
                Average Rating: {course.average_rating} ⭐
              </Typography>
              <Typography variant="body2">
                Students: {course.total_students}
              </Typography>
              <Typography variant="body2">
                Created: {new Date(course.date_created).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                Last Updated: {new Date(course.last_updated).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
