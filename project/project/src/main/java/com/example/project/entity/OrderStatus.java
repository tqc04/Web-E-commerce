package com.example.project.entity;

public enum OrderStatus {
    PENDING,           // Đơn hàng vừa được tạo
    PENDING_APPROVAL,  // Chờ admin duyệt
    APPROVED,          // Admin đã duyệt
    CONFIRMED,         // Xác nhận thanh toán
    PROCESSING,        // Đang xử lý/đóng gói
    SHIPPED,           // Đã giao cho shipper
    DELIVERED,         // Đã giao thành công
    COMPLETED,         // Hoàn thành (customer xác nhận)
    CANCELLED,         // Đã hủy
    REFUNDED          // Đã hoàn tiền
} 