import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap';
import { initializeApp } from "firebase/app"; // Import initializeApp from Firebase
import { getAuth, signOut, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth"; // Import necessary Firebase functions

import Settings from './components/settings.js';
import Staff from './components/staff.js';
import Guardian from './components/guardian.js';
import Student from './components/student.js'; 
import Course from './components/course.js';   
import Teacher from './components/teacher.js'; 

// ISOM Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBFNlr9RxFh8cVnRe1fFK5TxJ3in9ctZTI",
    authDomain: "musicschool-bingwen.firebaseapp.com",
    projectId: "musicschool-bingwen",
    storageBucket: "musicschool-bingwen.appspot.com",
    messagingSenderId: "48494957166",
    appId: "1:48494957166:web:8d91c679eab57b0c9bcc7f"
};

// Initialize Firebase
initializeApp(firebaseConfig);

function App() {
    const [activePage, setActivePage] = useState('student'); // Set initial active page to 'student'
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

     // Logout function
     const handleLogout = () => {
        signOut(auth).then(() => {
            setUser(null); // Clear the user state
            console.log("User logged out");
        }).catch((error) => {
            console.error("Error logging out: ", error);
        });
    };

    // Function to handle login
    const handleLogin = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                setUser(result.user);
                console.log("User signed in");
            })
            .catch((error) => {
                console.error("Error during login: ", error);
            });
    };

    useEffect(() => {
        // Listen for changes in authentication state
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user); // User is signed in
            } else {
                setUser(null); // User is signed out
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [auth]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <h2>Welcome to the Irvine School of Music Portal</h2>
                <p>Please log in to manage the school courses.</p>
                <button onClick={handleLogin} style={{ padding: '10px 20px', backgroundColor: '#2a56c6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    <img src="google-icon.svg"
                        alt="Google Logo" style={{ width: '30px', marginRight: '10px' }} />
                    Sign in with Google
                </button>
            </div>
        );
    }
    

    // Function to render content based on selected page
    const renderContent = () => {
        switch (activePage) {
            case 'courseList':
                return <Course viewMode={"list"} />;
            case 'teacherCalendar':
                return <Course viewMode={"tcalendar"} />;
            case 'studentCalendar':
                return <Course viewMode={"scalendar"} />;
            case 'teacher':
                return <Teacher />;
            case 'guardian':
                return <Guardian />;
            case 'staff':
                return <Staff />;
            case 'settings':
                return <Settings />;
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
                                <Nav.Link>Welcome "{user.displayName}"</Nav.Link>
                                <Nav.Link href="https://www.irvineschoolofmusic.com/">Home</Nav.Link>
                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link> 
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
                            <Nav.Link active={activePage === 'staff'} onClick={() => setActivePage('staff')}>
                                Staff
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link active={activePage === 'settings'} onClick={() => setActivePage('settings')}>
                                Settings
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

