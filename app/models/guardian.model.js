
const db = require("./db");
const CUser = require("./user.model");

const CGuardian = function(guardian) {
  this.guardian_id = guardian.guardian_id;
  this.UserId = guardian.UserId;
  this.status = guardian.status;
  this.GuardianRelation = guardian.GuardianRelation;
};

// get all guardians
CGuardian.getAllGuardians_ = result => {
  db.query("SELECT * FROM TbUser, TbGuardian WHERE TbGuardian.UserId = TbUser.user_id", (err, res) => {
    if (err) {
      console.log("get all guardians error:", err);
      result(null, err);
      return;
    }
    console.log("guardians:", res);
    result(null, res);
  });
};

// search for guardians
CGuardian.getGuardianByString_ = (searchString, result) => {
  const searchPattern = `%${searchString}%`;
  const query = `
    SELECT * 
    FROM TbGuardian 
    JOIN TbUser ON TbGuardian.UserId = TbUser.user_id 
    WHERE TbUser.name LIKE ? 
       OR TbUser.phone LIKE ? 
       OR TbUser.email LIKE ?
  `;

  db.query(query, [searchPattern, searchPattern, searchPattern], (err, res) => {
    if (err) {
      console.log("search guardians error:", err);
      result(null, err);
      return;
    }
    console.log("search guardians by string:", res);
    result(null, res);
  });
};

// get guardian by id
CGuardian.getGuardianById_ = (guardianId, result) => {
  db.query("SELECT * FROM TbGuardian JOIN TbUser ON TbGuardian.UserId = TbUser.user_id WHERE TbGuardian.guardian_id = ?", [guardianId], (err, res) => {
    if (err) {
      console.log("get guardian by id error:", err);
      result(null, err);
      return;
    }
    console.log("get guardian by id", res);
    result(null, res);
  });
};

// add new guardian
CGuardian.addNewGuardian_ = (newGuardian, result) => {
  console.log(JSON.stringify(newGuardian), '-------------------------');
  
  // extract user info
  const newUser = {
    name: newGuardian.name,
    phone: newGuardian.phone,
    email: newGuardian.email,
    address: newGuardian.address,
    memo: newGuardian.memo,
    isGuardian: true
  };

  // insert user record
  CUser.addNewUser_(newUser, (err, userResult) => {
    if (err) {
      result(err, null);
      return;
    }

    // get the id of the inserted record
    const userId_ = userResult.insertId;

    // prepare the guardian info
    const guardianData = {
      UserId: userId_,
      status: newGuardian.status,
      GuardianRelation: newGuardian.GuardianRelation
    };

    // insert the new guardian record
    db.query("INSERT INTO TbGuardian SET ?", guardianData, (err, res) => {
      if (err) {
        console.log("Add new guardian Error:", err);
        result(err, null);
        return;
      }
      console.log("New guardian added:", res);
      result(null, res);
    });
  });
};

// Update data in both the guardian table and the user table simultaneously
CGuardian.updateGuardianById_ = (guardianId, updateGuardian, result) => {
  console.log(JSON.stringify(updateGuardian), '----------update---------------');
  
  // user info
  const updateUser = {
    name: updateGuardian.name,
    phone: updateGuardian.phone,
    email: updateGuardian.email,
    address: updateGuardian.address,
    memo: updateGuardian.memo
  };

  // update the corresponding user info  
  CUser.updateUserByGuardianId_(guardianId, updateUser, (err, userRes) => {
    if (err) {
      result(err, null);
      return;
    }

    // guardian info
    const updateGuardianData = {
      status: updateGuardian.status,
      GuardianRelation: updateGuardian.GuardianRelation
    };

    // update the guardian
    db.query("UPDATE TbGuardian SET ? WHERE guardian_id = ?", [updateGuardianData, guardianId], (err, res) => {
      if (err) {
        console.log("Update guardian Error:", err);
        result(err, null);
        return;
      }
      console.log("Guardian updated:", res);
      result(null, res);
    });
  });
};

module.exports = CGuardian;
