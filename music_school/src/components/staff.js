import React, { useState, useEffect } from 'react';
import './staff.css';
import { Container, Row, Col, Button, Table, Modal, Form, FormGroup, FormLabel, FormControl } from 'react-bootstrap';

// Main Staff Component
function Staff() {
    const [staffList, setStaffList] = useState([]);
    const [editingStaff, setEditingStaff] = useState(null);
    const [showModal, setShowModal] = useState(false); // State to control the visibility of the Modal

    // Function to fetch and refresh the staff list
    const fetchStaffList = () => {
        console.log('Fetching staff list...');
        fetch("http://localhost:3000/staff")
            .then(response => response.json())
            .then(data => setStaffList(data))
            .catch(error => console.error("Error fetching staff data:", error));
    };

    useEffect(() => {
        // Fetch staff list on the first component load
        fetchStaffList();
    }, []);

    // Function to handle adding or updating staff information
    const handleAddOrUpdateStaff = (newOrUpdatedStaff) => {
        if (editingStaff) {
             // Update existing staff
            fetch(`http://localhost:3000/staff/${editingStaff.staff_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newOrUpdatedStaff)
            }).then(response => {
                if (response.ok) {
                    // Refresh the staff list
                    fetchStaffList();
                    setEditingStaff(null);
                    setShowModal(false); // Close the modal
                }
            });
        } else {
            // Add new staff
            fetch("http://localhost:3000/staff", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newOrUpdatedStaff)
            }).then(response => {
                if (response.ok) {
                    // Refresh the staff list
                    fetchStaffList();
                    setShowModal(false); // Close the modal
                }
            });
        }
    };

    // Function to handle editing staff (opens the modal)
    const handleEditClick = (staff) => {
        setEditingStaff(staff);
        setShowModal(true); // Open the modal
    };

    // Function to handle adding new staff (opens the modal)
    const handleAddClick = () => {
        setEditingStaff(null); // Clear the form for a new staff entry
        setShowModal(true); // Open the modal
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <h3>Staff List</h3>
                    <Button variant="primary" onClick={handleAddClick}>
                        Add New Staff
                    </Button>
                    <StaffList staffList={staffList} onEditClick={handleEditClick} />
                </Col>
            </Row>
            {/* Modal for adding or editing staff */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingStaff ? "Edit Staff" : "Add New Staff"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <StaffForm
                        onSubmit={handleAddOrUpdateStaff}
                        editingStaff={editingStaff}
                        setEditingStaff={setEditingStaff}
                        setShowModal={setShowModal}
                    />
                </Modal.Body>
            </Modal>
        </Container>
    );
}

/********************************** Staff List Component *****************************/
function StaffList({ staffList, onEditClick }) {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Title</th>
                    <th>Date Of Hire</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {staffList.map(staff => (
                    <tr key={staff.staff_id}>
                        <td>{staff.name}</td>
                        <td>{staff.phone}</td>
                        <td>{staff.email}</td>
                        <td>{staff.status}</td>
                        <td>{staff.title}</td>
                        <td>{formatDate(staff.dateofhire)}</td>
                        <td>
                            <Button
                                variant="primary"
                                onClick={() => onEditClick(staff)}
                            >
                                Edit
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

/********************** add/edit Staff Form Component **********************/
function StaffForm({ onSubmit, editingStaff, setEditingStaff, setShowModal }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        memo: "",
        status: "active",
        dateofhire: "",
        title: ""
    });

    useEffect(() => {
        if (editingStaff) {
            // Format the date to YYYY-MM-DD
            const localDate = editingStaff.dateofhire
                ? new Date(editingStaff.dateofhire).toLocaleDateString('en-CA') // 'en-CA' formats to YYYY-MM-DD
                : "";

            setFormData({
                ...editingStaff,
                dateofhire: localDate
            });
        } else {
            resetForm();
        }
    }, [editingStaff]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            phone: "",
            email: "",
            address: "",
            memo: "",
            status: "active",
            dateofhire: "",
            title: ""
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
                </FormControl>
            </FormGroup>
            <FormGroup>
                <FormLabel>Date Of Hire</FormLabel>
                <FormControl
                    type="date"
                    name="dateofhire"
                    value={formData.dateofhire}
                    onChange={handleChange}                    
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Title</FormLabel>
                <FormControl
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                />
            </FormGroup>
            <Button type="submit" variant="primary">
                {editingStaff ? "Update Staff" : "Add Staff"}
            </Button>
            <Button
                type="button"
                variant="secondary"
                className="ml-2"
                onClick={() => {
                    setEditingStaff(null);
                    setShowModal(false);
                }}
            >
                Cancel
            </Button>
        </Form>
    );
}

export default Staff;
