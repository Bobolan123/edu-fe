"use client"

import { useState } from "react"
import Image from "next/image"
import { Trash2, Star, Clock, Users, ShoppingCart, CreditCard } from "lucide-react"

import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Button as MUIButton,
  Divider,
} from "@mui/material"

interface IUser {
  id: number
  name: string
  email: string
  avatar?: string
}

interface ICourse {
  id: number
  title: string
  description: string
  instructor: IUser
  duration: number
  date_created: Date
  last_updated: Date
  thumbnail: string | null
  price: number
  average_rating: number
  total_students: number
  thumbnail_url: string | null
  total_reviews: number
}

const initialCartItems: ICourse[] = [
  {
    id: 1,
    title: "Complete React Developer Course",
    description: "Master React from basics to advanced concepts including hooks, context, and modern patterns.",
    instructor: {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    duration: 45,
    date_created: new Date("2024-01-15"),
    last_updated: new Date("2024-11-20"),
    thumbnail: "/placeholder.svg?height=200&width=300",
    price: 89.99,
    average_rating: 4.8,
    total_students: 12450,
    thumbnail_url: "/placeholder.svg?height=200&width=300",
    total_reviews: 2340,
  },
  {
    id: 2,
    title: "Advanced TypeScript Masterclass",
    description: "Deep dive into TypeScript with advanced types, generics, and real-world applications.",
    instructor: {
      id: 2,
      name: "Michael Chen",
      email: "michael@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    duration: 32,
    date_created: new Date("2024-02-10"),
    last_updated: new Date("2024-11-18"),
    thumbnail: "/placeholder.svg?height=200&width=300",
    price: 79.99,
    average_rating: 4.9,
    total_students: 8920,
    thumbnail_url: "/placeholder.svg?height=200&width=300",
    total_reviews: 1560,
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState<ICourse[]>(initialCartItems)

  const removeFromCart = (courseId: number) => {
    setCartItems(cartItems.filter((item) => item.id !== courseId))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  const formatRating = (rating: number) => rating.toFixed(1)

  if (cartItems.length === 0) {
    return (
      <Box className="min-h-screen bg-gray-100 py-6 flex justify-center items-center">
        <Card sx={{ p: 5, textAlign: "center", maxWidth: 500 }}>
          <ShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
          <Typography variant="h5" gutterBottom>Your cart is empty</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Discover amazing courses and start learning today!
          </Typography>
          <MUIButton variant="contained" sx={{ mt: 3 }} color="primary">
            Browse Courses
          </MUIButton>
        </Card>
      </Box>
    )
  }

  return (
    <Box className="min-h-screen bg-gray-100 py-6">
      <Box className="max-w-7xl mx-auto px-4">
        <Box className="mb-6">
          <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
          <Typography variant="body1" color="text.secondary">
            {cartItems.length} course{cartItems.length !== 1 ? "s" : ""} in your cart
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            {cartItems.map((course) => (
              <Card key={course.id} sx={{ mb: 2 }}>
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <Image
                      src={course.thumbnail_url || "/placeholder.svg"}
                      alt={course.title}
                      width={300}
                      height={200}
                      className="w-full object-cover"
                    />
                  </Grid>
                  <Grid item xs={12} md={8} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h6">{course.title}</Typography>
                      <MUIButton onClick={() => removeFromCart(course.id)}>
                        <Trash2 className="text-red-600" />
                      </MUIButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {course.description}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Image
                        src={course.instructor.avatar || "/placeholder.svg"}
                        alt={course.instructor.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <Typography variant="body2">{course.instructor.name}</Typography>
                    </Box>
                    <Box display="flex" gap={2} flexWrap="wrap">
                      <Chip icon={<Star />} label={`${formatRating(course.average_rating)} (${course.total_reviews})`} color="warning" />
                      <Chip icon={<Clock />} label={`${course.duration}h`} color="info" />
                      <Chip icon={<Users />} label={course.total_students.toLocaleString()} color="success" />
                    </Box>
                    <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                      <Chip label="Bestseller" color="warning" variant="outlined" />
                      <Typography variant="h6">${course.price.toFixed(2)}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card sx={{ position: "sticky", top: 20 }}>
              <CardHeader title="Order Summary" />
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Tax</Typography>
                  <Typography variant="body2">${tax.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1">Total</Typography>
                  <Typography variant="subtitle1">${total.toFixed(2)}</Typography>
                </Box>

                <MUIButton
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{ mt: 3 }}
                  startIcon={<CreditCard />}
                >
                  Checkout
                </MUIButton>
                <MUIButton variant="outlined" fullWidth sx={{ mt: 2 }}>
                  Continue Shopping
                </MUIButton>

                <Box mt={4} bgcolor="green.50" p={2} borderRadius={2} textAlign="center">
                  <Typography variant="body2" color="green.800">
                    30-Day Money-Back Guarantee
                  </Typography>
                  <Typography variant="caption" color="green.600">
                    Full Lifetime Access
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
