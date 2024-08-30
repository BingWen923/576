import React, { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import './list_and_form.css';
import { renderSortCaret,formatDateTime } from './lib';
import { Row, Col, Button, FormGroup, FormControl } from 'react-bootstrap';

/********************************** Course List Component *****************************/
function CourseList({ courseList, onEditClick, onDeleteClick, add1Course, addRecurringCourses }) {
    const [searchTerm, setSearchTerm] = useState('');

    // search/filter
    const filteredCourseList = courseList.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.coursetype.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.starttime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.endtime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.classroom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Define the columns with sorting, formatting, and custom header with icons
    const columns = [
        {
            dataField: 'name',
            text: 'Name',
            sort: true,
            headerClasses: 'sortable-header',
            sortCaret: renderSortCaret
        },
        {
            dataField: 'groupprivate',
            text: 'Group/Private',
            sort: false,
            headerClasses: 'non-sortable-header'
        },
        {
            dataField: 'coursetype',
            text: 'Course Type',
            sort: false,
            headerClasses: 'non-sortable-header'
        },
        {
            dataField: 'starttime',
            text: 'Start Time',
            sort: true,
            headerClasses: 'sortable-header',
            formatter: (cell) => formatDateTime(cell),
            sortCaret: renderSortCaret
        },
        {
            dataField: 'endtime',
            text: 'End Time',
            sort: true,
            headerClasses: 'sortable-header',
            formatter: (cell) => formatDateTime(cell),
            sortCaret: renderSortCaret
        },
        {
            dataField: 'status',
            text: 'Status',
            sort: true,
            headerClasses: 'sortable-header',
            sortCaret: renderSortCaret
        },
        {
            dataField: 'classroom',
            text: 'Classroom',
            sort: true,
            headerClasses: 'sortable-header',
            sortCaret: renderSortCaret
        },
        {
            dataField: 'actions',
            text: 'Actions',
            isDummyField: true,
            headerClasses: 'non-sortable-header',
            formatter: (cell, row) => (
                <div>
                    <Button variant="primary" onClick={() => onEditClick(row)} style={{ marginRight: '5px' }}>
                        Edit
                    </Button>
                    <Button variant="danger" onClick={() => onDeleteClick(row)}>
                        Delete
                    </Button>
                </div>
            )
        }
    ];
console.log(courseList);
    return (
        <>
            <Row className="mb-3 align-items-center justify-content-between">
                <Col xs="auto">
                    <Button variant="primary"  className="me-3" onClick={add1Course}>
                        + Add Course
                    </Button>
                    <Button variant="primary" onClick={addRecurringCourses}>
                        + Add Recurring Courses
                    </Button>
                </Col>
                <Col xs="auto">
                    <FormGroup>
                        <FormControl
                            placeholder="Search course..."
                            aria-label="Search course"
                            aria-describedby="basic-addon1"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </FormGroup>
                </Col>
            </Row>

            <BootstrapTable
                keyField="course_id"
                data={filteredCourseList}
                columns={columns}
                pagination={paginationFactory()}
                striped
                hover
                condensed
            />
        </>
    );
}

export default CourseList;