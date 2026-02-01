import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('query');

        const where: any = {};
        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { phone: { contains: query, mode: 'insensitive' } },
            ];
        }

        const students = await prisma.student.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return successResponse(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        return errorResponse('Failed to fetch students');
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, gender, birthday, phone, parentPhone, lineId, address } = body;

        if (!name) {
            return errorResponse('Name is required', 400);
        }

        const student = await prisma.student.create({
            data: {
                name,
                gender,
                birthday: birthday ? new Date(birthday) : undefined,
                phone,
                parentPhone,
                lineId,
                address,
            },
        });

        return successResponse(student, 201);
    } catch (error) {
        console.error('Error creating student:', error);
        return errorResponse('Failed to create student');
    }
}
