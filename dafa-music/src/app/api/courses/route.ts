import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET() {
    try {
        const courses = await prisma.course.findMany();
        return successResponse(courses);
    } catch (error) {
        return errorResponse('Failed to fetch courses');
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, price, totalLessons, durationMinutes } = body;

        if (!name) return errorResponse('Name is required', 400);

        const course = await prisma.course.create({
            data: {
                name,
                price: Number(price),
                totalLessons: Number(totalLessons),
                durationMinutes: Number(durationMinutes || 60),
            },
        });

        return successResponse(course, 201);
    } catch (error) {
        return errorResponse('Failed to create course');
    }
}
