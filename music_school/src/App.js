import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap';

import Staff from './components/staff.js';
import Guardian from './components/guardian.js';
import Student from './components/student.js'; 
import CourseList from './components/course.js';   
import Teacher from './components/teacher.js'; 

function App() {
    const [activePage, setActivePage] = useState('student'); // Set initial active page to 'student'

    // Function to render content based on selected page
    const renderContent = () => {
        switch (activePage) {
            case 'courseList':
                return <CourseList />;
            case 'teacherCalendar':
                return <div>Teacher's Calendar - Coming Soon</div>;
            case 'studentCalendar':
                return <div>Student's Calendar - Coming Soon</div>;
            case 'teacher':
                return <Teacher />;
            case 'guardian':
                return <Guardian />;
            case 'staff':
                return <Staff />;
            default:
            case 'student':
                return <Student />;
        }
    };

    return (
        <Container fluid>
            {/* First Row: Banner */}
            <Row>
                <Col style={{ paddingLeft: 0 }}>
                    <Navbar bg="dark" variant="dark" className="ISOM_Banner">
                        <Container>
                            <Navbar.Brand href="https://www.irvineschoolofmusic.com/">
                                {/* Logo Image */}
                                <img
                                    alt="logo"
                                    src={"/ISOM-logo.png"}
                                    width="60"
                                    height="60"
                                    className="d-inline-block align-center"
                                />{' '}
                                Irvine School of Music
                            </Navbar.Brand>
                            <Nav className="ml-auto">
                                <Nav.Link href="https://www.irvineschoolofmusic.com/">Home</Nav.Link>
                                <Nav.Link href="https://www.irvineschoolofmusic.com/about-us/">About</Nav.Link>
                            </Nav>
                        </Container>
                    </Navbar>
                </Col>
            </Row>

            {/* Second Row: Sidebar and Content */}
            
            <Row>
                <Col id="111" className="nav-sidebar">
                    {/* Sidebar navigation */}
                    <Nav className="flex-column">
                        <Nav.Item>
                            <Nav.Link active={activePage === 'student'} onClick={() => setActivePage('student')}>
                                Student
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <div className="nav-link course-header">Course</div> {/* Just a display, not clickable */}
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className="nav-sub" active={activePage === 'courseList'} onClick={() => setActivePage('courseList')}>
                                Course List
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className="nav-sub" active={activePage === 'teacherCalendar'} onClick={() => setActivePage('teacherCalendar')}>
                                Teacher's Calendar
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className="nav-sub" active={activePage === 'studentCalendar'} onClick={() => setActivePage('studentCalendar')}>
                                Student's Calendar
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link active={activePage === 'teacher'} onClick={() => setActivePage('teacher')}>
                                Teacher
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link active={activePage === 'guardian'} onClick={() => setActivePage('guardian')}>
                                Guardian
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link id="222" active={activePage === 'staff'} onClick={() => setActivePage('staff')}>
                                Staff
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>

                <Col className="content-area">
                    {renderContent()}
                </Col>
            </Row>
            
        </Container>
    );
}

export default App;

