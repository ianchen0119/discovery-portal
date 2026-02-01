"use client";

import { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import dayjs from "dayjs";
import { type EventClickArg, type EventDropArg } from "@fullcalendar/core";

export default function CalendarPage() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const calendarRef = useRef<FullCalendar>(null);

    const fetchEvents = async (start: string, end: string) => {
        try {
            const res = await fetch(`/api/lessons?start=${start}&end=${end}`);
            const data = await res.json();
            if (data.success) {
                setEvents(data.data);
            }
        } catch (error) {
            toast.error("Failed to load calendar events");
        }
    };

    useEffect(() => {
        // Initial fetch for current month
        // In a real app, we should use the datesChange callback from FullCalendar
        const start = dayjs().startOf('month').subtract(1, 'week').toISOString();
        const end = dayjs().endOf('month').add(1, 'week').toISOString();
        fetchEvents(start, end);
    }, []);

    const handleDatesSet = (dateInfo: any) => {
        fetchEvents(dateInfo.startStr, dateInfo.endStr);
    }

    const handleEventClick = (info: EventClickArg) => {
        setSelectedEvent({
            id: info.event.id,
            title: info.event.title,
            start: info.event.start,
            end: info.event.end,
            extendedProps: info.event.extendedProps,
        });
        setIsDialogOpen(true);
    };

    const handleEventDrop = async (info: EventDropArg) => {
        const { event } = info;
        try {
            const res = await fetch(`/api/lessons/${event.id}/reschedule`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startTime: event.start?.toISOString(),
                    endTime: event.end?.toISOString(),
                }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Rescheduled successfully');
            } else {
                info.revert();
                toast.error('Failed to reschedule');
            }
        } catch (error) {
            info.revert();
            toast.error('Error during reschedule');
        }
    }

    const updateStatus = async (status: number) => {
        if (!selectedEvent) return;
        try {
            const res = await fetch(`/api/lessons/${selectedEvent.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Status updated');
                setIsDialogOpen(false);
                // Refresh events
                if (calendarRef.current) {
                    const api = calendarRef.current.getApi();
                    fetchEvents(api.view.currentStart.toISOString(), api.view.currentEnd.toISOString());
                }
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    }

    return (
        <div className="space-y-4 h-[calc(100vh-100px)]">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Schedule</h2>
            </div>

            <div className="bg-white p-4 rounded-lg shadow h-[90%]">
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    events={events} // Pass the fetched events here
                    editable={true}
                    selectable={true}
                    eventClick={handleEventClick}
                    eventDrop={handleEventDrop}
                    datesSet={handleDatesSet}
                    height="100%"
                    slotMinTime="08:00:00"
                    slotMaxTime="22:00:00"
                />
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedEvent?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <p><strong>Time:</strong> {dayjs(selectedEvent?.start).format('YYYY-MM-DD HH:mm')} - {dayjs(selectedEvent?.end).format('HH:mm')}</p>
                        <p><strong>Teacher:</strong> {selectedEvent?.extendedProps?.teacherName}</p>
                        <p><strong>Status:</strong> {selectedEvent?.extendedProps?.status === 1 ? 'Checked In' : selectedEvent?.extendedProps?.status === 2 ? 'On Leave' : 'Pending'}</p>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => updateStatus(2)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            Mark as Leave
                        </Button>
                        <Button onClick={() => updateStatus(1)} className="bg-green-600 hover:bg-green-700">
                            Check In
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
