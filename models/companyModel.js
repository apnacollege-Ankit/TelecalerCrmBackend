import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    logo: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const companyModel = mongoose.model("companyModel", companySchema);
export default companyModel;