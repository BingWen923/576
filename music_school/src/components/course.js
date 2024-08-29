import React, { useState, useEffect } from 'react';


import './list_and_form.css';
import './checkbox.css';
import CourseForm from './course_form';
import CourseList from './course_list';
import { Container, Row, Col,  Modal } from 'react-bootstrap';

// Main Course Component
function Course({viewMode}) {
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
                    fetchCourseList(); // Refresh the course list
                }
            });
        } else if (currentCourse.mode === "add1" || currentCourse.mode === "addrec") {
            // Add new course or add recurring courses
            console.log("1111111111111111");
            console.log(newOrUpdatedCourse);
            console.log("22222222222222222222");
            fetch("http://localhost:3000/course", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newOrUpdatedCourse)
            }).then(response => response.json())
              .then(data => {
                  if (data) {
                      fetchCourseList(); // Refresh the course list
                  }
              });
        }
    
        setCurrentCourse(null);
        setShowModal(false); // Close the modal
    };
    
    // Function to handle editing course (opens the modal)
    const handleEditClick = (course) => {
        setCurrentCourse(course);
        setShowModal(true); // Open the modal
    };

    const handleDeleteClick = (course) => {
        const confirmation = window.confirm(`Are you sure you want to delete the course "${course.name}"? This action cannot be undone.`);
    
        if (confirmation) {
            fetch(`http://localhost:3000/course/${course.course_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => {
                if (response.ok) {
                    fetchCourseList(); // Refresh the course list
                } else {
                    console.error("Failed to delete the course.");
                }
            }).catch(error => {
                console.error("Error occurred during deletion:", error);
            });
        }
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

    const displayContent =  (vMode) => {
        if (vMode === "list") {
            return (
                <React.Fragment>
                    <h3>Course List</h3>
                    <CourseList
                        courseList={courseList}
                        onEditClick={handleEditClick}
                        onDeleteClick={handleDeleteClick}
                        add1Course={handleAdd1Click}
                        addRecurringCourses={handleAddRecClick}
                    />
                </React.Fragment>
            );
        } else if (vMode === "tcalendar") {
            return <h3>Teacher's Calendar - Coming Soon</h3>;
        } else if (vMode === "scalendar") {
            return <h3>Student's Calendar - Coming Soon</h3>;
        } 
    };

    return (
        <Container className="mt-3">
            <Row>
                <Col>
                    {displayContent(viewMode)}
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

export default Course;