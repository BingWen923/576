import React, { useState, useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
//import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import './list_and_form.css';
import { Container, Row, Col, Button, Modal, Form, FormGroup, FormLabel, FormControl } from 'react-bootstrap';

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
                   <StaffList 
                       staffList={staffList} 
                       onEditClick={handleEditClick}
                       addNewStaff = {handleAddClick}
                    />
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
function StaffList({ staffList, onEditClick, addNewStaff }) {
    const [searchTerm, setSearchTerm] = useState('');

    // search/filter
    const filteredStaffList = staffList.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Define the columns with sorting and formatting options
    const columns = [
        {
            dataField: 'name',
            text: 'Name',
            sort: true
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
            sort: true
        },
        {
            dataField: 'title',
            text: 'Title',
            sort: true
        },
        {
            dataField: 'dateofhire',
            text: 'Date Of Hire',
            sort: true,
            formatter: (cell) => new Date(cell).toLocaleDateString() // Formatting date
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
                    <Button variant="primary" onClick={addNewStaff}>
                        + Add New Staff
                    </Button>
                </Col>
                <Col xs="auto">
                    <FormGroup>
                        <FormControl
                            placeholder="Search staff..."
                            aria-label="Search staff"
                            aria-describedby="basic-addon1"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </FormGroup>
                </Col>
            </Row>

            {/* 表格 */}
            <BootstrapTable
                keyField="staff_id"
                data={filteredStaffList}
                columns={columns}
                pagination={paginationFactory()}
                striped
                hover
                condensed
            />
        </>
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
        dateofhire:  new Date().toISOString().split('T')[0], // set default to today 
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
            dateofhire: new Date().toISOString().split('T')[0], // set default to today 
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
                    <option value="onleave">On Leave</option>
                    <option value="resigned">Resigned</option>
                    <option value="suspend">Suspend</option>
                    <option value="retired">Retired</option>
                    <option value="probation">Probation</option>
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
            <div style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
                <Button type="submit" variant="primary" style={{ width: "150px" }}>
                    {editingStaff ? "Update Staff" : "Add Staff"}
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    style={{ width: "150px" }}
                    onClick={() => {
                        setEditingStaff(null);
                        setShowModal(false);
                    }}
                >
                    Cancel
                </Button>
            </div>
        </Form>
    );
}

export default Staff;
