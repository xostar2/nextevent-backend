
import {Router} from 'express';
import {feedbackForm,getfeedback} from "../controllers/feedback.controller.js"
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router()



router.route("/userfeedback").post(verifyJWT,feedbackForm);
router.route("/getfeedback").get(getfeedback);






export default router