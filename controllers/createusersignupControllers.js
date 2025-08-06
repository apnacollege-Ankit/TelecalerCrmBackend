import createuser from "../models/createUserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
console.log("Loaded JWT_SECRET from .env file", JWT_SECRET);

export const createUser = async (req, res) => {
    const {role, email, password, confirmPassword, name} = req.body;
    const image = req.file?.path;

    try {
        if(!image) {
            return res.status(400).json({message: "Image is required"});
        }
        if(password !== confirmPassword) {
            return res.status(400).json({message: "Password don't match"});
        }
        const normalizedEmail = email.toLowerCase();

        const existingUser = await createuser.findOne({email: normalizedEmail});

        if(existingUser) {
            return res.status(400).json({
                message: "Email already exist"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new createuser({
            role,
            email: normalizedEmail,
            password: hashedPassword,
            name,
            image
        });

        await newUser.save();

        const token = jwt.sign({id: newUser._id, email: newUser.email}, JWT_SECRET, {expiresIn: "1d"});

        res.status(201).json({
            message: "User Created Successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Signup Error", error);
        res.status(500).json({message: "Server Error"});
    }
};