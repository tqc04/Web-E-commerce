package com.example.project;

import com.example.project.entity.*;
import com.example.project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class ProjectApplication {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BrandRepository brandRepository;

    public static void main(String[] args) {
        SpringApplication.run(ProjectApplication.class, args);
    }
    
    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Initialize test data if database is empty
            if (productRepository.count() == 0) {
                initializeTestData();
            }
        };
    }
    
    private void initializeTestData() {
        System.out.println("Initializing test data...");
        
        // Create categories
        Category electronics = new Category();
        electronics.setName("Electronics");
        electronics.setDescription("Electronic devices and gadgets");
        electronics = categoryRepository.save(electronics);
        
        Category clothing = new Category();
        clothing.setName("Clothing");
        clothing.setDescription("Fashion and apparel");
        clothing = categoryRepository.save(clothing);
        
        Category books = new Category();
        books.setName("Books");
        books.setDescription("Books and literature");
        books = categoryRepository.save(books);
        
        // Create brands
        Brand apple = new Brand();
        apple.setName("Apple");
        apple.setDescription("Apple Inc.");
        apple = brandRepository.save(apple);
        
        Brand samsung = new Brand();
        samsung.setName("Samsung");
        samsung.setDescription("Samsung Electronics");
        samsung = brandRepository.save(samsung);
        
        Brand nike = new Brand();
        nike.setName("Nike");
        nike.setDescription("Nike Inc.");
        nike = brandRepository.save(nike);
        
        // Create test products
        List<Product> products = Arrays.asList(
            createProduct("iPhone 15 Pro", "Latest iPhone with advanced features", BigDecimal.valueOf(999.99), electronics, apple, 50),
            createProduct("Samsung Galaxy S24", "Premium Android smartphone", BigDecimal.valueOf(899.99), electronics, samsung, 45),
            createProduct("MacBook Pro M3", "Professional laptop for developers", BigDecimal.valueOf(1999.99), electronics, apple, 30),
            createProduct("Nike Air Max", "Comfortable running shoes", BigDecimal.valueOf(129.99), clothing, nike, 100),
            createProduct("iPad Air", "Lightweight tablet for productivity", BigDecimal.valueOf(599.99), electronics, apple, 60),
            createProduct("Samsung TV 65\"", "4K Smart TV with amazing picture quality", BigDecimal.valueOf(1299.99), electronics, samsung, 25),
            createProduct("Nike Sportswear", "Comfortable athletic wear", BigDecimal.valueOf(79.99), clothing, nike, 150),
            createProduct("The Great Gatsby", "Classic American novel", BigDecimal.valueOf(12.99), books, null, 200),
            createProduct("AirPods Pro", "Wireless earbuds with noise cancellation", BigDecimal.valueOf(249.99), electronics, apple, 80),
            createProduct("Samsung Watch", "Smartwatch with health tracking", BigDecimal.valueOf(299.99), electronics, samsung, 40),
            createProduct("Nike Basketball Shoes", "Professional basketball shoes", BigDecimal.valueOf(159.99), clothing, nike, 75),
            createProduct("To Kill a Mockingbird", "Harper Lee's masterpiece", BigDecimal.valueOf(9.99), books, null, 180),
            createProduct("iMac 27\"", "All-in-one desktop computer", BigDecimal.valueOf(1799.99), electronics, apple, 20),
            createProduct("Samsung Tablet", "Android tablet for entertainment", BigDecimal.valueOf(399.99), electronics, samsung, 55),
            createProduct("Nike Training Shorts", "Comfortable training shorts", BigDecimal.valueOf(49.99), clothing, nike, 120),
            createProduct("1984", "George Orwell's dystopian novel", BigDecimal.valueOf(11.99), books, null, 160),
            createProduct("Apple Watch", "Smartwatch with health features", BigDecimal.valueOf(399.99), electronics, apple, 35),
            createProduct("Samsung Soundbar", "Premium sound system", BigDecimal.valueOf(499.99), electronics, samsung, 30),
            createProduct("Nike Running Jacket", "Lightweight running jacket", BigDecimal.valueOf(89.99), clothing, nike, 90),
            createProduct("Pride and Prejudice", "Jane Austen's classic", BigDecimal.valueOf(8.99), books, null, 140)
        );
        
        productRepository.saveAll(products);
        System.out.println("Test data initialized successfully! Created " + products.size() + " products.");
    }
    
    private Product createProduct(String name, String description, BigDecimal price, Category category, Brand brand, int stock) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setCategory(category);
        product.setBrand(brand);
        product.setStockQuantity(stock);
        product.setIsActive(true);
        product.setIsFeatured(false);
        product.setIsDigital(false);
        product.setSku("SKU-" + System.currentTimeMillis() % 10000);
        product.setAverageRating(4.5);
        product.setReviewCount(10);
        product.setViewCount(100L);
        product.setPurchaseCount(50L);
        product.setRecommendationScore(0.8);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        return product;
    }
}