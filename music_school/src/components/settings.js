import React, { useState, useEffect } from 'react';

//import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { API_BASE_URL } from './lib';
import './list_and_form.css';
import { Container, Form, Button, FormControl } from 'react-bootstrap';

// Main Settings Component
function Settings() {
    const [settingsObj, setSettingsObj] = useState([]);


    // Function to fetch and refresh the staff list
    const fetchSettings = () => {
        console.log('Fetching settings...');
        fetch(`${API_BASE_URL}/settings`)
            .then(response => response.json())
            .then(data => setSettingsObj(data))
            .catch(error => console.error("Error fetching settings data:", error));
    };

    useEffect(() => {
        // Fetch staff list on the first component load
        fetchSettings();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Update settings
        fetch(`${API_BASE_URL}/settings/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(settingsObj)
        }).then(response => {
            if (response.ok) {
                window.alert("Settings are succussfully updated");
            }
        });
    };

    const handleChange = (e) => {
        setSettingsObj({
            ...settingsObj,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Container className="mt-3">
            <Form onSubmit={handleSubmit}>
                <table>
                    <tr>
                        <td>
                            <h3>Application Settings</h3>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td style={{ textAlign: "right" }}>
                            <Button type="submit" variant="primary" style={{ width: "240px" }}>
                                Confirm to change settings
                            </Button>
                        </td>
                    </tr>
                    <tr>&nbsp;</tr>
                    <tr>
                        <td style={{ width: "300px" }}>
                            Auto complete courses
                        </td>
                        <td>
                            <FormControl
                                as="select"
                                name="auto_course_complete"
                                value={settingsObj.auto_course_complete}
                                onChange={handleChange}
                            >
                                <option value="on">On</option>
                                <option value="off">Off</option>
                            </FormControl>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Auto email timetable to teacher
                        </td>
                        <td>
                            <FormControl
                                as="select"
                                name="auto_email_teacher"
                                value={settingsObj.auto_email_teacher}
                                onChange={handleChange}
                            >
                                <option value="weekly">weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="off">Off</option>
                            </FormControl>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Auto email timetable to student
                        </td>
                        <td>
                            <FormControl
                                as="select"
                                name="auto_email_student"
                                value={settingsObj.auto_email_student}
                                onChange={handleChange}
                            >
                                <option value="weekly">weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="off">Off</option>
                            </FormControl>
                        </td>
                    </tr>
                </table>
            </Form>
        </Container>
    );
}

export default Settings;
