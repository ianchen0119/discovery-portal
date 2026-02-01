import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        if (status === undefined) {
            return errorResponse('Status is required', 400);
        }

        const lesson = await prisma.lesson.update({
            where: { id },
            data: {
                status: Number(status),
            },
        });

        return successResponse(lesson);
    } catch (error) {
        console.error('Error updating lesson status:', error);
        return errorResponse('Failed to update lesson status');
    }
}
