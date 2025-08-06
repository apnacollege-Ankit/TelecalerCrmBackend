import companyModel from "../models/companyModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import dotenv from 'dotenv';
dotenv.config();

export const createCompany = async (req, res) => {
    try {
        const logo = req.file?.path;
        const {name} = req.body;

        if(!logo) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a logo',
            });
        }

        if(!name) {
            return res.status(400).json({
                success: false,
                message: "please provide name",
            });
        }

        let uploadedLogo;
        try {
            uploadedLogo = await uploadOnCloudinary(logo);
            if (!uploadedLogo || !uploadedLogo.secure_url) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload logo to Cloudinary",
                });
            }
        } catch(error) {
            console.error("Error uploading logo to cloudinary", error);
            return res.status(500).json({
                success: false,
                message: "Error uploading logo to cloudinary"
            });
        }

        const newCompany = new companyModel({
            name,
            logo: uploadedLogo.secure_url || ""
        });

        const savedCompany = await newCompany.save();

        res.status(201).json({
            success: true,
            message: "company created successfully",
            data: savedCompany
        });
    } catch (error) {
        console.error("Error creating company", error);
        res.status(500).json({
            success: false,
            message: 'Error creating company',
            error: error.message,
        });
    }
};

export const getCompany = async (req, res) => {
    try {
        const company = await companyModel.find().sort({createdAt: -1});
        res.status(200).json({
            success: true,
            message: "company retrieved successfully",
            data: company
        });
    } catch (error) {
        console.error("Error getting company", error);
        res.status(500).json({
            success: false,
            message: 'Error getting Company',
            error: error.message,
        });
    }
};