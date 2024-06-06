import {Router} from "express";
import {Vendor} from "../models/vendor.model.js";
import {
  loginVendor,
  logoutVendor,
  refreshAccessToken,
  vendorRegister,
  changeCurrentVendorPassword,
  getCurrentVendor,
  updateVendorAccountDetails
} from "../controllers/vendor.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/authvendor.middleware.js";
import { verifyJWT as v} from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

router.route("/vendorregister")
  .post(
    upload.fields(
        [
            {
                name: "avatar",
                maxCount: 1,
            }
        ]
    ), 
    vendorRegister
);

router.route("/vendorlogin").post(loginVendor);

//secured routes

router.route("/vendorlogout").post(verifyJWT, logoutVendor);
router.route("/getdetails").get(verifyJWT, getCurrentVendor);
router.route("/getvendordetailsuser").get(v, getCurrentVendor);
router.route("/changepassword").post(verifyJWT, changeCurrentVendorPassword);


router.route("/getvendordetails/:ownerId").get(async (req, res) => {
  
  const ownerId = req.params.ownerId;
  

  try {
    const vendor = await Vendor.findById(ownerId);
    console.log("vendor is in router::::::::::::::::::", vendor);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    console.log("vendor is in router", vendor);
    return res
     .status(200)
     .json(
         new ApiResponse(
             200,
             vendor,
             "Vendor fetched successfully"
         )
     )
  } catch (error) {
    console.error('Error fetching vendor:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.route("/refresh-token", refreshAccessToken);
router.route("/updatevendor").put(verifyJWT,updateVendorAccountDetails);

export default router;
