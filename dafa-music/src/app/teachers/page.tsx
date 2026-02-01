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

type Teacher = {
    id: string;
    name: string;
    color?: string;
};

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Teacher>>({ color: "#3788d8" });

    const fetchTeachers = async () => {
        try {
            const res = await fetch("/api/teachers");
            const data = await res.json();
            if (data.success) {
                setTeachers(data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch teachers");
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/teachers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Teacher added");
                setIsOpen(false);
                setFormData({ color: "#3788d8" });
                fetchTeachers();
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
                    <h2 className="text-3xl font-bold tracking-tight">Teachers</h2>
                    <p className="text-muted-foreground">Manage teachers and their calendar colors.</p>
                </div>
                <Button onClick={() => setIsOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Teacher
                </Button>
            </div>

            <div className="border rounded-md max-w-2xl">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Color</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teachers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                                    No teachers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            teachers.map((teacher) => (
                                <TableRow key={teacher.id}>
                                    <TableCell className="font-medium">{teacher.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: teacher.color || '#3788d8' }} />
                                            {teacher.color}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Teacher</DialogTitle>
                        <DialogDescription>
                            Enter the teacher's details below.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={formData.name || ""}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="color" className="text-right">
                                Color
                            </Label>
                            <div className="col-span-3 flex gap-2">
                                <Input
                                    id="color"
                                    type="color"
                                    value={formData.color || "#3788d8"}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="w-12 h-10 p-1"
                                />
                                <Input
                                    value={formData.color || "#3788d8"}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="flex-1"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit">Add Teacher</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
