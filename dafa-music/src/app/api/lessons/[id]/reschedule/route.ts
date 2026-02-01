import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { startTime, endTime } = body;

        if (!startTime || !endTime) {
            return errorResponse('Start time and end time are required', 400);
        }

        const lesson = await prisma.lesson.update({
            where: { id },
            data: {
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                isRescheduled: true,
            },
        });

        return successResponse(lesson);
    } catch (error) {
        console.error('Error rescheduling lesson:', error);
        return errorResponse('Failed to reschedule lesson');
    }
}
