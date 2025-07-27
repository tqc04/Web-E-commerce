package com.example.project.repository;

import com.example.project.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import com.example.project.dto.ProductSimpleResponse;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Page<Product> findByIsActiveTrue(Pageable pageable);
    
    Page<Product> findByIsActiveFalse(Pageable pageable);
    
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    
    Page<Product> findByBrandId(Long brandId, Pageable pageable);
    
    Page<Product> findByNameContainingOrDescriptionContaining(String name, String description, Pageable pageable);
    
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    List<Product> findByIsFeaturedTrue();
    
    List<Product> findByIsDigitalTrue();
    
    List<Product> findByIsDigitalFalse();
    
    Optional<Product> findBySku(String sku);
    
    @Query("SELECT p FROM Product p WHERE p.averageRating >= :minRating")
    List<Product> findByMinRating(@Param("minRating") Double minRating);
    
    @Query("SELECT p FROM Product p WHERE p.viewCount >= :minViews")
    List<Product> findByMinViews(@Param("minViews") Long minViews);
    
    @Query("SELECT p FROM Product p WHERE p.purchaseCount >= :minPurchases")
    List<Product> findByMinPurchases(@Param("minPurchases") Long minPurchases);
    
    @Query("SELECT p FROM Product p WHERE p.recommendationScore >= :minScore")
    List<Product> findByMinAIContentScore(@Param("minScore") Double minScore);
    
    @Query("SELECT p FROM Product p WHERE p.recommendationScore >= :minScore")
    List<Product> findByMinRecommendationScore(@Param("minScore") Double minScore);
    
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.isActive = true")
    List<Product> findActiveByCategoryId(@Param("categoryId") Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.brand.id = :brandId AND p.isActive = true")
    List<Product> findActiveByBrandId(@Param("brandId") Long brandId);
    
    @Query("SELECT p FROM Product p WHERE p.price <= :maxPrice AND p.isActive = true")
    List<Product> findActiveByMaxPrice(@Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true ORDER BY p.viewCount DESC")
    List<Product> findMostViewedProducts(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true ORDER BY p.purchaseCount DESC")
    List<Product> findBestSellingProducts(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true ORDER BY p.averageRating DESC")
    List<Product> findTopRatedProducts(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true ORDER BY p.createdAt DESC")
    List<Product> findNewestProducts(Pageable pageable);
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.isActive = true")
    long countActiveProducts();
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = :categoryId AND p.isActive = true")
    long countActiveProductsByCategory(@Param("categoryId") Long categoryId);
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.brand.id = :brandId AND p.isActive = true")
    long countActiveProductsByBrand(@Param("brandId") Long brandId);
    
    @Query("SELECT AVG(p.price) FROM Product p WHERE p.isActive = true")
    BigDecimal getAveragePrice();
    
    @Query("SELECT AVG(p.averageRating) FROM Product p WHERE p.isActive = true AND p.reviewCount > 0")
    Double getAverageRating();
    
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.brand WHERE p.isActive = true")
    List<Product> findActiveProductsWithCategoryAndBrand();
    
    @Query("SELECT p FROM Product p JOIN p.category JOIN p.brand WHERE p.isActive = true")
    List<Product> findActiveProductsAsDTO();

    long countByIsActiveTrue();

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.brand WHERE p.isActive = true")
    List<Product> findAllWithCategory();
    
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.brand WHERE p.isActive = true")
    Page<Product> findActiveWithCategoryAndBrand(Pageable pageable);
    
    @Query("SELECT p FROM Product p JOIN p.category c WHERE c.name = :categoryName AND p.isActive = true")
    Page<Product> findByCategoryNameAndIsActiveTrue(@Param("categoryName") String categoryName, Pageable pageable);
} 