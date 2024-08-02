const CTeacher = require("../models/teacher.model");

exports.getAllTeachers = (req, res) => {
    CTeacher.getAllTeachers_((err, teachers) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while retrieving all teachers",
                error: err
            });
        } else {
            // if no problem then send back all teachers
            res.status(200).json(teachers);
        }
    });
};

exports.getTeacherByString = (req, res) => {
    CTeacher.getTeacherByString_(req.params.searchstring,(err,teachers) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while retrieving teachers by search string",
                error: err
            });
        } else {
            // if no problem then send back searched teachers
            res.status(200).json(teachers);
        }
    });
};

exports.getTeacherById = (req, res) => {
    CTeacher.getTeacherById_(req.params.id,(err,teacher) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while retrieving teacher by id",
                error: err
            });
        } else {
            // if no problem then send back the teacher
            res.status(200).json(teacher);
        }
    });
};


exports.addNewTeacher = (req, res) => {
    CTeacher.addNewTeacher_(req.body,(err,teacher) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while add a new teacher",
                error: err
            });
        } else {
            res.status(200).json(teacher);
        }
    });
};

exports.updateTeacherById = (req, res) => {
    CTeacher.updateTeacherById_(req.params.id,req.body,(err,teacher) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while updating the teacher",
                error: err
            });
        } else {
             res.status(200).json(teacher);
        }
    });
};


/*

exports.DeleteItemBy_Id = (req, res) => {
    Project.deleteItemById(req.params.id,(err,item) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while deleting item",
                error: err
            });
        } else {
            res.status(200).json(item);
        }
    });
};

exports.DeleteAll = (req, res) => {
    Project.DeleteAllItems((err,item) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while deleting all items",
                error: err
            });
        } else {
            res.status(200).json(item);
        }
    });
};
*/