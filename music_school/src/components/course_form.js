import React, { useState, useEffect } from 'react';
import Select from 'react-select';

import './list_and_form.css';
import './checkbox.css';
import { formatDateTime, fetchTeachersForSelectOptions, fetchStudentsForSelectOptions } from './lib';
import { Button, Form, FormGroup, FormLabel, FormControl } from 'react-bootstrap';

/********************** add/edit Course Form Component **********************/
function CourseForm({ onSubmit, currentCourse, setCurrentCourse, setShowModal }) {
    const [formData, setFormData] = useState({
        name: "",
        groupprivate: "group",
        coursetype: "general",
        starttime: "",
        endtime: "",
        status: "scheduled",
        classroom: "CR1.1",
        memo: "",
        students: [],
        teachers: [],
        recurrencePeriod: 0,
        recurrenceCount: 1

    });

    useEffect(() => {
        if (currentCourse && currentCourse.course_id) {
            // Fetch the teachers in the course
            const fetchTeachersAndStudents = async () => {
                try {
                    const teachersResponse = await fetch(`http://localhost:3000/course/teacher/${currentCourse.course_id}`);
                    const teachersData = await teachersResponse.json();
                    const teachers = teachersData.map(teacher => teacher.teacher_id);
    
                    const studentsResponse = await fetch(`http://localhost:3000/course/student/${currentCourse.course_id}`);
                    const studentsData = await studentsResponse.json();
                    const students = studentsData.map(student => student.student_id);
    
                    // Update the form data with the fetched teachers and students
                    setFormData({
                        ...currentCourse,
                        starttime: currentCourse.starttime ? formatDateTime(currentCourse.starttime) : "",
                        endtime: currentCourse.endtime ? formatDateTime(currentCourse.endtime) : "",
                        students: students,
                        teachers: teachers
                    });
                } catch (error) {
                    console.error("Error fetching teachers or students for the course:", error);
                }
            };
    
            fetchTeachersAndStudents();
        } else {
            resetForm();
        }
    }, [currentCourse]);

    /*************** get all students for the select ****************/
    const [studentOptions, setStudentOptions] = useState([]);
    /*************** get all teachers for the select ****************/
    const [teacherOptions, setTeacherOptions] = useState([]);

    useEffect(() => {
        fetchTeachersForSelectOptions().then(options => {
            setTeacherOptions(options);
        });
        fetchStudentsForSelectOptions().then(options => {
            setStudentOptions(options);
        });
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleTimeChange = (e) => {
        const { value } = e.target;
        const timeValue = new Date(value).getHours();

        if (timeValue < 8 || timeValue > 22) {
            alert('Please select a time between 08:00 and 22:00');
            return; // Prevent updating the form data if the time is invalid
        }
        handleChange(e);
    };

    const handleStudentsChange = (selectedOptions) => {
        const studentList = selectedOptions.map(option => option.value);
        setFormData({
            ...formData,
            students: studentList
        });
    };

    const handleTeachersChange = (selectedOptions) => {
        const teacherList = selectedOptions.map(option => option.value);
        setFormData({
            ...formData,
            teachers: teacherList
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (formData.status === 'completed' || formData.status === 'deleted') {
            const confirmChange = window.confirm(
                "Setting the course status to 'completed' or 'deleted' will hide it from the list. Are you sure you want to proceed?"
            );
            if (!confirmChange) return; // If the user clicks 'Cancel', stop the submission.
        }
    
        try {
            await onSubmit({
                ...formData,
                students: formData.students, // Keep as array
                teachers: formData.teachers // Keep as array
            });
        } catch (error) {
            console.error("Error submitting course form:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            groupprivate: "group",
            coursetype: "general",
            starttime: "",
            endtime: "",
            status: "scheduled",
            classroom: "CR1.1",
            memo: "",
            students: [],
            teachers: [],
            rec_period: 0,
            rec_count: 1
        });
    };

    const displayRecurringInput = () => {
        if (currentCourse.mode === "addrec") {
            return (
                <FormGroup style={{ borderTop: "2px solid #007bff", borderBottom: "2px solid #007bff", 
                                    borderRadius: "5px",marginTop:"5px",paddingTop:"5px",paddingBottom:"5px"}}>
                    <FormLabel style={{ fontWeight: "bold" }}>Recurrence</FormLabel>

                    {/* Recurrence Period Select */}
                    <FormControl
                        as="select"
                        name="rec_period"
                        value={formData.rec_period}
                        onChange={handleChange}
                        style={{ width: "200px" }}
                        required
                    >
                        <option value="0">No Repeat</option>
                        <option value="1">Daily</option>
                        <option value="2">Every 2 Days</option>
                        <option value="3">Every 3 Days</option>
                        <option value="7">Weekly</option>
                        <option value="14">Every 2 Weeks</option>
                        <option value="m">Monthly</option>
                    </FormControl>
                    <label class="mx-3">&nbsp;&nbsp;&nbsp;&nbsp;Times</label>
                    {/* Recurrence Count Input */}
                    <FormControl
                        type="number"
                        name="rec_count"
                        value={formData.rec_count}
                        onChange={handleChange}
                        min="1"
                        max="100"
                        style={{ width: "100px" }}
                        placeholder="Times"
                        required
                    />
                </FormGroup>
            );
        } else {
            return null;
        }
    };
    

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <FormLabel>Name</FormLabel>
                <FormControl
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Group/Private</FormLabel>
                <FormControl
                    as="select"
                    name="groupprivate"
                    value={formData.groupprivate}
                    onChange={handleChange}
                >
                    <option value="group">Group</option>
                    <option value="private">Private</option>
                </FormControl>
            </FormGroup>
            <FormGroup>
                <FormLabel>Course Type</FormLabel>
                <FormControl
                    as="select"
                    name="coursetype"
                    value={formData.coursetype}
                    onChange={handleChange}
                >
                    <option value="general">General</option>
                    <option value="piano">Piano</option>
                    <option value="violin">Violin</option>
                    <option value="voice">Voice</option>
                    <option value="drum">Drum</option>
                    <option value="guitar">Guitar</option>
                    <option value="flute-saxophone-clarinet">Flute/Saxophone/Clarinet</option>
                </FormControl>
            </FormGroup>
            <FormGroup>
                <FormLabel>Start/End Time</FormLabel>
                <FormControl
                    type="datetime-local"
                    name="starttime"
                    value={formData.starttime}
                    onChange={handleTimeChange}
                    required
                    style={{ width: "200px" }}
                />
                <label class="mx-3">to</label>
                <FormControl
                    type="datetime-local"
                    name="endtime"
                    value={formData.endtime}
                    onChange={handleTimeChange}
                    required
                    style={{ width: "200px" }}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Status</FormLabel>
                <FormControl
                    as="select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="deleted">Deleted</option>
                </FormControl>
            </FormGroup>
            <FormGroup>
                <FormLabel>Classroom</FormLabel>
                <FormControl
                    as="select"
                    name="classroom"
                    value={formData.classroom}
                    onChange={handleChange}
                >
                    <option value="CR1.1">CR1.1</option>
                    <option value="CR1.2">CR1.2</option>
                    <option value="CR1.3">CR1.3</option>
                    <option value="CR1.4">CR1.4</option>
                    <option value="CR2.1">CR2.1</option>
                    <option value="CR2.2">CR2.2</option>
                    <option value="CR2.3">CR2.3</option>
                    <option value="CR2.4">CR2.4</option>
                    <option value="CR2.5">CR2.5</option>
                    <option value="CR2.6">CR2.6</option>
                </FormControl>
            </FormGroup>
            <FormGroup>
                <FormLabel>Memo</FormLabel>
                <FormControl
                    type="text"
                    name="memo"
                    value={formData.memo}
                    onChange={handleChange}
                />
            </FormGroup>
            {/******************* FormGroup for teachers *****************************/}
            <FormGroup className='mt-2'>
                <FormLabel>Teachers</FormLabel>
                <Select
                    isMulti
                    name="teachers"
                    options={teacherOptions} // Use the fetched teacher options here
                    value={formData.teachers.map(teacherId => {
                        const matchedOption = teacherOptions.find(option => option.value === teacherId);
                        return matchedOption || null;
                    })}
                    onChange={handleTeachersChange}
                />
            </FormGroup>

            {/******************* FormGroup for students *******************/}
            <FormGroup className='mt-2'>
                <FormLabel>Students</FormLabel>
                <Select
                    isMulti
                    name="students"
                    options={studentOptions} // Use the fetched student options here
                    value={formData.students.map(studentId => {
                        const matchedOption = studentOptions.find(option => option.value === studentId);
                        return matchedOption || null; 
                    })}
                    onChange={handleStudentsChange}
                />
            </FormGroup>
            {displayRecurringInput() /* insert inputs for adding recurring courses */}

            <div style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
                <Button type="submit" variant="primary" style={{ width: "240px" }}>
                    {currentCourse.mode === "edit" && "Update Course"}
                    {currentCourse.mode === "add1" && "Add Course"}
                    {currentCourse.mode === "addrec" && "Add Recurring Courses"}
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    style={{ width: "240px" }}
                    onClick={() => {
                        setCurrentCourse({});
                        setShowModal(false);
                    }}
                >
                    Cancel
                </Button>
            </div>
        </Form>
    );
}

export default CourseForm;
