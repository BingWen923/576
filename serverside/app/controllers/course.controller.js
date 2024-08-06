const CCourse = require("../models/course.model");

exports.getAllCourses = (req, res) => {
    CCourse.getAllCourses_((err, courses) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while retrieving all courses",
                error: err
            });
        } else {
            res.status(200).json(courses);
        }
    });
};

exports.getCourseById = (req, res) => {
    CCourse.getCourseById_(req.params.id, (err, course) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while retrieving course by id",
                error: err
            });
        } else {
            res.status(200).json(course);
        }
    });
};

exports.getCoursesByConditions = (req, res) => {
   const { Name, CourseType, StartTime, endTime, ClassRoom } = req.query;
   CCourse.getCoursesByConditions_(Name, CourseType, StartTime, endTime, ClassRoom, (err, courses) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while retrieving courses by conditions",
                error: err
            });
        } else {
            res.status(200).json(courses);
        }
    });
};

exports.addNewCourse = (req, res) => {
    CCourse.addNewCourse_(req.body, (err, course) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while adding a new course",
                error: err
            });
        } else {
            res.status(200).json(course);
        }
    });
};

exports.updateCourseById = (req, res) => {
    CCourse.updateCourseById_(req.params.id, req.body, (err, course) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while updating the course",
                error: err
            });
        } else {
            res.status(200).json(course);
        }
    });
};

// Add a student to a course
exports.addStudentToCourse = (req, res) => {
    CCourse.addStudentToCourse_(req.body, (err, data) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while adding student to course",
                error: err
            });
        } else {
            res.status(200).json(data);
        }
    });
};

// Remove a student from a course
exports.removeStudentFromCourse = (req, res) => {
    const { CourseID, StudentID } = req.body;

    CCourse.removeStudentFromCourse_(CourseID, StudentID, (err, data) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while removing student from course",
                error: err
            });
        } else {
            res.status(200).json(data);
        }
    });
};

 // get all students in a course
 exports.getAllStudentFromCourse = (req, res) => {
    CCourse.getAllStudentFromCourse_(req.params.courseid, (err, students) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while retrieving all students in a course",
                error: err
            });
        } else {
            res.status(200).json(students);
        }
    });
};

// Add a teacher to a course
exports.addTeacherToCourse = (req, res) => {
    CCourse.addTeacherToCourse_(req.body, (err, data) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while adding teacher to course",
                error: err
            });
        } else {
            res.status(200).json(data);
        }
    });
};

// Remove a teacher from a course
exports.removeTeacherFromCourse = (req, res) => {
    const { CourseID, TeacherID } = req.body;

    CCourse.removeTeacherFromCourse_(CourseID, TeacherID, (err, data) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while removing teacher from course",
                error: err
            });
        } else {
            res.status(200).json(data);
        }
    });
};

// Get all teachers in a course
exports.getAllTeachersFromCourse = (req, res) => {
    CCourse.getAllTeachersFromCourse_(req.params.courseID, (err, teachers) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while retrieving all teachers in a course",
                error: err
            });
        } else {
            res.status(200).json(teachers);
        }
    });
};