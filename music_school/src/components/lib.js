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
    return date.toLocaleDateString('en-CA') + ' ' + date.toLocaleTimeString('en-CA', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

// Global function to format date but no time, YYYY-MM-DD
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA');
};

// generate the student id in 6 digits
export const geneStudentId = (student_id) => {
    return student_id.toString().padStart(6, '0');
};