import {Router} from "express";
import {Contact} from "../models/contact.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const router = Router();

router.route("/contactregister").post(async (req, res) => {
    const {name,phone,email,message} = req.body
    console.log("contact is in router::::::::::::::::::", name);
    const contact = new Contact({
        name,
        phone,
        email,
        message
    })
    try {
        const createdContact = await contact.save()
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                createdContact,
                "Contact created successfully"
            )
        )
    } catch (error) {
        console.error('Error creating contact:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

export default router;