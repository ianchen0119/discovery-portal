import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';
import { addDays, addMinutes, parseISO } from 'date-fns';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { studentId, courseId, teacherId, startDate, startTime, totalLessons, pricePaid } = body;

        if (!studentId || !courseId || !teacherId || !startDate || !startTime || !totalLessons) {
            return errorResponse('Missing required fields', 400);
        }

        // 1. Fetch Course Details
        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            return errorResponse('Course not found', 404);
        }

        const durationMinutes = course.durationMinutes || 60;

        // 2. Create Enrollment
        const enrollment = await prisma.enrollment.create({
            data: {
                studentId,
                courseId,
                totalLessons: Number(totalLessons),
                pricePaid: Number(pricePaid),
                purchaseDate: new Date(),
            },
        });

        // 3. Auto-Schedule Lessons
        const lessonsData = [];
        const firstLessonStart = parseISO(`${startDate}T${startTime}:00`);

        // We assume startDate/startTime are local time, and we store as ISO (UTC) in DB via Prisma
        // But since this is a local app, we just need to be consistent. 
        // parseISO will parse it as local time if no timezone, yielding a Date object.

        for (let i = 0; i < Number(totalLessons); i++) {
            const lessonStart = addDays(firstLessonStart, i * 7);
            const lessonEnd = addMinutes(lessonStart, durationMinutes);

            lessonsData.push({
                enrollmentId: enrollment.id,
                studentId,
                teacherId,
                startTime: lessonStart,
                endTime: lessonEnd,
                status: 0, // Pending
                isRescheduled: false,
            });
        }

        await prisma.lesson.createMany({
            data: lessonsData,
        });

        return successResponse({ enrollment, lessonsCreated: lessonsData.length }, 201);

    } catch (error) {
        console.error('Error creating enrollment:', error);
        return errorResponse('Failed to create enrollment');
    }
}
