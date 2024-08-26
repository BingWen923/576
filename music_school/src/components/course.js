import React, { useState, useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Select from 'react-select';

import './list_and_form.css';
import './checkbox.css';
import { renderSortCaret,formatDateTime,geneStudentId } from './lib';
import { Container, Row, Col, Button, Modal, Form, FormGroup, FormLabel, FormControl } from 'react-bootstrap';

// Main Course Component
function Course() {
    const [courseList, setCourseList] = useState([]);
    const [editingCourse, setEditingCourse] = useState(null);
    const [showModal, setShowModal] = useState(false); // State to control the visibility of the Modal

    // Function to fetch and refresh the course list
    const fetchCourseList = () => {
        console.log('Fetching course list...');
        fetch("http://localhost:3000/course")
            .then(response => response.json())
            .then(data => setCourseList(data))
            .catch(error => console.error("Error fetching course data:", error));
    };

    useEffect(() => {
        // Fetch course list on the first component load
        fetchCourseList();
    }, []);

    // Function to handle adding or updating course information
    const handleAddOrUpdateCourse = (newOrUpdatedCourse) => {
        if (editingCourse) {
            // Update existing course
            fetch(`http://localhost:3000/course/${editingCourse.course_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newOrUpdatedCourse)
            }).then(response => {
                if (response.ok) {
                    // Update students and teachers
                    const courseId = editingCourse.course_id;
                    updateStudentsAndTeachers(courseId, newOrUpdatedCourse.students, newOrUpdatedCourse.teachers);
                }
            });
        } else {
            // Add new course
            fetch("http://localhost:3000/course", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newOrUpdatedCourse)
            }).then(response => response.json())
              .then(data => {
                  if (data && data.insertId) {
                      // Newly added course ID
                      const courseId = data.insertId;
                      console.log("***********new added course id: ");
                      console.log(courseId);
                      updateStudentsAndTeachers(courseId, newOrUpdatedCourse.students, newOrUpdatedCourse.teachers);
                  }
              });
        }
        setEditingCourse(null);
        setShowModal(false); // Close the modal
    };
    
    // Function to update students and teachers after adding/updating a course
    const updateStudentsAndTeachers = (courseId, students, teachers) => {
        console.log("Updating students and teachers for course ID:", courseId);
        console.log("Students data to be sent:", students);
        console.log("Teachers data to be sent:", teachers);
        // Update students
        fetch(`http://localhost:3000/course/student/${courseId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ students })
        }).then(response => {
            if (response.ok) {
                console.log('Students updated successfully');
                fetchCourseList(); // Refresh the course list
            }
        });
    
        // Update teachers
        fetch(`http://localhost:3000/course/teacher/${courseId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ teachers })
        }).then(response => {
            if (response.ok) {
                console.log('Teachers updated successfully');
                fetchCourseList(); // Refresh the course list
            }
        });
    };

    // Function to handle editing course (opens the modal)
    const handleEditClick = (course) => {
        setEditingCourse(course);
        setShowModal(true); // Open the modal
    };

    // Function to handle adding new course (opens the modal)
    const handleAddClick = () => {
        setEditingCourse(null); // Clear the form for a new course entry
        setShowModal(true); // Open the modal
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <h3>Course List</h3>
                    <CourseList
                        courseList={courseList}
                        onEditClick={handleEditClick}
                        addNewCourse={handleAddClick}
                    />
                </Col>
            </Row>
            {/* Modal for adding or editing course */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingCourse ? "Edit Course" : "Add New Course"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CourseForm
                        onSubmit={handleAddOrUpdateCourse}
                        editingCourse={editingCourse}
                        setEditingCourse={setEditingCourse}
                        setShowModal={setShowModal}
                    />
                </Modal.Body>
            </Modal>
        </Container>
    );
}

/********************************** Course List Component *****************************/
function CourseList({ courseList, onEditClick, addNewCourse }) {
    const [searchTerm, setSearchTerm] = useState('');

    // search/filter
    const filteredCourseList = courseList.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.coursetype.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.starttime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.endtime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.classroom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Define the columns with sorting, formatting, and custom header with icons
    const columns = [
        {
            dataField: 'name',
            text: 'Name',
            sort: true,
            headerClasses: 'sortable-header',
            sortCaret: renderSortCaret
        },
        {
            dataField: 'groupprivate',
            text: 'Group/Private',
            sort: false,
            headerClasses: 'non-sortable-header'
        },
        {
            dataField: 'coursetype',
            text: 'Course Type',
            sort: false,
            headerClasses: 'non-sortable-header'
        },
        {
            dataField: 'starttime',
            text: 'Start Time',
            sort: true,
            headerClasses: 'sortable-header',
            formatter: (cell) => formatDateTime(cell),
            sortCaret: renderSortCaret
        },
        {
            dataField: 'endtime',
            text: 'End Time',
            sort: true,
            headerClasses: 'sortable-header',
            formatter: (cell) => formatDateTime(cell),
            sortCaret: renderSortCaret
        },
        {
            dataField: 'status',
            text: 'Status',
            sort: true,
            headerClasses: 'sortable-header',
            sortCaret: renderSortCaret
        },
        {
            dataField: 'classroom',
            text: 'Classroom',
            sort: true,
            headerClasses: 'sortable-header',
            sortCaret: renderSortCaret
        },
        {
            dataField: 'actions',
            text: 'Actions',
            isDummyField: true,
            headerClasses: 'non-sortable-header',
            formatter: (cell, row) => (
                <Button variant="primary" onClick={() => onEditClick(row)}>
                    Edit
                </Button>
            )
        }
    ];

    return (
        <>
            <Row className="mb-3 align-items-center justify-content-between">
                <Col xs="auto">
                    <Button variant="primary" onClick={addNewCourse}>
                        + Add New Course
                    </Button>
                </Col>
                <Col xs="auto">
                    <FormGroup>
                        <FormControl
                            placeholder="Search course..."
                            aria-label="Search course"
                            aria-describedby="basic-addon1"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </FormGroup>
                </Col>
            </Row>

            <BootstrapTable
                keyField="course_id"
                data={filteredCourseList}
                columns={columns}
                pagination={paginationFactory()}
                striped
                hover
                condensed
            />
        </>
    );
}

/********************** add/edit Course Form Component **********************/
function CourseForm({ onSubmit, editingCourse, setEditingCourse, setShowModal }) {
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
        teachers: []
    });

    useEffect(() => {
        if (editingCourse) {
            // Fetch the teachers in the course
            const fetchTeachersAndStudents = async () => {
                try {
                    const teachersResponse = await fetch(`http://localhost:3000/course/teacher/${editingCourse.course_id}`);
                    const teachersData = await teachersResponse.json();
                    const teachers = teachersData.map(teacher => teacher.teacher_id);
    
                    const studentsResponse = await fetch(`http://localhost:3000/course/student/${editingCourse.course_id}`);
                    const studentsData = await studentsResponse.json();
                    const students = studentsData.map(student => student.student_id);
    
                    // Update the form data with the fetched teachers and students
                    setFormData({
                        ...editingCourse,
                        starttime: editingCourse.starttime ? new Date(editingCourse.starttime).toISOString().slice(0, 16) : "",
                        endtime: editingCourse.endtime ? new Date(editingCourse.endtime).toISOString().slice(0, 16) : "",
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
    }, [editingCourse]);

    /*************** get all students for the select ****************/
    const [studentOptions, setStudentOptions] = useState([]);
    useEffect(() => {
        // Fetch the list of students when the form loads
        fetch('http://localhost:3000/student')
            .then(response => response.json())
            .then(data => {
                const options = data.map(student => ({
                    value: student.student_id,
                    label: geneStudentId(student.student_id) + "|" + student.name
                }));
                setStudentOptions(options);
            })
            .catch(error => console.error("Error fetching student list:", error));
    }, []);

    /*************** get all teachers for the select ****************/
    const [teacherOptions, setTeacherOptions] = useState([]);
    useEffect(() => {
        // Fetch the list of teachers when the form loads
        fetch('http://localhost:3000/teacher')
            .then(response => response.json())
            .then(data => {
                const options = data.map(teacher => ({
                    value: teacher.teacher_id,
                    label: teacher.name
                }));
                setTeacherOptions(options);
            })
            .catch(error => console.error("Error fetching teacher list:", error));
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
            teachers: []
        });
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
                <FormLabel>Start Time</FormLabel>
                <FormControl
                    type="datetime-local"
                    name="starttime"
                    value={formData.starttime}
                    onChange={handleChange}
                    required
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>End Time</FormLabel>
                <FormControl
                    type="datetime-local"
                    name="endtime"
                    value={formData.endtime}
                    onChange={handleChange}
                    required
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
            <FormGroup>
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
            {/******************* FormGroup for students with vertical display *******************/}
            <FormGroup>
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

            <div style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
                <Button type="submit" variant="primary" style={{ width: "150px" }}>
                    {editingCourse ? "Update Course" : "Add Course"}
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    style={{ width: "150px" }}
                    onClick={() => {
                        setEditingCourse(null);
                        setShowModal(false);
                    }}
                >
                    Cancel
                </Button>
            </div>
        </Form>
    );
}

export default Course;
