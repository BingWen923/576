const { get } = require("express/lib/response");

module.exports = app => {
  /************************ teacher routes *****************************/
  const CTeacher = require("../controllers/teacher.controller");
  app.get('/teacher', CTeacher.getAllTeachers);

  // Search teachers for the specified string in name, phone, and email, and return all records that contain the string
  app.get('/teacher/search/:searchstring', CTeacher.getTeacherByString);

  app.get('/teacher/:id', CTeacher.getTeacherById);

  app.post('/teacher', CTeacher.addNewTeacher);

  app.put('/teacher/:id', CTeacher.updateTeacherById);

  /************************ student routes *****************************/
  const CStudent = require("../controllers/student.controller");
  app.get('/student', CStudent.getAllStudents);

  // Search students for the specified string in name, phone, and email, and return all records that contain the string
  app.get('/student/search/:searchstring', CStudent.getStudentByString);

  app.get('/student/:id', CStudent.getStudentById);

  app.post('/student', CStudent.addNewStudent);

  app.put('/student/:id', CStudent.updateStudentById);
  /* this api is not necessary
  // set parents1 and parents2
  app.put('/student/guardian/:id', CStudent.setStudentGuardianById);
  */

  /************************ guardian routes *****************************/
  const CGuardian = require("../controllers/guardian.controller");
  app.get('/guardian', CGuardian.getAllGuardians);

  // Search guardians for the specified string in name, phone, and email, and return all records that contain the string
  app.get('/guardian/search/:searchstring', CGuardian.getGuardianByString);

  app.get('/guardian/:id', CGuardian.getGuardianById);

  app.post('/guardian', CGuardian.addNewGuardian);

  app.put('/guardian/:id', CGuardian.updateGuardianById);
  
  /************************ staff routes *****************************/
  const CStaff = require("../controllers/staff.controller");
  // Get all staff
  app.get('/staff', CStaff.getAllStaff);
  // Add new staff
  app.post('/staff', CStaff.addNewStaff);
  // Update staff by ID
  app.put('/staff/:staffId', CStaff.updateStaffById);

  /************************ course routes *****************************/
  const CCourse = require("../controllers/course.controller");
  app.get('/course', CCourse.getAllCourses);

  // Search courses based on multiple conditions
  app.get('/course/search', CCourse.getCoursesByConditions);

  app.get('/course/:id', CCourse.getCourseById);

  app.post('/course', CCourse.addNewCourse);

  app.put('/course/:id', CCourse.updateCourseById);

  // delete the course and related records in tbcourseteacher and tbcoursestudent
  app.delete('/course/:id', CCourse.deleteCourseById);
  
  // set students to a course. students could be many.
 // app.put('/course/student/:courseid', CCourse.setStudentsToCourse);
  
  // get all students in a course
  app.get('/course/student/:courseid',CCourse.getAllStudentFromCourse)

  // set teachers to a course. teachers could be many.
  // app.put('/course/teacher/:courseid', CCourse.setTeachersToCourse);
  
  // Get all teachers in a course
  app.get('/course/teacher/:courseid', CCourse.getAllTeachersFromCourse);

  // Get all courses of a specified teacher
  app.get('/teacher/:teacherid/courses', CCourse.getAllCoursesFromTeacher);

  // Get all courses of a specified student
  app.get('/student/:studentid/courses', CCourse.getAllCoursesFromStudent);
}