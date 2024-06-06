import {Router} from 'express';
import { loginUser, logoutUser,updateUserAccountDetails, refreshAccessToken, registerUser, changeCurrentUserPassword, getCurrentUser} from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router()



router.route("/userregister").post(
    upload.fields(//using multer here for upload file 
        [
            {
                name:"avatar",
                maxCount:1
            }
        ]
        ),
    registerUser
    )


router.route("/userlogin").post(loginUser)

//secured routes
router.route("/edituserprofile").put(updateUserAccountDetails)

router.route("/getuserprofile").get(verifyJWT,getCurrentUser)
router.route("/userlogout").post(verifyJWT ,logoutUser)

router.route("/updatepassword").post(changeCurrentUserPassword)
router.route("/refresh-token",refreshAccessToken)




export default router