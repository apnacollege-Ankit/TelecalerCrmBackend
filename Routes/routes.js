import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {signupUser} from "../controllers/signupControllers.js";
import {loginUser} from "../controllers/loginControllers.js";
import { upload, svgUpload, excelUpload } from "../middleware/multer.js";
import { createUser } from "../controllers/createusersignupControllers.js";
import { createlogin } from "../controllers/createuserloginControllers.js";
import { createCompany, getCompany } from "../controllers/companyControllers.js";
import { deleteLeadById, getAllLeads, updateLeadById, uploadLeadsFromExcel } from "../controllers/leadControllers.js";

const router = express.Router();

router.post("/signup", upload.single('image'),signupUser);
router.post("/login", loginUser);

router.get("/dashboard", verifyToken, (req, res) => {
    res.json({
        message: "Welcome to the dashboard",
        user: req.user
    });
});

router.post("/create-user", upload.single('image'), createUser);
router.post("/create-login", createlogin);

router.post("/create-Company", svgUpload.single('logo'),createCompany);
router.get("/allCompany", getCompany);

router.post("/tl/upload",  excelUpload.single("file"), uploadLeadsFromExcel);

router.get("/allLead",  getAllLeads);

router.patch("/allLead/:id",  updateLeadById);

router.delete("/allLead/:id",  deleteLeadById);


export default router;