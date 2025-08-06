import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config(); 

const JWT_SECRET = process.env.JWT_SECRET;
console.log("Loaded JWT_SECRET in signupController:", JWT_SECRET); 

export const signupUser = async (req, res) => {
    const { name, email, phoneNumber, password, confirmPassword } = req.body;
    const image = req.file?.path;

    try {
        if (!image) {
            return res.status(400).json({ message: "Image is required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const normalizedEmail = email.toLowerCase();
        
        const existingUser = await UserModel.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            image,
            name,
            email: normalizedEmail,
            phoneNumber,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: "1d" });
        console.log("JWT_SECRET value is:", JWT_SECRET);


        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                password: newUser.password
            }
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
