import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET() {
    try {
        const teachers = await prisma.teacher.findMany();
        return successResponse(teachers);
    } catch (error) {
        return errorResponse('Failed to fetch teachers');
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, color } = body;

        if (!name) return errorResponse('Name is required', 400);

        const teacher = await prisma.teacher.create({
            data: { name, color },
        });

        return successResponse(teacher, 201);
    } catch (error) {
        return errorResponse('Failed to create teacher');
    }
}
