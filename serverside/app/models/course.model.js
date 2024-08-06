
const db = require("./db");

// This module is used to handle all valid courses.
// Valid courses do not include courses that have been deleted or completed.
/*
CREATE VIEW view_course AS
SELECT * 
FROM TbCourse 
WHERE status NOT LIKE '%completed%' 
AND status NOT LIKE '%deleted%';
*/
const CCourse = function(course) {
  this.course_id = course.course_id;
  this.Name = course.Name;
  this.GroupPrivate = course.GroupPrivate;
  this.CourseType = course.CourseType;
  this.StartTime = course.StartTime;
  this.endTime = course.endTime;
  this.Status = course.Status;
  this.ClassRoom = course.ClassRoom;
  this.Memo = course.Memo;
};

// Show all valid courses. 
CCourse.getAllCourses_ = result => {
  db.query("SELECT * FROM view_course ", (err, res) => {
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
// courseName, courseType, courses within a certain time period(startTime, endTime), classroom
CCourse.getCoursesByConditions_ = (courseName, courseType, startTime, endTime, classroom, result) => {
  // Construct the query with optional conditions
  let query = "SELECT * FROM view_course WHERE 1=1";
  let queryParams = [];

  if (courseName) {
    query += " AND Name LIKE ?";
    queryParams.push(`%${courseName}%`);
  }
  if (courseType) {
    query += " AND CourseType = ?";
    queryParams.push(courseType);
  }
  if (startTime && endTime) {
    query += " AND StartTime BETWEEN ? AND ?";
    queryParams.push(startTime, endTime);
  }
  if (classroom) {
    query += " AND ClassRoom = ?";
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
    Name: newCourse.Name,
    GroupPrivate: newCourse.GroupPrivate,
    CourseType: newCourse.CourseType,
    StartTime: newCourse.StartTime,
    endTime: newCourse.endTime,
    Status: newCourse.Status,
    ClassRoom: newCourse.ClassRoom,
    Memo: newCourse.Memo
  };

  db.query("INSERT INTO TbCourse SET ?", courseData, (err, res) => {
    if (err) {
      console.log("Add new course Error:", err);
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
    Name: updateCourse.Name,
    GroupPrivate: updateCourse.GroupPrivate,
    CourseType: updateCourse.CourseType,
    StartTime: updateCourse.StartTime,
    endTime: updateCourse.endTime,
    Status: updateCourse.Status,
    ClassRoom: updateCourse.ClassRoom,
    Memo: updateCourse.Memo
  };

  db.query("UPDATE TbCourse SET ? WHERE course_id = ?", [updateCourseData, courseId], (err, res) => {
    if (err) {
      console.log("Update course Error:", err);
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
    CourseID: newCourseTeacher.CourseID,
    TeacherID: newCourseTeacher.TeacherID
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
  db.query("DELETE FROM TbCourseTeacher WHERE CourseID = ? AND TeacherID = ?", [courseID, teacherID], (err, res) => {
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
    CourseID: newCourseStudent.CourseID,
    StudentID: newCourseStudent.StudentID
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
  db.query("DELETE FROM TbCourseStudent WHERE CourseID = ? AND StudentID = ?", [courseID, studentID], (err, res) => {
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
    JOIN TbCourseStudent cs ON s.student_id = cs.StudentID
    JOIN TbUser u ON s.UserId = u.user_id
    WHERE cs.CourseID = ?
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
    CourseID: newCourseTeacher.CourseID,
    TeacherID: newCourseTeacher.TeacherID
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
  db.query("DELETE FROM TbCourseTeacher WHERE CourseID = ? AND TeacherID = ?", [courseID, teacherID], (err, res) => {
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
    JOIN TbCourseTeacher ct ON t.teacher_id = ct.TeacherID
    JOIN TbUser u ON t.UserId = u.user_id
    WHERE ct.CourseID = ?
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