const CStudent = require("../models/student.model");

exports.getAllStudents = (req, res) => {
    CStudent.getAllStudents_((err, students) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while retrieving all students",
                error: err
            });
        } else {
            // if no problem then send back all students
            res.status(200).json(students);
        }
    });
};

exports.getStudentByString = (req, res) => {
    CStudent.getStudentByString_(req.params.searchstring, (err, students) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while retrieving students by search string",
                error: err
            });
        } else {
            // if no problem then send back searched students
            res.status(200).json(students);
        }
    });
};

exports.getStudentById = (req, res) => {
    CStudent.getStudentById_(req.params.id, (err, student) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while retrieving student by id",
                error: err
            });
        } else {
            // if no problem then send back the student
            res.status(200).json(student);
        }
    });
};

exports.addNewStudent = (req, res) => {
    CStudent.addNewStudent_(req.body, (err, student) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while adding a new student",
                error: err
            });
        } else {
            res.status(200).json(student);
        }
    });
};

exports.updateStudentById = (req, res) => {
    CStudent.updateStudentById_(req.params.id, req.body, (err, student) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while updating the student",
                error: err
            });
        } else {
            res.status(200).json(student);
        }
    });
};

exports.setStudentGuardianById = (req, res) => {
    CStudent.setStudentGuardianById_(req.params.id, req.body, (err, student) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while set guardian to the student",
                error: err
            });
        } else {
            res.status(200).json(student);
        }
    });
};