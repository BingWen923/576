const db = require("./db");

const CSettings = function(setting) {
  // ...

};

// Get all settings and return as an object
CSettings.getAllSettings_ = (result) => {
  db.query("SELECT setting_key, setting_value FROM app_settings", (err, res) => {
    if (err) {
      console.log("Error retrieving settings from app_settings table:", err);
      result(err, null);
      return;
    }

    // Convert the result array into an object with key-value pairs
    const settings = {};
    res.forEach((row) => {
      settings[row.setting_key] = row.setting_value;
    });

    console.log("Settings retrieved:", settings);
    result(null, settings);
  });
};

// Update all settings from the settings object
CSettings.updateSettings_ = (settings, result) => {
  const queries = [];

  // Loop through each setting in the object
  for (const key in settings) {
    if (settings.hasOwnProperty(key)) {
      // Prepare the update query for each setting
      const query = new Promise((resolve, reject) => {
        db.query(
          "UPDATE app_settings SET setting_value = ? WHERE setting_key = ?",
          [settings[key], key],
          (err, res) => {
            if (err) {
              console.log(`Error updating setting for key: ${key}`, err);
              return reject(err);
            }
            if (res.affectedRows > 0) {
              console.log(`Setting updated for key: ${key}`);
            } else {
              console.log(`No setting found for key: ${key}, ignoring.`);
            }
            resolve(res);
          }
        );
      });
      queries.push(query); // Add the promise to the array
    }
  }

  // Execute all the queries in parallel using Promise.all
  Promise.all(queries)
    .then((res) => {
      console.log("All settings updated successfully.");
      result(null, res); // Return success result
    })
    .catch((err) => {
      console.log("Error occurred while updating settings:", err);
      result(err, null); // Return error
    });
};

module.exports = CSettings;

