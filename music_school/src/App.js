import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Navbar, Nav, Pagination } from 'react-bootstrap';

import Staff from './components/staff.js';
import Guardian from './components/guardian.js';
import Student from './components/student.js'; 
import Course from './components/course.js';   
import Teacher from './components/teacher.js'; 

function App() {
    const [activePage, setActivePage] = useState('student'); // Set initial active page to 'student'

    // Function to render content based on selected page
    const renderContent = () => {
        switch (activePage) {
            case 'course':
                return <Course />;
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
        <div className="App">
            {/* Banner */}
            <Navbar bg="dark" variant="dark">
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
