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

  // set parents1 and parents2
  app.put('/student/guardian/:id', CStudent.setStudentGuardianById);

  /************************ guardian routes *****************************/
  const CGuardian = require("../controllers/guardian.controller");
  app.get('/guardian', CGuardian.getAllGuardians);

  // Search guardians for the specified string in name, phone, and email, and return all records that contain the string
  app.get('/guardian/search/:searchstring', CGuardian.getGuardianByString);

  app.get('/guardian/:id', CGuardian.getGuardianById);

  app.post('/guardian', CGuardian.addNewGuardian);

  app.put('/guardian/:id', CGuardian.updateGuardianById);
  
  /************************ course routes *****************************/
  const CCourse = require("../controllers/course.controller");
  app.get('/course', CCourse.getAllCourses);

  // Search courses based on multiple conditions
  app.get('/course/search', CCourse.getCoursesByConditions);

  app.get('/course/:id', CCourse.getCourseById);

  app.post('/course', CCourse.addNewCourse);

  app.put('/course/:id', CCourse.updateCourseById);

  // Add a student to a course. 
  app.post('/course/student', CCourse.addStudentToCourse);
  // Remove a student from a course
  app.delete('/course/student', CCourse.removeStudentFromCourse);
  // get all students in a course
  app.get('/course/student/:courseid',CCourse.getAllStudentFromCourse)

  // Add a teacher to a course
  app.post('/course/teacher', CCourse.addTeacherToCourse);
  // Remove a teacher from a course
  app.delete('/course/teacher', CCourse.removeTeacherFromCourse);
  // Get all teachers in a course
  app.get('/course/teacher/:courseID', CCourse.getAllTeachersFromCourse);
}