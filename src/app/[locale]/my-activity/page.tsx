'use client';

import { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent,
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

// Sample data - replace with actual data from your backend
const generateMonthlyData = () => {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return months.map((month) => ({
        month,
        hours: Math.floor(Math.random() * 50) + 10, // Random hours between 10-60
    }));
};

const yearlyData = {
    2024: generateMonthlyData(),
    2023: generateMonthlyData(),
};

type YearOption = '2024' | '2023';

export default function LearningActivityPage() {
    const [selectedYear, setSelectedYear] = useState<YearOption>('2024');

    const handleYearChange = (event: SelectChangeEvent) => {
        setSelectedYear(event.target.value as YearOption);
    };

    const currentData = yearlyData[selectedYear];
    const totalHours = currentData.reduce((sum, item) => sum + item.hours, 0);
    const averageHours = Math.round(totalHours / currentData.length);

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Learning Activity
            </Typography>

            <Box sx={{ mb: 4 }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Year</InputLabel>
                    <Select
                        value={selectedYear}
                        label="Year"
                        onChange={handleYearChange}
                    >
                        <MenuItem value="2024">2024</MenuItem>
                        <MenuItem value="2023">2023</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Time Spent Learning
                            </Typography>
                            <Box sx={{ height: 400 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={currentData}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 20,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="month"
                                            tick={{ fill: 'text.primary' }}
                                        />
                                        <YAxis 
                                            tick={{ fill: 'text.primary' }}
                                            label={{ 
                                                value: 'Hours', 
                                                angle: -90, 
                                                position: 'insideLeft',
                                                fill: 'text.primary'
                                            }}
                                        />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="hours"
                                            stroke="#1976d2"
                                            strokeWidth={2}
                                            dot={{ fill: '#1976d2' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Total Hours
                                    </Typography>
                                    <Typography variant="h3" color="primary">
                                        {totalHours}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        hours spent learning in {selectedYear}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Average Monthly Hours
                                    </Typography>
                                    <Typography variant="h3" color="primary">
                                        {averageHours}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        hours per month
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
} 