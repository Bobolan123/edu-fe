import { useCallback, useRef, useTransition } from 'react';
import { updateLectureProgress } from '@/actions/courseContentAction';

interface UseProgressTrackingProps {
    enrollmentId: string;
    onProgressUpdate?: (lectureId: string, progress: number) => void;
    onError?: (error: string) => void;
    onSuccess?: (message: string) => void;
}

export const useProgressTracking = ({
    enrollmentId,
    onProgressUpdate,
    onError,
    onSuccess
}: UseProgressTrackingProps) => {
    const lastUpdateTimeRef = useRef<Record<string, number>>({});
    const pendingUpdatesRef = useRef<Record<string, NodeJS.Timeout>>({});
    const [isPending, startTransition] = useTransition();

    const updateProgress = useCallback((
        lectureId: string,
        watchTime: number,
        completed: boolean = false,
        submissionData?: any
    ) => {
        startTransition(async () => {
            try {
                await updateLectureProgress(enrollmentId, lectureId, {
                    watchTimeSeconds: Math.floor(watchTime),
                    isCompleted: completed,
                    submissionData,
                });

                // Call optional callback for UI updates
                if (onProgressUpdate) {
                    onProgressUpdate(lectureId, watchTime);
                }

                if (completed && onSuccess) {
                    onSuccess('Lecture completed!');
                }
            } catch (error) {
                console.error('Failed to update progress:', error);
                if (onError) {
                    onError('Failed to update progress');
                }
            }
        });
    }, [enrollmentId, onProgressUpdate, onError, onSuccess]);

    const trackProgress = useCallback((
        lectureId: string,
        currentTime: number,
        duration: number
    ) => {
        const now = Date.now();
        const lastUpdate = lastUpdateTimeRef.current[lectureId] || 0;

        // Update progress every 10 seconds or when progress changes significantly
        const timeSinceLastUpdate = now - lastUpdate;
        const shouldUpdate = timeSinceLastUpdate >= 10000; // 10 seconds

        if (shouldUpdate) {
            // Cancel any pending update for this lecture
            if (pendingUpdatesRef.current[lectureId]) {
                clearTimeout(pendingUpdatesRef.current[lectureId]);
            }

            // Schedule update with debouncing
            pendingUpdatesRef.current[lectureId] = setTimeout(() => {
                updateProgress(lectureId, currentTime);
                lastUpdateTimeRef.current[lectureId] = now;
                delete pendingUpdatesRef.current[lectureId];
            }, 1000); // 1 second debounce
        }
    }, [updateProgress]);

    const markAsCompleted = useCallback((
        lectureId: string,
        watchTime: number,
        submissionData?: any
    ) => {
        updateProgress(lectureId, watchTime, true, submissionData);
    }, [updateProgress]);

    const forceUpdate = useCallback((
        lectureId: string,
        watchTime: number
    ) => {
        // Cancel any pending updates
        if (pendingUpdatesRef.current[lectureId]) {
            clearTimeout(pendingUpdatesRef.current[lectureId]);
            delete pendingUpdatesRef.current[lectureId];
        }

        updateProgress(lectureId, watchTime);
        lastUpdateTimeRef.current[lectureId] = Date.now();
    }, [updateProgress]);

    return {
        trackProgress,
        markAsCompleted,
        forceUpdate,
        isPending,
    };
};

export default useProgressTracking;