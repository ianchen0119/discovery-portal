"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";
import dayjs from "dayjs";

type Lesson = {
    id: string;
    startTime: string;
    endTime: string;
    status: number;
    student: { name: string };
    teacher: { name: string; color: string };
    enrollment: { course: { name: string } };
};

export default function CheckInPage() {
    const [lessons, setLessons] = useState<Lesson[]>([]);

    const fetchTodayLessons = async () => {
        try {
            const res = await fetch("/api/lessons?today=true");
            const data = await res.json();
            if (data.success) {
                setLessons(data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch today's lessons");
        }
    };

    useEffect(() => {
        fetchTodayLessons();
    }, []);

    const updateStatus = async (id: string, newStatus: number) => {
        try {
            const res = await fetch(`/api/lessons/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(newStatus === 1 ? "Checked in!" : "Marked as Leave");
                fetchTodayLessons();
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Today's Check-in</h2>
                <p className="text-muted-foreground">{dayjs().format("YYYY-MM-DD dddd")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lessons.length === 0 ? (
                    <p className="text-gray-500 col-span-full">No lessons scheduled for today.</p>
                ) : (
                    lessons.map((lesson) => (
                        <Card key={lesson.id} className="overflow-hidden border-l-4" style={{ borderLeftColor: lesson.teacher.color || '#3788d8' }}>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold">{lesson.student.name}</h3>
                                        <p className="text-sm text-gray-500">{lesson.enrollment.course.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-lg">{dayjs(lesson.startTime).format("HH:mm")}</p>
                                        <p className="text-xs text-gray-400">to {dayjs(lesson.endTime).format("HH:mm")}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: lesson.teacher.color || '#3788d8' }} />
                                    {lesson.teacher.name}
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        className={`flex-1 ${lesson.status === 1 ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                        variant={lesson.status === 1 ? "default" : "outline"}
                                        onClick={() => updateStatus(lesson.id, 1)}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        {lesson.status === 1 ? "Checked In" : "Check In"}
                                    </Button>
                                    <Button
                                        className={`flex-1 ${lesson.status === 2 ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`} // Explicitly set text-white for red variant
                                        variant={lesson.status === 2 ? "default" : "outline"} // Use default variant (solid) if selected, but override color
                                        onClick={() => updateStatus(lesson.id, 2)}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        {lesson.status === 2 ? "On Leave" : "Leave"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
