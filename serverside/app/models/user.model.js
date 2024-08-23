const db = require("./db");

const CUser = function(user) {
  // ...
  this.user_id = user.user_id;
  this.name = user.name;
  this.phone = user.phone;
  this.email = user.email;
  this.address = user.address;
  this.memo = user.memo;
  this.isstudent = user.isstudent;
  this.isteacher = user.isteacher;
  this.isstaff = user.isstaff;
  this.isguardian = user.isguardian;
};


// add a new user
CUser.addNewUser_ = (newUser, result) => {
  db.query("INSERT INTO TbUser SET ?", newUser, (err, res) => {
    if (err) {
      console.log("Add new user Error:", err);
      result(err, null);
      return;
    }
    console.log("New user added:", res);
    result(null, res);
  });
};


// update user by id
CUser.updateUserById_ = (userId, updateUser, result) => {
  db.query("UPDATE TbUser SET ? WHERE user_id = ?", [updateUser, userId], (err, res) => {
    if (err) {
      console.log("User update error:", err);
      result(err, null);
      return;
    }
    console.log("User updated:", res);
    result(null, res);
  });
};

// Update the corresponding user's data based on the teacher ID
CUser.updateUserByTeacherId_ = (teacherId, updateUser, result) => {
  updateUser.isteacher = true;
  db.query("UPDATE TbUser SET ? WHERE user_id = (select userid from TbTeacher where TbTeacher.teacher_id = ?)", [updateUser, teacherId], (err, res) => {
    if (err) {
      console.log("User update by teacherid error:", err);
      result(err, null);
      return;
    }
    console.log("User updated by teacherid:", res);
    result(null, res);
  });
};

// Update the corresponding user's data based on the student ID
CUser.updateUserByStudentId_ = (studentId, updateUser, result) => {
  updateUser.isstudent = true;
  db.query("UPDATE TbUser SET ? WHERE user_id = (SELECT UserId FROM TbStudent WHERE TbStudent.student_id = ?)", [updateUser, studentId], (err, res) => {
    if (err) {
      console.log("User update by studentId error:", err);
      result(err, null);
      return;
    }
    console.log("User updated by studentId:", res);
    result(null, res);
  });
};

// Update the corresponding user's data based on the guardian ID
CUser.updateUserByGuardianId_ = (guardianId, updateUser, result) => {
  updateUser.isguardian = true;
  db.query("UPDATE TbUser SET ? WHERE user_id = (SELECT UserId FROM TbGuardian WHERE TbGuardian.guardian_id = ?)", [updateUser, guardianId], (err, res) => {
    if (err) {
      console.log("User update by guardianId error:", err);
      result(err, null);
      return;
    }
    console.log("User updated by guardianId:", res);
    result(null, res);
  });
};

// Update the corresponding user's data based on the staff ID
CUser.updateUserByStaffId_ = (staffId, updateUser, result) => {
  updateUser.isstaff = true;
  db.query("UPDATE TbUser SET ? WHERE user_id = (SELECT UserId FROM TbStaff WHERE TbStaff.staff_id = ?)", [updateUser, staffId], (err, res) => {
    if (err) {
      console.log("User update by staffId error:", err);
      result(err, null);
      return;
    }
    console.log("User updated by staffId:", res);
    result(null, res);
  });
};

module.exports = CUser;

