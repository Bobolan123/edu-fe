"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Pagination, Box } from "@mui/material";

interface ServerPaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export default function ServerPagination({
    currentPage,
    totalPages,
    baseUrl,
}: ServerPaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        // Parse existing parameters from baseUrl
        const [basePath, existingQuery] = baseUrl.split('?');
        const allParams = new URLSearchParams(existingQuery || '');
        
        // Preserve current search params (like tab) and add/update the page parameter
        const currentParams = new URLSearchParams(searchParams.toString());
        for (const [key, value] of currentParams.entries()) {
            if (key !== 'page') {
                allParams.set(key, value);
            }
        }
        allParams.set('page', page.toString());
        
        const newUrl = `${basePath}?${allParams.toString()}`;
        router.push(newUrl, { scroll: false });
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <Box className="flex justify-center mt-6">
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                    '& .MuiPaginationItem-root': {
                        borderRadius: '12px',
                        margin: '0 4px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        '&.Mui-selected': {
                            background: 'linear-gradient(45deg, #2563eb, #3b82f6)',
                            color: 'white',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1d4ed8, #2563eb)',
                            }
                        },
                        '&:hover': {
                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        }
                    }
                }}
            />
        </Box>
    );
}