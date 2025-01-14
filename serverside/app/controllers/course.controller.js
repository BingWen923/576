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

////////////////////////// add course or courses with teachers and students ////////////////////////
exports.addNewCourse = (req, res) => {
    const newCourse = req.body;
    
    if (newCourse.rec_period && newCourse.rec_period !== "0") {
        CCourse.addRecurringCourses_(newCourse, (err, result1) => {
            if (err) {
                console.error("Error in addRecurringCourses_:", err.message || err);
                return res.status(500).json({
                    message: "Error occurred while adding new courses",
                    error: err.message || "Unknown error"
                });
            }
            return res.status(200).json(result1);
        });
    } else {
        CCourse.addSingleCourse_(newCourse, (err, result) => {
            if (err) {
                console.error("Error in addSingleCourse_:", err.message || err);
                return res.status(500).json({
                    message: "Error occurred while adding a new course",
                    error: err.message || "Unknown error"
                });
            }
            return res.status(200).json(result);
        });
    }
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

exports.deleteCourseById = (req, res) => {
    CCourse.deleteCourseById_(req.params.id, (err, course) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while deleting the course",
                error: err
            });
        } else {
            res.status(200).json(course);
        }
    });
};

/*
// Set students to a course
exports.setStudentsToCourse = (req, res) => {
    const { students } = req.body;
    CCourse.setStudentsToCourse_(req.params.courseid, students, (err, data) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while set the list of students to course",
                error: err
            });
        } else {
            res.status(200).json(data);
        }
    });
};
*/

/* no longer needed
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
    const { courseid, studentid } = req.body;

    CCourse.removeStudentFromCourse_(courseid, studentid, (err, data) => {
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
*/

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
/*
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
    const { courseid, teacherid } = req.body;

    CCourse.removeTeacherFromCourse_(courseid, teacherid, (err, data) => {
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
*/

/*
// Set teachers to a course
exports.setTeachersToCourse = (req, res) => {
    const { teachers } = req.body;
    CCourse.setTeachersToCourse_(req.params.courseid, teachers, (err, data) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while set the list of teachers to course",
                error: err
            });
        } else {
            res.status(200).json(data);
        }
    });
};
*/

// Get all teachers in a course
exports.getAllTeachersFromCourse = (req, res) => {
    CCourse.getAllTeachersFromCourse_(req.params.courseid, (err, teachers) => {
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

// Get all courses of a specified teacher
exports.getAllCoursesFromTeacher = (req, res) => {
    CCourse.getAllCoursesFromTeacher_(req.params.teacherid, (err, courses) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while retrieving courses for teacher: " + req.params.teacherid,
                error: err
            });
        } else {
            res.status(200).json(courses);
        }
    });
};

// Get all courses of a specified student
exports.getAllCoursesFromStudent = (req, res) => {
    CCourse.getAllCoursesFromStudent_(req.params.studentid, (err, courses) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while retrieving courses for student: " + req.params.studentid,
                error: err
            });
        } else {
            res.status(200).json(courses);
        }
    });
};