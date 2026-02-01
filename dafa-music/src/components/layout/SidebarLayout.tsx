import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Briefcase, Settings, CheckSquare } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen bg-gray-50">
            <aside className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-primary tracking-tight">Dafa Music</h1>
                    <p className="text-sm text-gray-500 mt-1">Management System</p>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <Link href="/calendar">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Calendar className="w-4 h-4" />
                            Calendar
                        </Button>
                    </Link>
                    <Link href="/students">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Users className="w-4 h-4" />
                            Students
                        </Button>
                    </Link>
                    <Link href="/teachers">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Briefcase className="w-4 h-4" />
                            Teachers
                        </Button>
                    </Link>
                    <Link href="/courses">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Settings className="w-4 h-4" />
                            Courses
                        </Button>
                    </Link>
                    <div className="pt-4 mt-4 border-t">
                        <Link href="/check-in">
                            <Button variant="secondary" className="w-full justify-start gap-2">
                                <CheckSquare className="w-4 h-4" />
                                Check-in Today
                            </Button>
                        </Link>
                    </div>
                </nav>
                <div className="p-4 border-t text-xs text-gray-400">
                    v1.0.0
                </div>
            </aside>

            <main className="flex-1 overflow-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
            <Toaster />
        </div>
    );
}
