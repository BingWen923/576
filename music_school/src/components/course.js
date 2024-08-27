import React, { useState, useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import './list_and_form.css';
import './checkbox.css';
import { renderSortCaret,formatDateTime } from './lib';
import CourseForm from './course_form';
import { Container, Row, Col, Button, Modal, FormGroup, FormControl } from 'react-bootstrap';

// Main Course Component
function Course() {
    const [courseList, setCourseList] = useState([]);
    const [showModal, setShowModal] = useState(false); // State to control the visibility of the Modal

    ///////////////// State for the current course being edited or added or added recurring courses /////////////////////////
    const [currentCourse, setCurrentCourse_] = useState({
        mode: "add1" // Initial mode when the component loads for the first time
    });
    // Custom setCurrentCourse function
    const setCurrentCourse = (value) => {
        if (value === null ||
            (typeof value === 'object' && Object.keys(value).length === 0) ||
            value === "add1") {
            setCurrentCourse_({
                mode: "add1" // add single course
            });
        } else if (value === "addrec") {
            setCurrentCourse_({
                mode: "addrec" // add recurring courses
            });
        } else {
            setCurrentCourse_({
                ...value, 
                mode: "edit" // edit course
            });
        }
    };

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
        if (currentCourse.mode === "edit") {
            // Update existing course
            fetch(`http://localhost:3000/course/${currentCourse.course_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newOrUpdatedCourse)
            }).then(response => {
                if (response.ok) {
                    // Update students and teachers
                    const courseId = currentCourse.course_id;
                    updateStudentsAndTeachers(courseId, newOrUpdatedCourse.students, newOrUpdatedCourse.teachers);
                }
            });
        } else if (currentCourse.mode === "add1") {
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
        } else if (currentCourse.mode === "addrec") {
            // Placeholder for addrec logic
            console.log("addrec mode - logic not yet implemented");
            // You can add your logic here later for handling recurring courses.
        }
    
        setCurrentCourse(null);
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
        setCurrentCourse(course);
        setShowModal(true); // Open the modal
    };

    // Function to handle adding 1 new course (opens the modal)
    const handleAdd1Click = () => {
        setCurrentCourse("add1"); 
        setShowModal(true); // Open the modal
    };
    // Function to handle adding recurring new courses 
    const handleAddRecClick = () => {
        setCurrentCourse("addrec"); 
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
                        add1Course={handleAdd1Click}
                        addRecurringCourses={handleAddRecClick}
                    />
                </Col>
            </Row>
            {/* Modal for adding or editing course */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {currentCourse.mode === "edit" && "Edit Course"}
                        {currentCourse.mode === "add1" && "Add Course"}
                        {currentCourse.mode === "addrec" && "Add Recurring Courses"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CourseForm
                        onSubmit={handleAddOrUpdateCourse}
                        currentCourse={currentCourse}
                        setCurrentCourse={setCurrentCourse}
                        setShowModal={setShowModal}
                    />
                </Modal.Body>
            </Modal>
        </Container>
    );
}

/********************************** Course List Component *****************************/
function CourseList({ courseList, onEditClick, add1Course, addRecurringCourses }) {
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
                    <Button variant="primary"  className="me-3" onClick={add1Course}>
                        + Add Course
                    </Button>
                    <Button variant="primary" onClick={addRecurringCourses}>
                        + Add Recurring Courses
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

export default Course;