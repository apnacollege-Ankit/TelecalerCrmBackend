import createuser from "../models/createUserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const createlogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const normalizedEmail = email.toLowerCase();

        const newUser = await createuser.findOne({
            email: normalizedEmail
        })

        if(!newUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, newUser.password);

        if(!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        }, JWT_SECRET, {expiresIn : "1d"});

        res.status(200).json({
            message: "Create User Login Successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role 
            }
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};