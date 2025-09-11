import Balance from "../models/Balance.js";

// Add balance to a member
export const addBalance = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { amount } = req.body;

    let balance = await Balance.findOne({ member: memberId });
    if (!balance) {
      balance = await Balance.create({ member: memberId, amount });
    } else {
      balance.amount += amount;
      await balance.save();
    }

    res.json({ message: "Balance updated", balance });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Get balance of a member
export const getBalance = async (req, res) => {
  try {
    const { memberId } = req.params;
    const balance = await Balance.findOne({ member: memberId }) || { amount: 0 };
    res.json(balance);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
