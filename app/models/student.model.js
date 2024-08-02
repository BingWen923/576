
const db = require("./db");
const CUser = require("./user.model");

const CStudent = function(student) {
  // ...
  this.student_id = student.student_id;
  this.name = student.name;
  this.status = student.status;
  this.studyPrograms = student.studyPrograms;
  this.phone = student.phone;
  this.email = student.email;
  this.address = student.address;
  this.memo = student.memo;
};

// show all students
CStudent.getAllStudents_ = result => {
  db.query("SELECT * FROM TbUser,TbStudent WHERE TbStudent.UserId = TbUser.user_id", (err, res) => {
    if (err) {
      console.log("get all students error:", err);
      result(null, err);
      return;
    }
    console.log("students:", res);
    result(null, res);
  });
};

// get students by search string
CStudent.getStudentByString_ = (searchString, result) => {
  const searchPattern = `%${searchString}%`;
  const query = `
    SELECT * 
    FROM TbStudent 
    JOIN TbUser ON TbStudent.UserId = TbUser.user_id 
    WHERE TbUser.name LIKE ? 
       OR TbUser.phone LIKE ? 
       OR TbUser.email LIKE ?
  `;

  db.query(query, [searchPattern, searchPattern, searchPattern], (err, res) => {
    if (err) {
      console.log("search students error:", err);
      result(null, err);
      return;
    }
    console.log("search students by string:", res);
    result(null, res);
  });
};

// get student by id
CStudent.getStudentById_ = (studentId, result) => {
  db.query("SELECT * FROM TbStudent JOIN TbUser ON TbStudent.UserId = TbUser.user_id WHERE TbStudent.student_id = ?", [studentId], (err, res) => {
    if (err) {
      console.log("get student by id error:", err);
      result(null, err);
      return;
    }
    console.log("get student by id", res);
    result(null, res);
  });
};

// When creating a new student record, first create the corresponding user record
CStudent.addNewStudent_ = (newStudent, result) => {
  console.log(JSON.stringify(newStudent), '-------------------------');
  
  // Extract user information
  const newUser = {
    name: newStudent.name,
    phone: newStudent.phone,
    email: newStudent.email,
    address: newStudent.address,
    memo: newStudent.memo,
    parents1: newStudent.parents1,
    parents2: newStudent.parents2,
    isStudent: true
  };

  // Insert user record
  CUser.addNewUser_(newUser, (err, userResult) => {
    if (err) {
      result(err, null);
      return;
    }

    // Get the inserted user's ID
    const userId_ = userResult.insertId;

    // Prepare student data
    const studentData = {
      UserId: userId_,
      status: newStudent.status,
      studyPrograms: newStudent.studyPrograms
    };

    // Insert student record
    db.query("INSERT INTO TbStudent SET ?", studentData, (err, res) => {
      if (err) {
        console.log("Add new student Error:", err);
        result(err, null);
        return;
      }
      console.log("New student added:", res);
      result(null, res);
    });
  });
};

// Update data in both the student table and the user table simultaneously.
CStudent.updateStudentById_ = (studentId, updateStudent, result) => {
  console.log(JSON.stringify(updateStudent), '----------update---------------');
  
  // Extract user information
  const updateUser = {
    name: updateStudent.name,
    phone: updateStudent.phone,
    email: updateStudent.email,
    address: updateStudent.address,
    memo: updateStudent.memo
  };

  CUser.updateUserByStudentId_(studentId, updateUser, (err, userRes) => {
    if (err) {
      result(err, null);
      return;
    }

    // Prepare student data
    const updateStudentData = {
      parents1: updateStudent.parents1,
      parents2: updateStudent.parents2,
      status: updateStudent.status,
      studyPrograms: updateStudent.studyPrograms
    };

    // update student data
    db.query("UPDATE TbStudent SET ? WHERE student_id = ?", [updateStudentData, studentId], (err, res) => {
      if (err) {
        console.log("Update student Error:", err);
        result(err, null);
        return;
      }
      console.log("Student updated:", res);
      result(null, res);
    });
  });
};

// set the guardian id to a student record
/* The parents1 and parents2 fields will be reset simultaneously. 
   If a null value is passed, they will both be reset to null in the student record, 
   effectively removing the guardian relationship for the student. 
   If the scenario is to add a guardian to parents2 only, 
   the function should read the existing data for parents1 and populate parents1 with it, 
   instead of using null.
*/
CStudent.setStudentGuardianById_ = (studentId, updateStudent, result) => {
  // Prepare student data
  const updateStudentData = {
    parents1: updateStudent.parents1,
    parents2: updateStudent.parents2,
  };

  // update student data
  db.query("UPDATE TbStudent SET ? WHERE student_id = ?", [updateStudentData, studentId], (err, res) => {
    if (err) {
      console.log("set student guardian Error:", err);
      result(err, null);
      return;
    }
    console.log("set student guardian:", res);
    result(null, res);
  });
};

module.exports = CStudent;
