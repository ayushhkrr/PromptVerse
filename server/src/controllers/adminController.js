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
      totalUsers,
      activeBuyers,
      activeSellers,
      bannedUsers,
      deletedUsers,
      orderCount,
      revenueResult,
      totalPrompts,
      approvedPrompts,
      pendingPrompts,
      rejectedPrompts,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "buyer", status: "active" }),
      User.countDocuments({ role: "seller", status: "active" }),
      User.countDocuments({ status: "banned" }),
      User.countDocuments({ status: "deleted" }),
      Order.countDocuments(),
      Order.aggregate(revenuePipeline),
      Prompt.countDocuments(),
      Prompt.countDocuments({ status: "approved" }),
      Prompt.countDocuments({ status: "pending" }),
      Prompt.countDocuments({ status: "rejected" }),
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    res.status(200).json({
      totalUsers,
      Buyers: activeBuyers,
      Sellers: activeSellers,
      bannedUsers,
      deletedUsers,
      totalOrders: orderCount,
      totalRevenue,
      totalPrompts,
      approvedPrompts,
      pendingPrompts,
      rejectedPrompts,
    });
  } catch (e) {
    console.error(e.stack);
    return res.status(500).json({ message: "Server Error!" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find().select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);
    res.status(200).json({
      message: "All users fetched successfully",
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        limit,
      },
    });
  } catch (e) {
    console.error(e.stack);
    return res.status(500).json({ message: "Server error!" });
  }
};
