//import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';

// url for the app
export const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:3000`;

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

// Global function to format time as HH:MM in 24-hour format
export const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

// generate the student id in 6 digits
export const geneStudentId = (student_id) => {
    return student_id.toString().padStart(6, '0');
};

/*************** get all teachers for the select ****************/
export const fetchTeachersForSelectOptions = () => {
    return fetch(`${API_BASE_URL}/teacher`)
        .then(response => response.json())
        .then(data => {
            const options = data.map(teacher => ({
                value: teacher.teacher_id,
                label: teacher.name
            }));
            return options;
        })
        .catch(error => {
            console.error("Error fetching teacher list:", error);
            return [];
        });
};

/*************** get all students for the select ****************/
export const fetchStudentsForSelectOptions = () => {
    return fetch(`${API_BASE_URL}/student`)
        .then(response => response.json())
        .then(data => {
            const options = data.map(student => ({
                value: student.student_id,
                label: `${geneStudentId(student.student_id)} | ${student.name}`
            }));
            return options;
        })
        .catch(error => {
            console.error("Error fetching student list:", error);
            return [];
        });
};

// Function to fetch and refresh the courses for a specified teacher
export const fetchCoursesForTeacher = (selectedTeacher) => {
    console.log('Fetching courses for teacher...');
    if (selectedTeacher && selectedTeacher.value) {
        return fetch(`${API_BASE_URL}/teacher/${selectedTeacher.value}/courses`)
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error("Error fetching teacher course data:", error);
                return [];
            });
    } else {
        return Promise.resolve([]);
    }
};

// Function to fetch and refresh the courses for a specified student
export const fetchCoursesForStudent = (selectedStudent) => {
    console.log('Fetching courses for student...');
    if (selectedStudent && selectedStudent.value) {
        return fetch(`${API_BASE_URL}/student/${selectedStudent.value}/courses`)
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error("Error fetching student course data:", error);
                return [];
            });
    } else {
        return Promise.resolve([]);
    }
};

// Function to fetch and refresh the course list
export const fetchCourseList = () => {
    return fetch(`${API_BASE_URL}/course`)
        .then(response => response.json())
        .then(data => { 
            return data;
        })
        .catch(error => {
            console.error("Error fetching course for list:", error);
            return [];
        });
};
