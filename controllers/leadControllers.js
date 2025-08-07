import mongoose from "mongoose";
import xlsx from "xlsx";
import LeadsModel from "../models/leadModel.js";

// create leads via .csv and excel
// export const uploadLeadsFromExcel = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: "No file uploaded" });
//         }

//         // Parse Excel file buffer
//         const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];
//         const rows = xlsx.utils.sheet_to_json(sheet); // auto handles dynamic headers

//         const allowedFields = [
//             "AssignedTeleoperatore",
//             "AssignedSalesperson",
//             "TelecomsRemark",
//             "SalesRemarks"
//         ];
//         const leads = rows.map(row => {
//             const filtered = {};
//             allowedFields.forEach(field => {
//                 filtered[field] = row[field] || "";
//             });
//             filtered.createdBy = req.user?.name || "system";
//             return filtered;
//         });

//         const savedLeads = await LeadsModel.insertMany(leads);

//         res.status(200).json({ message: "Leads uploaded successfully", count: savedLeads.length });
//     } catch (error) {
//         console.error("Excel Upload Error:", error);
//         res.status(500).json({ message: "Failed to upload leads", error: error.message });
//     }
// };

export const uploadLeadsFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read Excel file
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    console.log("📄 Parsed Excel Rows:", rows);

    // Normalize column headers (e.g., "assigned salesperson" → "AssignedSalesperson")
    const normalizeKey = (key) => key?.trim().toLowerCase().replace(/\s+/g, "");

    const allowedFieldsMap = {
      assignedteleoperatore: "AssignedTeleoperatore",
      assignedsalesperson: "AssignedSalesperson",
      telecomsremark: "TelecomsRemark",
      salesremarks: "SalesRemarks",
    };

    const leads = rows.map((row) => {
      const lead = {};
      for (let key in row) {
        const normalized = normalizeKey(key);
        const mappedKey = allowedFieldsMap[normalized];
        if (mappedKey) {
          lead[mappedKey] = row[key] || "";
        }
      }
      lead.createdBy = req.user?.name || "system";
      return lead;
    });

    console.log("📝 Final Leads to Save:", leads);

    const savedLeads = await LeadsModel.insertMany(leads);

    res.status(200).json({
      message: "Leads uploaded successfully",
      count: savedLeads.length,
    });
  } catch (error) {
    console.error("❌ Excel Upload Error:", error);
    res.status(500).json({
      message: "Failed to upload leads",
      error: error.message,
    });
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
