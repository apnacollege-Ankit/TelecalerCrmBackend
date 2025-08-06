import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
    {
        AssignedTeleoperatore: {
            type: String,
        },
        AssignedSalesperson: {
            type: String,
        },
        TelecomsRemark: {
            type: String,
        },
        SalesRemarks: {
            type: String,
        },
    },
    {
        timestamps: true,
        strict: false,
    }
);

const LeadsModel = mongoose.model("Lead", leadSchema);
export default LeadsModel;
