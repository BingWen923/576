import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import './list_and_form.css';
import { fetchStudentsForSelectOptions, formatTime } from './lib';
import { Row, Col } from 'react-bootstrap';

// Setup the localizer by providing the moment (or globalize) object to the correct localizer.
const localizer = momentLocalizer(moment);

/********************************** Course List Component *****************************/
function CourseStudentCalendar({ studentCourses = [], selectedStudent, setSelectedStudent, onEditClick }) {
    const [studentOptions, setStudentOptions] = useState([]);

    useEffect(() => {
        fetchStudentsForSelectOptions().then(options => {
            setStudentOptions(options);
        });
    }, []);

    const handleStudentChange = (selectedOption) => {
        setSelectedStudent(selectedOption);
    };

    // Convert courseList to calendar events
    const events = studentCourses.map(course => ({
        title: `${course.name} ${course.classroom}`,
        start: new Date(course.starttime),
        end: new Date(course.endtime),
        resource: course,  // Store the entire course object in resource
        desc: `${formatTime(course.starttime)} - ${formatTime(course.endtime)} ${course.name} ${course.classroom}`,        
        tooltip: `${formatTime(course.starttime)} - ${formatTime(course.endtime)} ${course.name} ${course.classroom}`
    }));

    return (
        <>
            <Row>
                <Select
                    name="student"
                    options={studentOptions}
                    value={selectedStudent}
                    onChange={handleStudentChange}
                    placeholder={"Select the student"}
                    styles={{ container: (provided) => ({ ...provided, width: 360 }) }}
                />
            </Row>
            <Row style={{ height: '20px' }}>
            </Row>
            <Row>
                <Col>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        defaultView="month"
                        style={{ height: 600 }}
                        onDoubleClickEvent={(event) => onEditClick(event.resource)}
                        min={new Date(2024, 7, 1, 8, 0, 0)}  // Start time: 8:00 AM
                        max={new Date(2024, 7, 1, 22, 0, 0)} // End time: 10:00 PM
                    />
                </Col>
            </Row>
        </>
    );
}

export default CourseStudentCalendar;
