// Hàm tính tổng tiền từ object order
const calculateTotalAmount = (order) => {
    const totalProductAmount = order.product.reduce((sum, item) => 
      sum + item.price * item.quantity, 0
    );
  
    const totalDiscount = (order.promotions || []).reduce((sum, promo) => 
      sum + ((promo.percentDiscount || 0) / 100) * totalProductAmount, 0
    );
  
    const totalWithVAT = totalProductAmount + (order.vat / 100) * totalProductAmount;
  
    const totalAmount = totalWithVAT - totalDiscount + (order.shipping?.shippingFee || 0);
  
    return totalAmount;
  };
  
  // Hàm format order
  const formatOrder = (order) => {
    const totalAmount = calculateTotalAmount(order);
  
    return {
      ...order,
      formattedOrderDate: new Date(order.orderDate).toLocaleString("vi-VN", {
        hour12: false,
        timeZone: "Asia/Ho_Chi_Minh"
      }),
      totalAmount: totalAmount
    };
  };
  
  module.exports = {
    calculateTotalAmount,
    formatOrder
  };