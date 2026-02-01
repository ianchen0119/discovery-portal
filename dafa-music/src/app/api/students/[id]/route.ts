import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const student = await prisma.student.findUnique({
            where: { id },
            include: {
                enrollments: {
                    include: { course: true },
                    orderBy: { purchaseDate: 'desc' },
                },
            },
        });

        if (!student) {
            return errorResponse('Student not found', 404);
        }

        return successResponse(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        return errorResponse('Failed to fetch student');
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, gender, birthday, phone, parentPhone, lineId, address, notes } = body;

        const student = await prisma.student.update({
            where: { id },
            data: {
                name,
                gender,
                birthday: birthday ? new Date(birthday) : undefined,
                phone,
                parentPhone,
                lineId,
                address,
                notes,
            },
        });

        return successResponse(student);
    } catch (error) {
        console.error('Error updating student:', error);
        return errorResponse('Failed to update student');
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.student.delete({
            where: { id },
        });

        return successResponse({ message: 'Student deleted' });
    } catch (error) {
        console.error('Error deleting student:', error);
        return errorResponse('Failed to delete student');
    }
}
