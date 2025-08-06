import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({}, {
    timestamps: true,
    strict: false
});

const LeadsModel = mongoose.model("Lead", leadSchema);
export default LeadsModel;