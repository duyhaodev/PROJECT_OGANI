const Order = require("../../models/order.model");
const { calculateTotalAmount, formatOrder } = require("../../config/helper");


//lấy danh sách đơn hàng 
module.exports.order = async (req, res) => {
  try {
    const user = req.session.user || null;
    let find = {};
      if (req.query.status) {
        find.status = req.query.status;
      }

    const orders = await Order.find(find).lean()

    const ordersWithTotal = orders.map(order => formatOrder(order));

       res.render("admin/manage_order", {
      pageTitle: "Trang quản lý đơn hàng",
      user,
      orders: ordersWithTotal
    });


  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng:", error);
    res.status(500).send("Lỗi máy chủ");
  }
};


//lấy chi tiết đơn hàng
module.exports.getOrderDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).lean();

    if (!order) {
      return res.status(404).send("Không tìm thấy đơn hàng");
    }

    const formattedOrder = formatOrder(order);

    res.render("admin/order_detail", {
      pageTitle: "Chi tiết đơn hàng",
      order: formattedOrder
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    res.status(500).send("Lỗi máy chủ");
  }
};




// API cập nhật trạng thái đơn hàng

module.exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
      const order = await Order.findById(id);
      if (!order) {
          return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
      }

      order.status = status;
      await order.save();

      return res.json({ success: true, message: 'Cập nhật trạng thái thành công', updatedStatus: status });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
};


// API áp dụng hành động bulk cho nhiều đơn hàng
module.exports.applyBulkAction = async (req, res) => {
  const { orderIds, newStatus } = req.body;

  if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
    return res.status(400).json({ success: false, message: 'Danh sách ID đơn hàng không hợp lệ' });
  }

  if (!newStatus || typeof newStatus !== 'string') {
    return res.status(400).json({ success: false, message: 'Trạng thái mới không hợp lệ' });
  }

  try {
    
    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      { $set: { status: newStatus } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: 'Không có đơn hàng nào được cập nhật' });
    }

    return res.status(200).json({
      success: true,
      message: `Đã cập nhật trạng thái cho ${result.modifiedCount} đơn hàng`,
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng:", error);
    return res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra khi cập nhật trạng thái' });
  }
};
