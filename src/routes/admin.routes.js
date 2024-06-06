import {Router} from "express";
import {loginAdmin} from "../controllers/admin.controller.js";

const router = Router();

router.route("/loginadmin").post(loginAdmin);

export default router;
