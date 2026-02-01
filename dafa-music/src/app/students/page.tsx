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
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Search, Edit } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Student = {
    id: string;
    name: string;
    gender?: string;
    birthday?: string;
    phone?: string;
    parentPhone?: string;
    lineId?: string;
    address?: string;
};

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [formData, setFormData] = useState<Partial<Student>>({});

    const fetchStudents = async () => {
        try {
            const res = await fetch(`/api/students?query=${search}`);
            const data = await res.json();
            if (data.success) {
                setStudents(data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch students");
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [search]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingStudent ? "PUT" : "POST";
            const url = editingStudent ? `/api/students/${editingStudent.id}` : "/api/students";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(editingStudent ? "Student updated" : "Student created");
                setIsOpen(false);
                setEditingStudent(null);
                setFormData({});
                fetchStudents();
            } else {
                toast.error(data.error || "Operation failed");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const openEdit = (student: Student) => {
        setEditingStudent(student);
        setFormData(student);
        setIsOpen(true);
    };

    const openCreate = () => {
        setEditingStudent(null);
        setFormData({});
        setIsOpen(true);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Students</h2>
                    <p className="text-muted-foreground">Manage your student records here.</p>
                </div>
                <Button onClick={openCreate} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Student
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                    placeholder="Search students..."
                    className="max-w-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Parent Phone</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No students found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{student.gender === 'M' ? 'Male' : student.gender === 'F' ? 'Female' : '-'}</TableCell>
                                    <TableCell>{student.phone || '-'}</TableCell>
                                    <TableCell>{student.parentPhone || '-'}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(student)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
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
                        <DialogTitle>{editingStudent ? "Edit Student" : "Add Student"}</DialogTitle>
                        <DialogDescription>
                            Enter the student's details below.
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
                            <Label htmlFor="gender" className="text-right">
                                Gender
                            </Label>
                            <Select
                                value={formData.gender || ""}
                                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="M">Male</SelectItem>
                                    <SelectItem value="F">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                Phone
                            </Label>
                            <Input
                                id="phone"
                                value={formData.phone || ""}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="parentPhone" className="text-right">
                                Parent Phone
                            </Label>
                            <Input
                                id="parentPhone"
                                value={formData.parentPhone || ""}
                                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="birthday" className="text-right">Birthday</Label>
                            <Input
                                id="birthday"
                                type="date"
                                value={formData.birthday ? new Date(formData.birthday).toISOString().split('T')[0] : ''}
                                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lineId" className="text-right">
                                Line ID
                            </Label>
                            <Input
                                id="lineId"
                                value={formData.lineId || ""}
                                onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                                Address
                            </Label>
                            <Input
                                id="address"
                                value={formData.address || ""}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit">Save changes</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
