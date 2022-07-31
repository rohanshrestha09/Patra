import express, { Router } from "express";
const {
  register,
  login,
  getUsers,
  setAvatar,
  deleteUser,
} = require("../controller/user");
const auth = require("../middleware/auth");

const router: Router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.get("/users/:id", auth, getUsers);
router.put("/setavatar/:id", auth, setAvatar);
router.delete("/delete/:id", auth, deleteUser);

module.exports = router;
