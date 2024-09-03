import React, { useState, useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { API_BASE_URL, renderSortCaret } from './lib';
import './list_and_form.css';
import './checkbox.css';
import { Container, Row, Col, Button, Modal, Form, FormGroup, FormLabel, FormControl } from 'react-bootstrap';

// Main Teacher Component
function Teacher() {
    const [teacherList, setTeacherList] = useState([]);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [showModal, setShowModal] = useState(false); // State to control the visibility of the Modal

    // Function to fetch and refresh the teacher list
    const fetchTeacherList = () => {
        console.log('Fetching teacher list...');
        fetch(`${API_BASE_URL}/teacher`)
            .then(response => response.json())
            .then(data => setTeacherList(data))
            .catch(error => console.error("Error fetching teacher data:", error));
    };

    useEffect(() => {
        // Fetch teacher list on the first component load
        fetchTeacherList();
    }, []);

    // Function to handle adding or updating teacher information
    const handleAddOrUpdateTeacher = (newOrUpdatedTeacher) => {
        if (editingTeacher) {
            // Update existing teacher
            fetch(`${API_BASE_URL}/teacher/${editingTeacher.teacher_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newOrUpdatedTeacher)
            }).then(response => {
                if (response.ok) {
                    // Refresh the teacher list
                    fetchTeacherList();
                    setEditingTeacher(null);
                    setShowModal(false); // Close the modal
                }
            });
        } else {
            // Add new teacher
            fetch(`${API_BASE_URL}/teacher`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newOrUpdatedTeacher)
            }).then(response => {
                if (response.ok) {
                    // Refresh the teacher list
                    fetchTeacherList();
                    setShowModal(false); // Close the modal
                }
            });
        }
    };

    // Function to handle editing teacher (opens the modal)
    const handleEditClick = (teacher) => {
        setEditingTeacher(teacher);
        setShowModal(true); // Open the modal
    };

    // Function to handle adding new teacher (opens the modal)
    const handleAddClick = () => {
        setEditingTeacher(null); // Clear the form for a new teacher entry
        setShowModal(true); // Open the modal
    };

    return (
        <Container className="mt-3">
            <Row>
                <Col>
                    <h3>Teacher List</h3>
                    <TeacherList
                        teacherList={teacherList}
                        onEditClick={handleEditClick}
                        addNewTeacher={handleAddClick}
                    />
                </Col>
            </Row>
            {/* Modal for adding or editing teacher */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingTeacher ? "Edit Teacher" : "Add New Teacher"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TeacherForm
                        onSubmit={handleAddOrUpdateTeacher}
                        editingTeacher={editingTeacher}
                        setEditingTeacher={setEditingTeacher}
                        setShowModal={setShowModal}
                    />
                </Modal.Body>
            </Modal>
        </Container>
    );
}

/********************************** Teacher List Component *****************************/
function TeacherList({ teacherList, onEditClick, addNewTeacher }) {
    const [searchTerm, setSearchTerm] = useState('');

    // search/filter
    const filteredTeacherList = teacherList.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.specialties.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Define the columns with sorting and formatting options
    const columns = [
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
            dataField: 'specialties',
            text: 'Specialties',
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
                    <Button variant="primary" onClick={addNewTeacher}>
                        + Add New Teacher
                    </Button>
                </Col>
                <Col xs="auto">
                    <FormGroup>
                        <FormControl
                            placeholder="Search teacher..."
                            aria-label="Search teacher"
                            aria-describedby="basic-addon1"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </FormGroup>
                </Col>
            </Row>

            <BootstrapTable
                keyField="teacher_id"
                data={filteredTeacherList}
                columns={columns}
                pagination={paginationFactory()}
                striped
                hover
                condensed
            />
        </>
    );
}

/********************** add/edit Teacher Form Component **********************/
function TeacherForm({ onSubmit, editingTeacher, setEditingTeacher, setShowModal }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        memo: "",
        status: "active",
        specialties: [],
    });

    useEffect(() => {
        if (editingTeacher) {
            setFormData({
                ...editingTeacher,
                specialties: editingTeacher.specialties ? editingTeacher.specialties.split(",") : []
            });
        } else {
            resetForm();
        }
    }, [editingTeacher]);
    

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSpecialtiesChange = (e) => {
        setFormData(prevState => {
            // Initialize an empty array to store the updated values
            let updatedSpecialties = [];
    
            // Get all checkboxes with the name "specialties"
            const checkboxes = document.querySelectorAll('input[name="specialties"]');
    
            // Loop through each checkbox and add its value if it is checked
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    updatedSpecialties.push(checkbox.value);
                }
            });
    
            return {
                ...prevState,
                specialties: updatedSpecialties
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            specialties: formData.specialties.join(",") // Convert array to comma-separated string
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
            specialties: [],
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
                    <option value="onleave">On Leave</option>
                    <option value="resigned">Resigned</option>
                    <option value="suspend">Suspend</option>
                </FormControl>
            </FormGroup>
            <FormGroup>
                <FormLabel>Specialties</FormLabel>
                <div className="checkbox-container">
                <Container>
                    <Row>
                        <Col xs={4}>
                            <Form.Check
                                type="checkbox"
                                label="Piano"
                                name="specialties"
                                value="piano"
                                checked={formData.specialties.includes("piano")}
                                onChange={handleSpecialtiesChange}
                            />
                        </Col>
                        <Col xs={4}>
                            <Form.Check
                                type="checkbox"
                                label="Voice"
                                name="specialties"
                                value="voice"
                                checked={formData.specialties.includes("voice")}
                                onChange={handleSpecialtiesChange}
                            />
                        </Col>
                        <Col xs={4}>
                            <Form.Check
                                type="checkbox"
                                label="Violin"
                                name="specialties"
                                value="violin"
                                checked={formData.specialties.includes("violin")}
                                onChange={handleSpecialtiesChange}
                            />
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col xs={4}>
                            <Form.Check
                                type="checkbox"
                                label="Drum"
                                name="specialties"
                                value="drum"
                                checked={formData.specialties.includes("drum")}
                                onChange={handleSpecialtiesChange}
                            />
                        </Col>
                        <Col xs={4}>
                            <Form.Check
                                type="checkbox"
                                label="Guitar"
                                name="specialties"
                                value="guitar"
                                checked={formData.specialties.includes("guitar")}
                                onChange={handleSpecialtiesChange}
                            />
                        </Col>
                        <Col xs={4}>
                            <Form.Check
                                type="checkbox"
                                label="Flute/Saxophone/Clarinet"
                                name="specialties"
                                value="flute-saxophone-clarinet"
                                checked={formData.specialties.includes("flute-saxophone-clarinet")}
                                onChange={handleSpecialtiesChange}
                            />
                        </Col>
                    </Row>
                </Container>
                </div>
            </FormGroup>
            <div style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
                <Button type="submit" variant="primary" style={{ width: "150px" }}>
                    {editingTeacher ? "Update Teacher" : "Add Teacher"}
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    style={{ width: "150px" }}
                    onClick={() => {
                        setEditingTeacher(null);
                        setShowModal(false);
                    }}
                >
                    Cancel
                </Button>
            </div>
        </Form>
    );
}

export default Teacher;
