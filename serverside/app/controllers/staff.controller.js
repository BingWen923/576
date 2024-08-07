const CStaff = require("../models/staff.model");

// Get all staff
exports.getAllStaff = (req, res) => {
  CStaff.getAllStaff_((err, staff) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while retrieving all staff",
        error: err
      });
    } else {
      res.status(200).json(staff);
    }
  });
};

// Add new staff
exports.addNewStaff = (req, res) => {
  CStaff.addNewStaff_(req.body, (err, staff) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while adding new staff",
        error: err
      });
    } else {
      res.status(200).json(staff);
    }
  });
};

// Update staff by ID
exports.updateStaffById = (req, res) => {
  const { staffId } = req.params;
  CStaff.updateStaffById_(staffId, req.body, (err, staff) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while updating staff",
        error: err
      });
    } else {
      res.status(200).json(staff);
    }
  });
};