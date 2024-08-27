
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

/**************************** repeatly add recurring courses **************************/
CCourse.addRecurringCourses_ = (newCourse, result) => {
  // Validate inputs
  if (!newCourse || typeof newCourse !== 'object') {
    return result(new Error("Invalid course data"));
  }
  if (!newCourse.rec_period) {
    return result(new Error("Invalid recurrence period"));
  }

  if (!Number.isInteger(newCourse.rec_count) || newCourse.rec_count < 1 || newCourse.rec_count > 100) {
    return result(new Error("rec_count must be an integer between 1 and 100"));
  }

  const getNextCourse = (curCourse) => {
    const date1 = new Date(curCourse.starttime);
    const date2 = new Date(curCourse.endtime);

    switch (curCourse.rec_period) {
      case "1": // Daily
        date1.setDate(date1.getDate() + 1);
        date2.setDate(date2.getDate() + 1);
        break;
      case "2": // Every 2 Days
        date1.setDate(date1.getDate() + 2);
        date2.setDate(date2.getDate() + 2);
        break;
      case "3": // Every 3 Days
        date1.setDate(date1.getDate() + 3);
        date2.setDate(date2.getDate() + 3);
        break;
      case "7": // Weekly
        date1.setDate(date1.getDate() + 7);
        date2.setDate(date2.getDate() + 7);
        break;
      case "14": // Every 2 Weeks
        date1.setDate(date1.getDate() + 14);
        date2.setDate(date2.getDate() + 14);
        break;
      case "m": // Monthly
        date1.setMonth(date1.getMonth() + 1);
        date2.setMonth(date2.getMonth() + 1);
        break;
      default:
        return result(new Error("Invalid recurrence period"));
    }

    curCourse.starttime = date1.toISOString();
    curCourse.endtime = date2.toISOString();
    return { ...curCourse }; // Return a new object to avoid modifying the original
  };

  let currentCourse = { ...newCourse }; // Clone the course to avoid side effects

  // Use a Promise chain to sequentially add courses
  let firstCourseResult = null;
  const addCoursesPromise = Array.from({ length: currentCourse.rec_count }).reduce((promiseChain, _, index) => {
    return promiseChain
      .then(() => {
        return new Promise((resolve, reject) => {
          CCourse.addSingleCourse_(currentCourse, (err, res) => {
            if (err) {
              return reject(err);
            }
            if (!firstCourseResult) {
              firstCourseResult = res; // Capture the first course result to return it later
            }
            //console.log(`Course ${index + 1} added successfully`);
            currentCourse = getNextCourse(currentCourse); // Get the next course in the recurrence series
            resolve();
          });
        });
      });
  }, Promise.resolve());

  // After all courses are added, return the result of the first course
  addCoursesPromise
    .then(() => {
      return result(null, firstCourseResult);
    })
    .catch((err) => {
      return result(err);
    });
};

/**************************** add a single course, and add teachers & students if have data **************************/
CCourse.addSingleCourse_ = (newCourse, result) => {
  // First, add the new course
  CCourse.addNewCourse_(newCourse, (err, res) => {
    if (err) {
      return result(err, null);
    }

    // Get the inserted course ID
    const courseId = res.insertId;

    // Create an array to hold all promises
    const tasks = [];

    // If teachers exist and are an array, add setTeachersToCourse_ to the tasks
    if (Array.isArray(newCourse.teachers) && newCourse.teachers.length > 0) {
      tasks.push(
        new Promise((resolve, reject) => {
          CCourse.setTeachersToCourse_(courseId, newCourse.teachers, (err, res) => {
            if (err) {
              return reject(err);
            }
            resolve(res);
          });
        })
      );
    }

    // If students exist and are an array, add setStudentsToCourse_ to the tasks
    if (Array.isArray(newCourse.students) && newCourse.students.length > 0) {
      tasks.push(
        new Promise((resolve, reject) => {
          CCourse.setStudentsToCourse_(courseId, newCourse.students, (err, res) => {
            if (err) {
              return reject(err);
            }
            resolve(res);
          });
        })
      );
    }

    // Run all tasks in parallel and wait for them to complete
    Promise.all(tasks)
      .then(() => {
        result(null, res); // Return the course insert result
      })
      .catch((err) => {
        console.log("Error adding course, teachers, or students:", err);
        result(err, null); // Return the error if any operation fails
      });
  });
};

// Add new course
CCourse.addNewCourse_ = (newCourse, result) => {
  const formatDateTimeForMySQL = (isoDate) => {
    const date = new Date(isoDate);
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };
  
  const courseData = {
    name: newCourse.name,
    groupprivate: newCourse.groupprivate,
    coursetype: newCourse.coursetype,
    starttime: formatDateTimeForMySQL(newCourse.starttime),
    endtime: formatDateTimeForMySQL(newCourse.endtime),
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


/************************************* students in a course ***********************************/
// Set students to a course,students could be many
CCourse.setStudentsToCourse_ = (courseId, studentsArr, result) => {
  // Check if studentsArr is an array
  if (!Array.isArray(studentsArr)) {
      console.log("setStudentsToCourse_  studentsArr is not an array: ");
      console.log(studentsArr);
      result({ message: "Invalid input: studentsArr must be an array" }, null);
      return;
  }
  
  // Begin transaction
  db.beginTransaction(err => {
    if (err) {
      console.log("Error starting transaction:", err);
      result(err, null);
      return;
    }

    // Delete all existing student records for the course
    const deleteQuery = "DELETE FROM TbCourseStudent WHERE courseid = ?";
    db.query(deleteQuery, [courseId], (err, res) => {
      if (err) {
        return db.rollback(() => {
          console.log("Error deleting students from course:", err);
          result(err, null);
        });
      }

      // Loop through studentsArr and insert each student ID
      const insertPromises = studentsArr.map(studentId => {
        return new Promise((resolve, reject) => {
          const insertQuery = `
            INSERT INTO TbCourseStudent (courseid, studentid)
            VALUES (?, ?)
          `;
          db.query(insertQuery, [courseId, studentId], (err, res) => {
            if (err) {
              return reject(err);
            }
            resolve(res);
          });
        });
      });

      // Use Promise.all to ensure all insert operations are completed
      Promise.all(insertPromises)
        .then(() => {
          // Commit the transaction
          db.commit(err => {
            if (err) {
              return db.rollback(() => {
                console.log("Error committing transaction:", err);
                result(err, null);
              });
            }
            result(null, { message: "Course students updated successfully" });
          });
        })
        .catch(err => {
          // Rollback transaction in case of any error
          db.rollback(() => {
            console.log("Error adding students to course:", err);
            result(err, null);
          });
        });
    });
  });
};
/* no longer needed
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
*/

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
/*
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
*/

// Set teachers to a course, teachers could be many
CCourse.setTeachersToCourse_ = (courseId, teachersArr, result) => {
  // Check if teachersArr is an array
  if (!Array.isArray(teachersArr)) {
    console.log("setTeachersToCourse_  teachersArr is not an array: ");
    console.log(teachersArr);
    result({ message: "Invalid input: teachersArr must be an array" }, null);
    return;
  }

  // Begin transaction
  db.beginTransaction(err => {
    if (err) {
      console.log("Error starting transaction:", err);
      result(err, null);
      return;
    }

    // Delete all existing teacher records for the course
    const deleteQuery = "DELETE FROM TbCourseTeacher WHERE courseid = ?";
    db.query(deleteQuery, [courseId], (err, res) => {
      if (err) {
        return db.rollback(() => {
          console.log("Error deleting teachers from course:", err);
          result(err, null);
        });
      }

      // Loop through teachersArr and insert each teacher ID
      const insertPromises = teachersArr.map(teacherId => {
        return new Promise((resolve, reject) => {
          const insertQuery = `
            INSERT INTO TbCourseTeacher (courseid, teacherid)
            VALUES (?, ?)
          `;
          db.query(insertQuery, [courseId, teacherId], (err, res) => {
            if (err) {
              return reject(err);
            }
            resolve(res);
          });
        });
      });

      // Use Promise.all to ensure all insert operations are completed
      Promise.all(insertPromises)
        .then(() => {
          // Commit the transaction
          db.commit(err => {
            if (err) {
              return db.rollback(() => {
                console.log("Error committing transaction:", err);
                result(err, null);
              });
            }
            result(null, { message: "Course teachers updated successfully" });
          });
        })
        .catch(err => {
          // Rollback transaction in case of any error
          db.rollback(() => {
            console.log("Error adding teachers to course:", err);
            result(err, null);
          });
        });
    });
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
