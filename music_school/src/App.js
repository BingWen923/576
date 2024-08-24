import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Navbar, Nav, Pagination } from 'react-bootstrap';

import Staff from './components/staff.js';
import Guardian from './components/guardian.js';
//import Student from './components/student.js'; // You need to create this component
//import Course from './components/course.js';   // You need to create this component
import Teacher from './components/teacher.js'; 

function App() {
    const [activePage, setActivePage] = useState('staff'); // Set initial active page to 'staff'

    // Function to render content based on selected page
    const renderContent = () => {
        switch (activePage) {
            /*
            case 'student':
                return <Student />;
            case 'course':
                return <Course />;*/
            case 'teacher':
                return <Teacher />;
            case 'guardian':
                return <Guardian />;
            case 'staff':
            default:
                return <Staff />;
        }
    };

    return (
        <div className="App">
            {/* Banner */}
            <Navbar bg="dark" variant="dark">
                <Container>
                <Navbar.Brand href="#home">
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
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#about">About</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            {/* Pagination for navigation */}
            <Container className="mt-4">
                <Pagination className="top-pagination">
                    <Pagination.Item active={activePage === 'student'} onClick={() => setActivePage('student')}>
                        Student
                    </Pagination.Item>
                    <Pagination.Item active={activePage === 'course'} onClick={() => setActivePage('course')}>
                        Course
                    </Pagination.Item>
                    <Pagination.Item active={activePage === 'teacher'} onClick={() => setActivePage('teacher')}>
                        Teacher
                    </Pagination.Item>
                    <Pagination.Item active={activePage === 'guardian'} onClick={() => setActivePage('guardian')}>
                        Guardian
                    </Pagination.Item>
                    <Pagination.Item active={activePage === 'staff'} onClick={() => setActivePage('staff')}>
                        Staff
                    </Pagination.Item>
                </Pagination>
            </Container>

            {/* Content Area */}
            <Container className="mt-4">
                {renderContent()}
            </Container>
        </div>
    );
}

export default App;
