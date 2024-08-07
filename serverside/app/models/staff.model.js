
const db = require("./db");
const CUser = require("./user.model");

const CStaff = function(staff) {
  this.staff_id = staff.staff_id;
  this.UserId = staff.UserId;
  this.Status = staff.Status;
  this.DateOfHire = staff.DateOfHire;
  this.Title = staff.Title;
};

// Get all staff
CStaff.getAllStaff_ = result => {
  db.query("SELECT * FROM TbUser, TbStaff WHERE TbStaff.UserId = TbUser.user_id", (err, res) => {
    if (err) {
      console.log("get all staff error:", err);
      result(null, err);
      return;
    }
    console.log("staff:", res);
    result(null, res);
  });
};

// Add new staff
CStaff.addNewStaff_ = (newStaff, result) => {
  console.log(JSON.stringify(newStaff), '-------------------------');
  
  // Extract user info
  const newUser = {
    name: newStaff.name,
    phone: newStaff.phone,
    Email: newStaff.email,
    Address: newStaff.address,
    Memo: newStaff.memo,
    isStaff: true
  };

  // Insert user record
  CUser.addNewUser_(newUser, (err, userResult) => {
    if (err) {
      result(err, null);
      return;
    }

    // Get the id of the inserted record
    const userId_ = userResult.insertId;

    // Prepare the staff info
    const staffData = {
      UserId: userId_,
      status: newStaff.status,
      DateOfHire: newStaff.DateOfHire,
      Title: newStaff.Title
    };

    // Insert the new staff record
    db.query("INSERT INTO TbStaff SET ?", staffData, (err, res) => {
      if (err) {
        console.log("Add new staff Error:", err);
        result(err, null);
        return;
      }
      console.log("New staff added:", res);
      result(null, res);
    });
  });
};

// Update data in both the staff table and the user table simultaneously
CStaff.updateStaffById_ = (staffId, updateStaff, result) => {
  // User info
  const updateUser = {
    Name: updateStaff.name,
    Phone: updateStaff.phone,
    Email: updateStaff.email,
    Address: updateStaff.address,
    Memo: updateStaff.memo
  };

  // Update the corresponding user info  
  CUser.updateUserByStaffId_(staffId, updateUser, (err, userRes) => {
    if (err) {
      result(err, null);
      return;
    }

    // Staff info
    const updateStaffData = {
      Status: updateStaff.status,
      DateOfHire: updateStaff.DateOfHire,
      Title: updateStaff.Title
    };

    // Update the staff
    db.query("UPDATE TbStaff SET ? WHERE staff_id = ?", [updateStaffData, staffId], (err, res) => {
      if (err) {
        console.log("Update staff Error:", err);
        result(err, null);
        return;
      }
      console.log("Staff updated:", res);
      result(null, res);
    });
  });
};

module.exports = CStaff;