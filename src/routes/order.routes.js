import {Router} from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { verifyJWT as v } from '../middlewares/authvendor.middleware.js';
import { addOrder , getVendorOrder ,userOrder ,updateOrderstatus } from '../controllers/order.controller.js';

const router = Router();

router.route("/addorder").post(verifyJWT,addOrder);
router.route("/getvendororder/:vendorId").get(v,getVendorOrder);
router.route("/getuserorder").get(verifyJWT,userOrder);
router.route("/updateorderstatus/:orderId").put(v,updateOrderstatus);

export default router