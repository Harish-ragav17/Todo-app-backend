const { Router } = require("express");
const {
  gettodo,
  savetodo,
  updatetodo,
  deletetodo,
  updatetick,
  login,
  register,
  getusernameandpoints,
  addtask,
  test,
} = require("../controllers/Todocontroller");
const router = Router();

router.get("/", test);
router.get("/gettodo", gettodo);
router.post("/edittext", updatetodo);
router.post("/updatetick", updatetick);
router.post("/delete", deletetodo);
router.post("/login", login );
router.post("/register", register);
router.get("/getusernameandpoints", getusernameandpoints);
router.post("/addtask", addtask);

module.exports = router;
