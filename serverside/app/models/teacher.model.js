const db = require("./db");
const CUser = require("./user.model");

const CTeacher = function(teacher) {
  // ...
  this.teacher_id = teacher.teacher_id;
  this.name = teacher.name;
  this.status = teacher.status;
  this.specialties = teacher.specialties;
  this.phone = teacher.phone;
  this.email = teacher.email;
  this.address = teacher.address;
  this.memo = teacher.memo;
};

// show all teachers
CTeacher.getAllTeachers_= result => {
  db.query("select * from TbTeacher,TbUser where TbTeacher.UserId = TbUser.user_id",(err,res)=>{
    if (err) {
      console.log("error:",err);
      result(null,err);
      return;
    }
    console.log("teacher:",res);
    result(null,res);
  });
};

// get teachers by search string
CTeacher.getTeacherByString_ = (searchString, result) => {
  const searchPattern = `%${searchString}%`;
  const query = `
    SELECT * 
    FROM TbTeacher 
    JOIN TbUser ON TbTeacher.UserId = TbUser.user_id 
    WHERE TbUser.name LIKE ? 
       OR TbUser.phone LIKE ? 
       OR TbUser.email LIKE ?
  `;

  db.query(query, [searchPattern, searchPattern, searchPattern], (err, res) => {
    if (err) {
      console.log("search teachers error:",err);
      result(null,err);
      return;
    }
    console.log("search teachers by string:",res);
    result(null,res);
  });
};

// get teacher by id
CTeacher.getTeacherById_= (teacherId, result) => {
  db.query("SELECT * FROM TbTeacher JOIN TbUser ON TbTeacher.UserId = TbUser.user_id WHERE  TbTeacher.teacher_id=" + teacherId,(err,res)=>{
    if (err) {
      console.log("get teacher by id error:",err);
      result(null,err);
      return;
    }
    console.log("get teacher by id",res);
    result(null,res);
  });
};

// When creating a new teacher record, first create the corresponding user record
CTeacher.addNewTeacher_ = (newTeacher, result) => {
  console.log(JSON.stringify(newTeacher), '-------------------------');
  
  // Extract user information
  const newUser = {
    name: newTeacher.name,
    phone: newTeacher.phone,
    email: newTeacher.email,
    address: newTeacher.address,
    memo: newTeacher.memo,
    isTeacher: true
  };

  // Insert user record
  CUser.addNewUser_(newUser, (err, userResult) => {
    if (err) {
      result(err, null);
      return;
    }

    // Get the inserted user's ID
    const userId_ = userResult.insertId;

    // Prepare teacher data
    const teacherData = {
      UserId: userId_,
      status: newTeacher.status,
      specialties: newTeacher.specialties
    };

    // Insert teacher record
    db.query("INSERT INTO TbTeacher SET ?", teacherData, (err, res) => {
      if (err) {
        console.log("Add new teacher Error:", err);
        result(err, null);
        return;
      }
      console.log("New teacher added:", res);
      result(null, res);
    });
  });
};

// Update data in both the teacher table and the user table simultaneously.
CTeacher.updateTeacherById_ = (teacherId, updateTeacher, result) => {
  console.log(JSON.stringify(updateTeacher), '----------update---------------');
  
  // Extract user information
  const updateUser = {
    name: updateTeacher.name,
    phone: updateTeacher.phone,
    email: updateTeacher.email,
    address: updateTeacher.address,
    memo: updateTeacher.memo
  };

  CUser.updateUserByTeacherId_(teacherId, updateUser, (err, userRes) => {
    if (err) {
      result(err, null);
      return;
    }

    // Prepare teacher data
    const updateTeacherData = {
      status: updateTeacher.status,
      specialties: updateTeacher.specialties
    };

    // update teacher data
    db.query("UPDATE TbTeacher SET ? WHERE teacher_id = ?", [updateTeacherData, teacherId], (err, res) => {
      if (err) {
        console.log("Update teacher Error:", err);
        result(err, null);
        return;
      }
      console.log("Teacher updated:", res);
      result(null, res);
    });
  });
};



module.exports = CTeacher;