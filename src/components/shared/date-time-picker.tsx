"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DateTimePickerProps {
    id?: string
    value?: string
    onChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
}

type TimeChangeEvent = React.ChangeEvent<HTMLInputElement>

export function DateTimePicker({
    id,
    value,
    onChange,
    placeholder,
    disabled,
}: DateTimePickerProps) {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(
        value ? parseISO(value) : undefined,
    )
    const [time, setTime] = React.useState(
        value ? format(parseISO(value), "HH:mm") : "",
    )

    const onDateChange = (selectedDate: Date | undefined) => {
        setDate(selectedDate)

        if (!selectedDate) {
            onChange("")
            return
        }

        const [hours, minutes] = time
            ? time.split(":").map(Number)
            : [0, 0]

        selectedDate.setHours(hours, minutes)

        onChange(format(selectedDate, "yyyy-MM-dd'T'HH:mm"))
    }

    const onTimeChange = (event: TimeChangeEvent) => {
        const newTime = event.target.value

        setTime(newTime)

        if (!date || !newTime) return

        const [hours, minutes] = newTime.split(":").map(Number)
        const updatedDate = new Date(date)

        updatedDate.setHours(hours, minutes)

        setDate(updatedDate)
        onChange(format(updatedDate, "yyyy-MM-dd'T'HH:mm"))
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    variant="outline"
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {date
                        ? format(date, "MMM d, yyyy, h:mm a")
                        : placeholder}
                    <ChevronDownIcon />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="flex w-auto flex-col sm:flex-row p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    defaultMonth={date}
                    captionLayout="dropdown"
                    onSelect={onDateChange}
                />

                <div className="border-t sm:border-l p-3 sm:w-40">
                    <Input
                        type="time"
                        value={time}
                        onChange={onTimeChange}
                        disabled={!date}
                        className="bg-muted/50 text-foreground"
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}