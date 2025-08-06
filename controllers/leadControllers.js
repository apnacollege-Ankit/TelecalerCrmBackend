import xlsx from "xlsx";
import LeadsModel from "../models/leadModel.js";

export const uploadLeadsFromExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(sheet);

        let updatedCount = 0;
        let skipped = 0;

        for (const row of rows) {
            const id = row._id?.toString();

            if (!id) {
                skipped++;
                continue;
            }

            const patchFields = {
                ...(row.AssignedTeleoperatore && { AssignedTeleoperatore: row.AssignedTeleoperatore }),
                ...(row.AssignedSalesperson && { AssignedSalesperson: row.AssignedSalesperson }),
                ...(row.TelecomsRemark && { TelecomsRemark: row.TelecomsRemark }),
                ...(row.SalesRemarks && { SalesRemarks: row.SalesRemarks }),
                updatedAt: new Date()
            };

            const updated = await LeadsModel.findByIdAndUpdate(id, patchFields, {
                new: true
            });

            updated ? updatedCount++ : skipped++;
        }

        res.status(200).json({
            message: "Excel PATCH completed using _id",
            updated: updatedCount,
            skipped
        });

    } catch (error) {
        console.error("Excel PATCH Error:", error);
        res.status(500).json({ message: "Failed to patch leads", error: error.message });
    }
};



export const getAllLeads = async (req, res) => {
    try {
        const leads = await LeadsModel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Leads fetched successfully",
            data: leads
        });
    } catch (error) {
        console.error("Get Leads Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch leads", error: error.message });
    }
};

export const updateLeadById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedLead = await LeadsModel.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: false // skip strict validation since schema is dynamic
        });

        if (!updatedLead) {
            return res.status(404).json({ success: false, message: "Lead not found" });
        }

        res.status(200).json({
            success: true,
            message: "Lead updated successfully",
            data: updatedLead
        });
    } catch (error) {
        console.error("Update Lead Error:", error);
        res.status(500).json({ success: false, message: "Failed to update lead", error: error.message });
    }
};

export const deleteLeadById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedLead = await LeadsModel.findByIdAndDelete(id);

        if (!deletedLead) {
            return res.status(404).json({ success: false, message: "Lead not found" });
        }

        res.status(200).json({
            success: true,
            message: "Lead deleted successfully"
        });
    } catch (error) {
        console.error("Delete Lead Error:", error);
        res.status(500).json({ success: false, message: "Failed to delete lead", error: error.message });
    }
};
