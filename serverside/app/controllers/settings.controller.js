const CSettings = require("../models/settings.model");

// Get all settings
exports.getAllSettings = (req, res) => {
  CSettings.getAllSettings_((err, settings) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while retrieving all settings",
        error: err
      });
    } else {
      res.status(200).json(settings);
    }
  });
};

// Update settings with key-value pairs
exports.updateSettings = (req, res) => {
  CSettings.updateSettings_(req.body, (err, settings) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while updating settings",
        error: err
      });
    } else {
      res.status(200).json(settings);
    }
  });
};