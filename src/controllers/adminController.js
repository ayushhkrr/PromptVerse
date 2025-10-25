import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Prompt from "../models/promptModel.js";

export const getStats = async (req, res) => {
  try {
    const revenuePipeline = [
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
        },
      },
    ];

    const [
      activeBuyers,
      activeSellers,
      bannedUsers,
      deletedUsers,
      orderCount,
      revenueResult,
      approvedPrompts,
      pendingPrompts,
      rejectedPrompts,
    ] = await Promise.all([
      User.countDocuments({ role: "buyer", status: "active" }),
      User.countDocuments({ role: "seller", status: "active" }),
      User.countDocuments({ status: "banned" }),
      User.countDocuments({ status: "deleted" }),
      Order.countDocuments(),
      Order.aggregate(revenuePipeline),
      Prompt.countDocuments({ status: "approved" }),
      Prompt.countDocuments({ status: "pending" }),
      Prompt.countDocuments({ status: "rejected" }),
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    res.status(200).json({
      Buyers: activeBuyers,
      Sellers: activeSellers,
      bannedUsers,
      deletedUsers,
      totalOrders: orderCount,
      totalRevenue,
      approvedPrompts,
      pendingPrompts,
      rejectedPrompts,
    });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json({ message: "Server Error!" });
  }
};
