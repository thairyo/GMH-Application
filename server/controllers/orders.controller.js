import { OrdersModel } from "../models/orders.model.js";

export const addOrders = async (req, res) => {
  try {
    const { userId, items, total, products } = req.body;

    const data = await OrdersModel.create({
      userId,
      items,
      total,
      products,
    });
    res.status(200).json({ success: true, message: data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await OrdersModel.find({ userId: userId }).sort({
      date: -1,
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orders = await OrdersModel.find({ _id: orderId });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
