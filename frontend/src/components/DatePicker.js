import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const DatePicker = ({ label, value, onChange }) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date(value || new Date()));

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const year = date.getFullYear().toString().slice(-2);
        return `${day} ${month}'${year}`;
    };

    const getDayName = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const handleDateClick = (day) => {
        const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dateString = selectedDate.toISOString().split('T')[0];
        onChange(dateString);
        setShowCalendar(false);
    };

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <div className="date-picker-container">
            <div className="date-picker">
                <p className="date-label">{label}</p>
                <div
                    className="date-display"
                    onClick={() => setShowCalendar(!showCalendar)}
                >
                    {value ? (
                        <div>
                            <div className="date-main">{formatDate(value)}</div>
                            <div className="date-day">{getDayName(value)}</div>
                        </div>
                    ) : (
                        <div className="date-placeholder">Select a date</div>
                    )}
                </div>

                {showCalendar && (
                    <div className="calendar">
                        <div className="calendar-header">
                            <button
                                type="button"
                                className="month-nav"
                                onClick={handlePrevMonth}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                            <span className="month-year">
                                {currentMonth.toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                            <button
                                type="button"
                                className="month-nav"
                                onClick={handleNextMonth}
                            >
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </div>

                        <div className="weekdays">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="weekday">{day}</div>
                            ))}
                        </div>

                        <div className="days-grid">
                            {days.map((day, index) => {
                                if (day === null) {
                                    return <div key={`empty-${index}`} className="day empty"></div>;
                                }

                                const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                const isSelected = value && new Date(value).toDateString() === dateObj.toDateString();
                                const isPast = dateObj < today;

                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        className={`day ${isSelected ? 'selected' : ''} ${isPast ? 'disabled' : ''}`}
                                        onClick={() => !isPast && handleDateClick(day)}
                                        disabled={isPast}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DatePicker;
