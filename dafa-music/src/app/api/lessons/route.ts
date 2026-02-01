import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const start = searchParams.get('start');
        const end = searchParams.get('end');
        const today = searchParams.get('today');

        const where: any = {};

        if (start && end) {
            where.startTime = {
                gte: new Date(start),
                lte: new Date(end),
            };
        } else if (today === 'true') {
            const now = new Date();
            const startOfDay = new Date(now.setHours(0, 0, 0, 0));
            const endOfDay = new Date(now.setHours(23, 59, 59, 999));
            where.startTime = {
                gte: startOfDay,
                lte: endOfDay,
            }
        }

        const lessons = await prisma.lesson.findMany({
            where,
            include: {
                student: { select: { id: true, name: true } },
                teacher: { select: { id: true, name: true, color: true } },
                enrollment: { include: { course: { select: { name: true } } } },
            },
            orderBy: { startTime: 'asc' },
        });

        // Format for FullCalendar or UI
        const events = lessons.map(lesson => ({
            id: lesson.id,
            title: `${lesson.student.name} - ${lesson.enrollment.course.name}`,
            start: lesson.startTime,
            end: lesson.endTime,
            backgroundColor: lesson.teacher.color || '#3788d8',
            borderColor: lesson.teacher.color || '#3788d8',
            extendedProps: {
                studentId: lesson.student.id,
                studentName: lesson.student.name,
                teacherName: lesson.teacher.name,
                status: lesson.status,
            },
        }));

        return successResponse(events);
    } catch (error) {
        console.error('Error fetching lessons:', error);
        return errorResponse('Failed to fetch lessons');
    }
}
