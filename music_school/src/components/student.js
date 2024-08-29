import React, { useState, useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Select from 'react-select';
import { renderSortCaret,geneStudentId } from './lib';
import './list_and_form.css';
import './checkbox.css';
import { Container, Row, Col, Button, Modal, Form, FormGroup, FormLabel, FormControl } from 'react-bootstrap';

// Main Student Component
function Student() {
    const [studentList, setStudentList] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [showModal, setShowModal] = useState(false); // State to control the visibility of the Modal

    // Function to fetch and refresh the student list
    const fetchStudentList = () => {
        console.log('Fetching student list...');
        fetch("http://localhost:3000/student")
            .then(response => response.json())
            .then(data => setStudentList(data))
            .catch(error => console.error("Error fetching student data:", error));
    };

    useEffect(() => {
        // Fetch student list on the first component load
        fetchStudentList();
    }, []);

    // Function to handle adding or updating student information
    const handleAddOrUpdateStudent = (newOrUpdatedStudent) => {
        if (editingStudent) {
            // Update existing student
            fetch(`http://localhost:3000/student/${editingStudent.student_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newOrUpdatedStudent)
            }).then(response => {
                if (response.ok) {
                    // Refresh the student list
                    fetchStudentList();
                    setEditingStudent(null);
                    setShowModal(false); // Close the modal
                }
            });
        } else {
            // Add new student
            fetch("http://localhost:3000/student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newOrUpdatedStudent)
            }).then(response => {
                if (response.ok) {
                    // Refresh the student list
                    fetchStudentList();
                    setShowModal(false); // Close the modal
                }
            });
        }
    };

    // Function to handle editing student (opens the modal)
    const handleEditClick = (student) => {
        setEditingStudent(student);
        setShowModal(true); // Open the modal
    };

    // Function to handle adding new student (opens the modal)
    const handleAddClick = () => {
        setEditingStudent(null); // Clear the form for a new student entry
        setShowModal(true); // Open the modal
    };

    return (
        <Container className="mt-3">
            <Row>
                <Col>
                    <h3>Student List</h3>
                    <StudentList
                        studentList={studentList}
                        onEditClick={handleEditClick}
                        addNewStudent={handleAddClick}
                    />
                </Col>
            </Row>
            {/* Modal for adding or editing student */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingStudent ? "Edit Student" : "Add New Student"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <StudentForm
                        onSubmit={handleAddOrUpdateStudent}
                        editingStudent={editingStudent}
                        setEditingStudent={setEditingStudent}
                        setShowModal={setShowModal}
                    />
                </Modal.Body>
            </Modal>
        </Container>
    );
}

/********************************** Student List Component *****************************/
function StudentList({ studentList, onEditClick, addNewStudent }) {
    const [searchTerm, setSearchTerm] = useState('');

    // search/filter
    const filteredStudentList = studentList.filter(student =>
        geneStudentId(student.student_id).includes(searchTerm.toLowerCase()) ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studyprograms.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Define the columns with sorting and formatting options
    const columns = [
        {
            dataField: 'student_id',
            text: 'Student ID',
            sort: true,
            sortCaret: renderSortCaret,
            formatter: (cell) => geneStudentId(cell)
        },
        {
            dataField: 'name',
            text: 'Name',
            sort: true,
            sortCaret: renderSortCaret
        },
        {
            dataField: 'phone',
            text: 'Phone',
            sort: false
        },
        {
            dataField: 'email',
            text: 'Email',
            sort: false
        },
        {
            dataField: 'status',
            text: 'Status',
            sort: true,
            sortCaret: renderSortCaret
        },
        {
            dataField: 'studyprograms',
            text: 'Study Programs',
            sort: true,
            sortCaret: renderSortCaret
        },
        {
            dataField: 'actions',
            text: 'Actions',
            isDummyField: true,
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
                    <Button variant="primary" onClick={addNewStudent}>
                        + Add New Student
                    </Button>
                </Col>
                <Col xs="auto">
                    <FormGroup>
                        <FormControl
                            placeholder="Search student..."
                            aria-label="Search student"
                            aria-describedby="basic-addon1"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </FormGroup>
                </Col>
            </Row>

            <BootstrapTable
                keyField="student_id"
                data={filteredStudentList}
                columns={columns}
                pagination={paginationFactory()}
                striped
                hover
                condensed
            />
        </>
    );
}

/********************** add/edit Student Form Component **********************/
function StudentForm({ onSubmit, editingStudent, setEditingStudent, setShowModal }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        memo: "",
        status: "active",
        parents1: null,
        parents2: null,
        studyprograms: [],
    });

    useEffect(() => {
        if (editingStudent) {
            setFormData({
                ...editingStudent,
                studyprograms: editingStudent.studyprograms ? editingStudent.studyprograms.split(",") : []
            });
        } else {
            resetForm();
        }
    }, [editingStudent]);

    // for the guardian select component
    const [guardianList, setGuardianList] = useState([]);
    const options = guardianList.map(guardian => ({
        value: guardian.guardian_id,
        label: `${guardian.name} / ${guardian.phone}`
    }));
    useEffect(() => {
        // Fetch the list of guardians
        fetch("http://localhost:3000/guardian")
            .then(response => response.json())
            .then(data => setGuardianList(data))
            .catch(error => console.error("Error fetching guardian data:", error));
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleStudyProgramsChange = (e) => {
        setFormData(prevState => {
            // Initialize an empty array to store the updated values
            let updatedStudyPrograms = [];
    
            // Get all checkboxes with the name "studyprograms"
            const checkboxes = document.querySelectorAll('input[name="studyprograms"]');
    
            // Loop through each checkbox and add its value if it is checked
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    updatedStudyPrograms.push(checkbox.value);
                }
            });
    
            return {
                ...prevState,
                studyprograms: updatedStudyPrograms
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            studyprograms: formData.studyprograms.join(",") // Convert array to comma-separated string
        });
    };

    const resetForm = () => {
        setFormData({
            name: "",
            phone: "",
            email: "",
            address: "",
            memo: "",
            status: "active",
            parents1: null,
            parents2: null,
            studyprograms: [],
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
                <FormLabel>Phone</FormLabel>
                <FormControl
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Email</FormLabel>
                <FormControl
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Address</FormLabel>
                <FormControl
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                />
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
            <FormGroup>
                <FormLabel>Status</FormLabel>
                <FormControl
                    as="select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="onleave">On Leave</option>
                </FormControl>
            </FormGroup>
            <FormGroup>
                <FormLabel>Parents 1</FormLabel>
                <Select
                    className="custom-select"
                    classNamePrefix="custom"
                    name="parents1"
                    value={options.find(option => option.value === formData.parents1) || null}
                    onChange={(selectedOption) => {
                        setFormData({
                            ...formData,
                            parents1: selectedOption ? selectedOption.value : null
                        });
                    }}
                    options={options}
                    isClearable
                    placeholder="Select Parent 1"
                    noOptionsMessage={() => "No matches found"}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Parents 2</FormLabel>
                <Select
                    className="custom-select"
                    classNamePrefix="custom"
                    name="parents2"
                    value={options.find(option => option.value === formData.parents2) || null}
                    onChange={(selectedOption) => {
                        setFormData({
                            ...formData,
                            parents1: selectedOption ? selectedOption.value : null
                        });
                    }}
                    options={options}
                    isClearable
                    placeholder="Select Parent 2"
                    noOptionsMessage={() => "No matches found"}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Study Programs</FormLabel>
                <div className="checkbox-container">
                <Container>
                    <Row>
                        <Col xs={4}>
                            <Form.Check
                                type="checkbox"
                                label="Piano"
                                name="studyprograms"
                                value="piano"
                                checked={formData.studyprograms.includes("piano")}
                                onChange={handleStudyProgramsChange}
                            />
                        </Col>
                        <Col xs={4}>
                            <Form.Check
                                type="checkbox"
                                label="Voice"
                                name="studyprograms"
                                value="voice"
                                checked={formData.studyprograms.includes("voice")}
                                onChange={handleStudyProgramsChange}
                            />
                        </Col>
                        <Col xs={4}>
                            <Form.Check
                                type="checkbox"
                                label="Violin"
                                name="studyprograms"
                                value="violin"
                                checked={formData.studyprograms.includes("violin")}
                                onChange={handleStudyProgramsChange}
                            />
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col xs={4}>
                            <Form.Check
                                type="checkbox"
                                label="Drum"
                                name="studyprograms"
                                value="drum"
                                checked={formData.studyprograms.includes("drum")}
                                onChange={handleStudyProgramsChange}
                            />
                        </Col>
                        <Col xs={4}>
                            <Form.Check
                                type="checkbox"
                                label="Guitar"
                                name="studyprograms"
                                value="guitar"
                                checked={formData.studyprograms.includes("guitar")}
                                onChange={handleStudyProgramsChange}
                            />
                        </Col>
                        <Col xs={4}>
                            <Form.Check
                                type="checkbox"
                                label="Flute/Saxophone/Clarinet"
                                name="studyprograms"
                                value="flute-saxophone-clarinet"
                                checked={formData.studyprograms.includes("flute-saxophone-clarinet")}
                                onChange={handleStudyProgramsChange}
                            />
                        </Col>
                    </Row>
                </Container>
                </div>
            </FormGroup>
            <div style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
                <Button type="submit" variant="primary" style={{ width: "150px" }}>
                    {editingStudent ? "Update Student" : "Add Student"}
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    style={{ width: "150px" }}
                    onClick={() => {
                        setEditingStudent(null);
                        setShowModal(false);
                    }}
                >
                    Cancel
                </Button>
            </div>
        </Form>
    );
}

export default Student;
