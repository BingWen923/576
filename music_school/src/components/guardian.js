import React, { useState, useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { API_BASE_URL, renderSortCaret } from './lib';
import './list_and_form.css';
import { Container, Row, Col, Button, Modal, Form, FormGroup, FormLabel, FormControl } from 'react-bootstrap';

// Main Guardian Component
function Guardian() {
    const [guardianList, setGuardianList] = useState([]);
    const [editingGuardian, setEditingGuardian] = useState(null);
    const [showModal, setShowModal] = useState(false); // State to control the visibility of the Modal

    // Function to fetch and refresh the guardian list
    const fetchGuardianList = () => {
        console.log('Fetching guardian list...');
        fetch(`${API_BASE_URL}/guardian`)
            .then(response => response.json())
            .then(data => setGuardianList(data))
            .catch(error => console.error("Error fetching guardian data:", error));
    };

    useEffect(() => {
        // Fetch guardian list on the first component load
        fetchGuardianList();
    }, []);

    // Function to handle adding or updating guardian information
    const handleAddOrUpdateGuardian = (newOrUpdatedGuardian) => {
        if (editingGuardian) {
            // Update existing guardian
            fetch(`${API_BASE_URL}/guardian/${editingGuardian.guardian_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newOrUpdatedGuardian)
            }).then(response => {
                if (response.ok) {
                    // Refresh the guardian list
                    fetchGuardianList();
                    setEditingGuardian(null);
                    setShowModal(false); // Close the modal
                }
            });
        } else {
            // Add new guardian
            fetch(`${API_BASE_URL}/guardian`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newOrUpdatedGuardian)
            }).then(response => {
                if (response.ok) {
                    // Refresh the guardian list
                    fetchGuardianList();
                    setShowModal(false); // Close the modal
                }
            });
        }
    };

    // Function to handle editing guardian (opens the modal)
    const handleEditClick = (guardian) => {
        setEditingGuardian(guardian);
        setShowModal(true); // Open the modal
    };

    // Function to handle adding new guardian (opens the modal)
    const handleAddClick = () => {
        setEditingGuardian(null); // Clear the form for a new guardian entry
        setShowModal(true); // Open the modal
    };

    return (
        <Container className="mt-3">
            <Row>
                <Col>
                    <h3>Guardian List</h3>
                   <GuardianList 
                       guardianList={guardianList} 
                       onEditClick={handleEditClick}
                       addNewGuardian={handleAddClick}
                    />
                </Col>
            </Row>
            {/* Modal for adding or editing guardian */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingGuardian ? "Edit Guardian" : "Add New Guardian"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <GuardianForm
                        onSubmit={handleAddOrUpdateGuardian}
                        editingGuardian={editingGuardian}
                        setEditingGuardian={setEditingGuardian}
                        setShowModal={setShowModal}
                    />
                </Modal.Body>
            </Modal>
        </Container>
    );
}

/********************************** Guardian List Component *****************************/
function GuardianList({ guardianList, onEditClick, addNewGuardian }) {
    const [searchTerm, setSearchTerm] = useState('');

    // search/filter
    const filteredGuardianList = guardianList.filter(guardian =>
        guardian.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guardian.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guardian.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guardian.guardianrelation.toLowerCase().includes(searchTerm.toLowerCase())
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
            dataField: 'guardianrelation',
            text: 'Guardian Relation',
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
                    <Button variant="primary" onClick={addNewGuardian}>
                        + Add New Guardian
                    </Button>
                </Col>
                <Col xs="auto">
                    <FormGroup>
                        <FormControl
                            placeholder="Search guardian..."
                            aria-label="Search guardian"
                            aria-describedby="basic-addon1"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </FormGroup>
                </Col>
            </Row>

            <BootstrapTable
                keyField="guardian_id"
                data={filteredGuardianList}
                columns={columns}
                pagination={paginationFactory()}
                striped
                hover
                condensed
            />
        </>
    );
}

/********************** add/edit Guardian Form Component **********************/
function GuardianForm({ onSubmit, editingGuardian, setEditingGuardian, setShowModal }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        memo: "",
        status: "normal",
        guardianrelation: "",
    });

    useEffect(() => {
        if (editingGuardian) {
            setFormData(editingGuardian);
        } else {
            resetForm();
        }
    }, [editingGuardian]);

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
            status: "normal",
            guardianrelation: "",
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
                <FormLabel>Guardian Relation</FormLabel>
                <FormControl
                    as="select"
                    name="guardianrelation"
                    value={formData.guardianrelation}
                    onChange={handleChange}
                >
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="grandparents">Grandparents</option>
                    <option value="legalguardian">Legal guardian</option>
                </FormControl>
            </FormGroup>
            <div style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
                <Button type="submit" variant="primary" style={{ width: "180px" }}>
                    {editingGuardian ? "Update Guardian" : "Add Guardian"}
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    style={{ width: "180px" }}
                    onClick={() => {
                        setEditingGuardian(null);
                        setShowModal(false);
                    }}
                >
                    Cancel
                </Button>
            </div>
        </Form>
    );
}

export default Guardian;
