import Approval from "../models/Approval.js";

// Create approval request manually (Postman or Admin UI)
export const createApproval = async (req, res) => {
  try {
    const { memberId, purpose, amount } = req.body;
    const approval = await Approval.create({
      member: memberId,
      purpose,
      amount
    });
    res.status(201).json({ message: "Approval created", approval });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// List approvals with optional filters
// controllers/approvalController.js
export const listApprovals = async (req, res) => {
  try {
    const { status, dateRange } = req.query;
    let query = {};
    if (status) query.status = status;   // ✅ works for ?status=pending

    if (dateRange === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      query.submittedAt = { $gte: start };
    }

    if (dateRange === "thisMonth") {
      const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      query.submittedAt = { $gte: start };
    }

    const approvals = await Approval.find(query).populate("member", "name email");
    res.json({ approvals });   // ✅ always wrap in object
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
// Bulk deny selected approvals
export const bulkDeny = async (req, res) => {
  try {
    const { ids } = req.body; // array of approval IDs
    const result = await Approval.updateMany(
      { _id: { $in: ids } },
      { $set: { status: "denied" } }
    );
    res.json({ message: "Bulk denied", result });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
export const bulkUpdate = async (req, res) => {
  try {
    const { ids, status } = req.body; // status: "approved" or "denied"
    const result = await Approval.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    );
    res.json({ message: `Bulk ${status}`, result });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};



// Approve or deny a single request
export const updateApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "approved" or "denied"
    const approval = await Approval.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ message: "Updated", approval });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Bulk approve selected approvals
export const bulkApprove = async (req, res) => {
  try {
    const { ids } = req.body; // array of approval IDs
    const result = await Approval.updateMany(
      { _id: { $in: ids } },
      { $set: { status: "approved" } }
    );
    res.json({ message: "Bulk approved", result });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
