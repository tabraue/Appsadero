const router = require("express").Router();
const {getAllProfiles, getOneProfile, updateProfile, deleteProfile} = require("../controllers/place.controller");
const { checkAuth, checkId } = require("../middleware/auth");

router.get("/", checkAuth, getAllProfiles);
router.get("/:email", checkAuth, getOneProfile);
//router.post("/", checkAdmin, createNewUser); TAREA DEL ADMIN!!! ********************
router.put("/:userId", checkAuth, checkId, updateProfile);
router.delete("/:userId", checkAuth, checkId, deleteProfile);

module.exports = router;