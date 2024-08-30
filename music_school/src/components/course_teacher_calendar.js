import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import './list_and_form.css';
import { fetchTeachersForSelectOptions, formatTime } from './lib';
import { Row, Col, Button, FormGroup, FormLabel } from 'react-bootstrap';

// Setup the localizer by providing the moment (or globalize) object to the correct localizer.
const localizer = momentLocalizer(moment);

/********************************** Course List Component *****************************/
function CourseTeacherCalendar({ teacherCourses=[], selectedTeacher, setSelectedTeacher, onEditClick, onDeleteClick }) {
    const [teacherOptions, setTeacherOptions] = useState([]);

    useEffect(() => {
        fetchTeachersForSelectOptions().then(options => {
            setTeacherOptions(options);
        });
    }, []);

    const handleTeacherChange = (selectedOption) => {
        setSelectedTeacher(selectedOption);
    };

    // Convert courseList to calendar events
    const events = teacherCourses.map(course => ({
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
                    name="teacher"
                    options={teacherOptions}
                    value={selectedTeacher}
                    onChange={handleTeacherChange}
                    placeholder={"Select the teacher"}
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
                        defaultView="week"
                        style={{ height: 600 }}
                        onDoubleClickEvent={(event) => onEditClick(event.resource)}
                    />
                </Col>
            </Row>
        </>
    );
}

export default CourseTeacherCalendar;