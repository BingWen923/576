
const CGuardian = require("../models/guardian.model");

exports.getAllGuardians = (req, res) => {
    CGuardian.getAllGuardians_((err, guardians) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while retrieving all guardians",
                error: err
            });
        } else {
            // if no problem then send back all guardians
            res.status(200).json(guardians);
        }
    });
};

exports.getGuardianByString = (req, res) => {
    CGuardian.getGuardianByString_(req.params.searchstring, (err, guardians) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while retrieving guardians by search string",
                error: err
            });
        } else {
            // if no problem then send back searched guardians
            res.status(200).json(guardians);
        }
    });
};

exports.getGuardianById = (req, res) => {
    CGuardian.getGuardianById_(req.params.id, (err, guardian) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while retrieving guardian by id",
                error: err
            });
        } else {
            // if no problem then send back the guardian
            res.status(200).json(guardian);
        }
    });
};

exports.addNewGuardian = (req, res) => {
    CGuardian.addNewGuardian_(req.body, (err, guardian) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while adding a new guardian",
                error: err
            });
        } else {
            res.status(200).json(guardian);
        }
    });
};

exports.updateGuardianById = (req, res) => {
    CGuardian.updateGuardianById_(req.params.id, req.body, (err, guardian) => {
        if (err) {
            res.status(500).json({
                message: "Error occurred while updating the guardian",
                error: err
            });
        } else {
            res.status(200).json(guardian);
        }
    });
};
