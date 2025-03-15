'use client';

import { useRef, useState } from 'react';
import { Calendar } from './calendar';
import { CalendarIcon, X } from 'lucide-react';
import { format, isValid, parse } from 'date-fns';
import { useOutsideClick } from '#hooks/use-outside-click';

interface CalendarInputProps {
  value?: Date;
  onChange: (date?: Date) => void;
}

export function CalendarInput({ value, onChange }: CalendarInputProps) {
  const [month, setMonth] = useState(() => value ?? new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const [inputValue, setInputValue] = useState<string>(
    value ? format(value, 'MM/dd/yyyy') : '',
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [lastValidDate, setLastValidDate] = useState<Date | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => {
    setShowCalendar(false);
    if (lastValidDate) {
      setInputValue(format(lastValidDate, 'MM/dd/yyyy'));
      setSelectedDate(lastValidDate);
      setMonth(lastValidDate);
      onChange(lastValidDate);
    }
  });

  const parseDateInput = (value: string) => {
    const dateFormats = ['MM', 'MM/dd', 'MM/dd/yyyy'];

    for (const format of dateFormats) {
      const date = parse(value, format, new Date());

      if (isValid(date)) {
        return date;
      }
    }

    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!value) {
      clearInput();
      return;
    }

    setInputValue(value);

    const date = parseDateInput(value);

    if (isValid(date)) {
      setSelectedDate(date as Date);
      setMonth(date as Date);
      onChange(date as Date);
      setLastValidDate(date);
    } else {
      setSelectedDate(undefined);
      onChange(undefined);
    }
  };

  const handleDateChange = (date?: Date) => {
    if (!date) {
      clearInput();
      return;
    }

    setSelectedDate(date);
    setMonth(date);
    setInputValue(format(date, 'MM/dd/yyyy'));
    onChange(date);
  };

  const clearInput = () => {
    setInputValue('');
    setSelectedDate(undefined);
    onChange(undefined);
    setMonth(new Date());
    setShowCalendar(false);
    setLastValidDate(null);
  };

  return (
    <div className="relative" ref={ref}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowCalendar(true)}
        placeholder="MM/DD/YYYY"
        className="w-full cursor-default rounded-md border p-2 pr-8"
      />

      {inputValue && (
        <button
          aria-label="Clear input"
          type="button"
          onClick={clearInput}
          className="absolute right-10 top-1/2 -translate-y-1/2"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      )}

      <CalendarIcon className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50" />

      {showCalendar && (
        <div className="absolute z-10 mt-2">
          <Calendar
            month={month}
            onMonthChange={setMonth}
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
          />
        </div>
      )}
    </div>
  );
}
