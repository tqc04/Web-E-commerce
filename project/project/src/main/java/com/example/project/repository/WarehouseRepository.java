package com.example.project.repository;

import com.example.project.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    // Đã bỏ isDefault, không cần method này nữa
} 