"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus } from "lucide-react";

type Course = {
    id: string;
    name: string;
    price: number;
    totalLessons: number;
    durationMinutes: number;
};

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Course>>({ durationMinutes: 60 });

    const fetchCourses = async () => {
        try {
            const res = await fetch("/api/courses");
            const data = await res.json();
            if (data.success) {
                setCourses(data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch courses");
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Course added");
                setIsOpen(false);
                setFormData({ durationMinutes: 60 });
                fetchCourses();
            } else {
                toast.error(data.error || "Operation failed");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
                    <p className="text-muted-foreground">Manage course definitions and pricing.</p>
                </div>
                <Button onClick={() => setIsOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Course
                </Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Total Lessons</TableHead>
                            <TableHead>Duration (mins)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                    No courses found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            courses.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell className="font-medium">{course.name}</TableCell>
                                    <TableCell>${course.price}</TableCell>
                                    <TableCell>{course.totalLessons}</TableCell>
                                    <TableCell>{course.durationMinutes}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Course</DialogTitle>
                        <DialogDescription>
                            Enter the course details below.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input
                                id="name"
                                value={formData.name || ""}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price || ""}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="totalLessons" className="text-right">Lessons</Label>
                            <Input
                                id="totalLessons"
                                type="number"
                                value={formData.totalLessons || ""}
                                onChange={(e) => setFormData({ ...formData, totalLessons: Number(e.target.value) })}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="durationMinutes" className="text-right">Minutes</Label>
                            <Input
                                id="durationMinutes"
                                type="number"
                                value={formData.durationMinutes || 60}
                                onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit">Add Course</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
