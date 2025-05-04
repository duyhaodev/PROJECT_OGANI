// Tùy chỉnh JavaScript để sử dụng nút tăng/giảm số lượng tự động
$(document).ready(function() {
    // Xóa sự kiện click mặc định từ main.js và thêm sự kiện mới
    $('.pro-qty').off('click', '.qtybtn');
    
    // Thêm sự kiện click mới cho các nút tăng/giảm
    $('.pro-qty').on('click', '.qtybtn', function() {
        var $button = $(this);
        var $input = $button.parent().find('input');
        var oldValue = parseFloat($input.val());
        var itemId = $input.data('item-id');
        var newVal;

        if ($button.hasClass('inc')) {
            newVal = oldValue + 1;
        } else {
            // Không cho phép giảm dưới 1
            newVal = oldValue > 1 ? oldValue - 1 : 1;
        }

        $input.val(newVal);

        // Gọi API để cập nhật số lượng
        updateItemQuantity(itemId, newVal);
    });

    // Hàm cập nhật số lượng sản phẩm
    function updateItemQuantity(itemId, quantity) {
        $.ajax({
            url: `/cart/update/${itemId}`,
            type: 'POST',
            data: { quantity: quantity },
            success: function(response) {
                if (response.success) {
                    // Cập nhật tổng tiền của sản phẩm
                    updateItemTotal(itemId, response.itemTotal);
                    
                    // Cập nhật tổng tiền của giỏ hàng
                    updateCartTotal(response.subtotal);
                    
                    // Cập nhật số lượng sản phẩm trong header
                    updateHeaderCartCount(response.cartCount);
                } else {
                    console.error('Lỗi khi cập nhật số lượng:', response.message);
                }
            },
            error: function(error) {
                console.error('Lỗi khi cập nhật số lượng:', error);
            }
        });
    }

    // Hàm cập nhật tổng tiền của sản phẩm
    function updateItemTotal(itemId, total) {
        var totalElement = $(`.shoping__cart__total[data-item-id="${itemId}"]`);
        if (totalElement.length) {
            totalElement.text('$' + total.toFixed(2));
        }
    }

    // Hàm cập nhật tổng tiền của giỏ hàng
    function updateCartTotal(subtotal) {
        // Cập nhật cả hai phần tử hiển thị tổng tiền
        $('#subtotal').text('$' + subtotal.toFixed(2));
        $('#total').text('$' + subtotal.toFixed(2));
    }
    
    // Hàm cập nhật số lượng sản phẩm trong header
    function updateHeaderCartCount(count) {
        const cartCountElement = $('.header__cart ul li:nth-child(2) span');
        if (cartCountElement.length) {
            cartCountElement.text(count);
        }
    }
});
