import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';

// Global function to determine the sort caret icon for all list
export const renderSortCaret = (order) => {
    if (!order) return <FaSort />;
    if (order === 'asc') return <FaSortUp />;
    if (order === 'desc') return <FaSortDown />;
    return null;
};

// Global function to format date and time, YYYY-MM-DD HH:MM
export const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const [fullDate, time] = date.toISOString().split('T');
    const formattedTime = time.slice(0, 5); // Extracts HH:MM (ignores seconds and milliseconds)
    return `${fullDate} ${formattedTime}`;
};

// Global function to format date but no time, YYYY-MM-DD
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extracts only the date (YYYY-MM-DD)
};

// generate the student id in 6 digits
export const geneStudentId = (student_id) => {
    return student_id.toString().padStart(6, '0');
};