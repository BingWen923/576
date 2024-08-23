
const db = require("./db");

// This module is used to handle all valid courses.
// Valid courses do not include courses that have been deleted or completed.

const CCourse = function(course) {
  this.course_id = course.course_id;
  this.name = course.name;
  this.groupprivate = course.groupprivate;
  this.coursetype = course.coursetype;
  this.starttime = course.starttime;
  this.endtime = course.endtime;
  this.status = course.status;
  this.classroom = course.classroom;
  this.memo = course.memo;
};

// Show all valid courses. 
CCourse.getAllCourses_ = result => {
  db.query("SELECT * FROM view_course", (err, res) => {
    if (err) {
      console.log("get all courses error:", err);
      result(null, err);
      return;
    }
    console.log("get all courses:", res);
    result(null, res);
  });
};

// Get courses based on combined conditions. The combined conditions include:
// courseName, courseType, courses within a certain time period (startTime, endTime), classroom
CCourse.getCoursesByConditions_ = (courseName, courseType, startTime, endTime, classroom, result) => {
  // Construct the query with optional conditions
  let query = "SELECT * FROM view_course WHERE 1=1";
  let queryParams = [];

  if (courseName) {
    query += " AND name LIKE ?";
    queryParams.push(`%${courseName}%`);
  }
  if (courseType) {
    query += " AND coursetype = ?";
    queryParams.push(courseType);
  }
  if (startTime && endTime) {
    query += " AND starttime BETWEEN ? AND ?";
    queryParams.push(startTime, endTime);
  }
  if (classroom) {
    query += " AND classroom = ?";
    queryParams.push(classroom);
  }

  db.query(query, queryParams, (err, res) => {
    if (err) {
      console.log("get courses by conditions error:", err);
      result(null, err);
      return;
    }
    console.log("get courses by conditions:", res);
    result(null, res);
  });
};

// Get course by id
CCourse.getCourseById_ = (courseId, result) => {
  db.query("SELECT * FROM TbCourse WHERE course_id = ?", [courseId], (err, res) => {
    if (err) {
      console.log("get course by id error:", err);
      result(null, err);
      return;
    }
    console.log("get course by id", res);
    result(null, res);
  });
};

// Add new course
CCourse.addNewCourse_ = (newCourse, result) => {
  const courseData = {
    name: newCourse.name,
    groupprivate: newCourse.groupprivate,
    coursetype: newCourse.coursetype,
    starttime: newCourse.starttime,
    endtime: newCourse.endtime,
    status: newCourse.status,
    classroom: newCourse.classroom,
    memo: newCourse.memo
  };

  db.query("INSERT INTO TbCourse SET ?", courseData, (err, res) => {
    if (err) {
      console.log("Add new course error:", err);
      result(err, null);
      return;
    }
    console.log("New course added:", res);
    result(null, res);
  });
};

// Update course by id
CCourse.updateCourseById_ = (courseId, updateCourse, result) => {
  console.log(JSON.stringify(updateCourse), '----------update---------------');

  const updateCourseData = {
    name: updateCourse.name,
    groupprivate: updateCourse.groupprivate,
    coursetype: updateCourse.coursetype,
    starttime: updateCourse.starttime,
    endtime: updateCourse.endtime,
    status: updateCourse.status,
    classroom: updateCourse.classroom,
    memo: updateCourse.memo
  };

  db.query("UPDATE TbCourse SET ? WHERE course_id = ?", [updateCourseData, courseId], (err, res) => {
    if (err) {
      console.log("Update course error:", err);
      result(err, null);
      return;
    }
    console.log("Course updated:", res);
    result(null, res);
  });
};

/************************************* teachers in a course ***********************************/
// Add a teacher to a course
CCourse.addTeacherToCourse_ = (newCourseTeacher, result) => {
  const courseTeacherData = {
    courseid: newCourseTeacher.courseid,
    teacherid: newCourseTeacher.teacherid
  };

  db.query("INSERT INTO TbCourseTeacher SET ?", courseTeacherData, (err, res) => {
    if (err) {
      console.log("Error adding teacher to course:", err);
      result(err, null);
      return;
    }
    console.log("Teacher added to course:", res);
    result(null, res);
  });
};

// Remove a teacher from a course
CCourse.removeTeacherFromCourse_ = (courseID, teacherID, result) => {
  db.query("DELETE FROM TbCourseTeacher WHERE courseid = ? AND teacherid = ?", [courseID, teacherID], (err, res) => {
    if (err) {
      console.log("Error removing teacher from course:", err);
      result(err, null);
      return;
    }
    console.log("Teacher removed from course:", res);
    result(null, res);
  });
};

/************************************* students in a course ***********************************/
// Add a student to a course
CCourse.addStudentToCourse_ = (newCourseStudent, result) => {
  const courseStudentData = {
    courseid: newCourseStudent.courseid,
    studentid: newCourseStudent.studentid
  };

  db.query("INSERT INTO TbCourseStudent SET ?", courseStudentData, (err, res) => {
    if (err) {
      console.log("Error adding student to course:", err);
      result(err, null);
      return;
    }
    console.log("Student added to course:", res);
    result(null, res);
  });
};

// Remove a student from a course
CCourse.removeStudentFromCourse_ = (courseID, studentID, result) => {
  db.query("DELETE FROM TbCourseStudent WHERE courseid = ? AND studentid = ?", [courseID, studentID], (err, res) => {
    if (err) {
      console.log("Error removing student from course:", err);
      result(err, null);
      return;
    }
    console.log("Student removed from course:", res);
    result(null, res);
  });
};

// Get all students in a course
CCourse.getAllStudentFromCourse_ = (courseID, result) => {
  const query = `
    SELECT s.*, u.*
    FROM TbStudent s
    JOIN TbCourseStudent cs ON s.student_id = cs.studentid
    JOIN TbUser u ON s.userid = u.user_id
    WHERE cs.courseid = ?
  `;
  db.query(query, [courseID], (err, res) => {
    if (err) {
      console.log("Error retrieving students from course:", err);
      result(err, null);
      return;
    }
    console.log("Students retrieved from course:", res);
    result(null, res);
  });
};

/************************************* teachers in a course ***********************************/
// Add a teacher to a course
CCourse.addTeacherToCourse_ = (newCourseTeacher, result) => {
  const courseTeacherData = {
    courseid: newCourseTeacher.courseid,
    teacherid: newCourseTeacher.teacherid
  };

  db.query("INSERT INTO TbCourseTeacher SET ?", courseTeacherData, (err, res) => {
    if (err) {
      console.log("Error adding teacher to course:", err);
      result(err, null);
      return;
    }
    console.log("Teacher added to course:", res);
    result(null, res);
  });
};

// Remove a teacher from a course
CCourse.removeTeacherFromCourse_ = (courseID, teacherID, result) => {
  db.query("DELETE FROM TbCourseTeacher WHERE courseid = ? AND teacherid = ?", [courseID, teacherID], (err, res) => {
    if (err) {
      console.log("Error removing teacher from course:", err);
      result(err, null);
      return;
    }
    console.log("Teacher removed from course:", res);
    result(null, res);
  });
};

// Get all teachers in a course
CCourse.getAllTeachersFromCourse_ = (courseID, result) => {
  const query = `
    SELECT t.*, u.*
    FROM TbTeacher t
    JOIN TbCourseTeacher ct ON t.teacher_id = ct.teacherid
    JOIN TbUser u ON t.userid = u.user_id
    WHERE ct.courseid = ?
  `;
  db.query(query, [courseID], (err, res) => {
    if (err) {
      console.log("Error retrieving teachers from course:", err);
      result(err, null);
      return;
    }
    console.log("Teachers retrieved from course:", res);
    result(null, res);
  });
};

module.exports = CCourse;
