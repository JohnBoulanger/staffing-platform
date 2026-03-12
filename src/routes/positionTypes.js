const express = require("express");
const { createPositionType, updatePositionType, deletePositionType, getPositionTypes } = require("../controllers/positionTypeController")

const router = express.Router();

// create a new position type
// retrieve a list of position types
router.route("/")
    .post(createPositionType)
    .get(getPositionTypes)
    .all((req, res) => {
        res.status(405).json({ error: "Method Not Allowed" });
    });

// edit a position types details
// delete a position type
router.route("/:positionTypeId")
    .patch(updatePositionType)
    .delete(deletePositionType)
    .all((req, res) => {
        res.status(405).json({ error: "Method Not Allowed" });
    });

module.exports = router