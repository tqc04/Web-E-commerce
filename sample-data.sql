-- Sample Data for E-commerce Backend Testing

-- Insert Categories
INSERT INTO categories (id, name, description, slug, is_active, sort_order, created_at, updated_at) VALUES
(1, 'Electronics', 'Electronic devices and gadgets', 'electronics', true, 1, NOW(), NOW()),
(2, 'Gaming', 'Gaming products and accessories', 'gaming', true, 2, NOW(), NOW()),
(3, 'Computers', 'Computers and computer accessories', 'computers', true, 3, NOW(), NOW()),
(4, 'Mobile', 'Mobile phones and accessories', 'mobile', true, 4, NOW(), NOW()),
(5, 'Audio', 'Audio devices and accessories', 'audio', true, 5, NOW(), NOW());

-- Insert Brands
INSERT INTO brands (id, name, description, website_url, is_active, created_at, updated_at) VALUES
(1, 'TechBrand', 'Leading technology brand', 'https://techbrand.com', true, NOW(), NOW()),
(2, 'GameMaster', 'Professional gaming equipment', 'https://gamemaster.com', true, NOW(), NOW()),
(3, 'SoundWave', 'Premium audio solutions', 'https://soundwave.com', true, NOW(), NOW()),
(4, 'MobileTech', 'Mobile device specialists', 'https://mobiletech.com', true, NOW(), NOW()),
(5, 'ComputeMax', 'High-performance computing', 'https://computemax.com', true, NOW(), NOW());

-- Insert Products
INSERT INTO products (id, name, description, ai_generated_description, sku, price, original_price, 
                     category_id, brand_id, is_active, is_featured, average_rating, review_count, 
                     view_count, purchase_count, created_at, updated_at) VALUES
(1, 'Gaming Laptop Pro', 'High-performance gaming laptop with RTX 4060', 
   'Experience ultimate gaming performance with this cutting-edge laptop featuring powerful graphics and lightning-fast processing.', 
   'LAPTOP-001', 1299.99, 1499.99, 2, 1, true, true, 4.5, 25, 150, 12, NOW(), NOW()),
(2, 'Wireless Gaming Mouse', 'Precision gaming mouse with RGB lighting', 
   'Dominate your games with this ultra-precise wireless gaming mouse featuring customizable RGB lighting and ergonomic design.', 
   'MOUSE-001', 79.99, 99.99, 2, 2, true, true, 4.8, 45, 300, 35, NOW(), NOW()),
(3, 'Mechanical Keyboard', 'RGB mechanical keyboard with cherry switches', 
   'Type with confidence using this premium mechanical keyboard with responsive cherry switches and stunning RGB backlighting.', 
   'KEYBOARD-001', 129.99, 149.99, 2, 2, true, false, 4.7, 18, 200, 22, NOW(), NOW()),
(4, 'Gaming Headset', 'Surround sound gaming headset with noise cancellation', 
   'Immerse yourself in crystal-clear audio with this professional gaming headset featuring advanced noise cancellation technology.', 
   'HEADSET-001', 89.99, 109.99, 5, 3, true, true, 4.6, 30, 180, 28, NOW(), NOW()),
(5, 'Smartphone Pro', 'Latest smartphone with AI camera', 
   'Capture life in stunning detail with this flagship smartphone featuring advanced AI-powered camera technology and premium build quality.', 
   'PHONE-001', 799.99, 899.99, 4, 4, true, true, 4.4, 50, 500, 45, NOW(), NOW());

-- Insert Users
INSERT INTO users (id, username, email, password, first_name, last_name, is_active, is_email_verified, 
                  personalization_enabled, chatbot_enabled, recommendation_enabled, created_at, updated_at) VALUES
(1, 'testuser', 'test@example.com', '$2a$10$NlMl0mFJBrKTOqOYfCmOFuPQEcPL7T6LHCJMjWkfgZHDHDgmJUhR6', 
   'Test', 'User', true, true, true, true, true, NOW(), NOW()),
(2, 'gamer123', 'gamer@example.com', '$2a$10$NlMl0mFJBrKTOqOYfCmOFuPQEcPL7T6LHCJMjWkfgZHDHDgmJUhR6', 
   'Gaming', 'Enthusiast', true, true, true, true, true, NOW(), NOW()),
(3, 'techfan', 'tech@example.com', '$2a$10$NlMl0mFJBrKTOqOYfCmOFuPQEcPL7T6LHCJMjWkfgZHDHDgmJUhR6', 
   'Tech', 'Fan', true, false, true, true, true, NOW(), NOW());

-- Insert User Preferences
INSERT INTO user_preferences (user_id, preference) VALUES
(1, 'electronics'), (1, 'gaming'), (1, 'technology'),
(2, 'gaming'), (2, 'esports'), (2, 'hardware'),
(3, 'smartphones'), (3, 'computers'), (3, 'gadgets');

-- Insert User Interests
INSERT INTO user_interests (user_id, interest) VALUES
(1, 'gaming laptops'), (1, 'mechanical keyboards'), (1, 'RGB lighting'),
(2, 'FPS games'), (2, 'gaming mice'), (2, 'competitive gaming'),
(3, 'mobile photography'), (3, 'latest tech'), (3, 'innovation');

-- Insert Product Images
INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, sort_order, created_at, updated_at) VALUES
(1, 1, 'https://example.com/images/laptop1.jpg', 'Gaming Laptop Pro - Front View', true, 1, NOW(), NOW()),
(2, 1, 'https://example.com/images/laptop2.jpg', 'Gaming Laptop Pro - Side View', false, 2, NOW(), NOW()),
(3, 2, 'https://example.com/images/mouse1.jpg', 'Wireless Gaming Mouse - Top View', true, 1, NOW(), NOW()),
(4, 3, 'https://example.com/images/keyboard1.jpg', 'Mechanical Keyboard - RGB', true, 1, NOW(), NOW()),
(5, 4, 'https://example.com/images/headset1.jpg', 'Gaming Headset - Side View', true, 1, NOW(), NOW());

-- Insert Product Reviews
INSERT INTO product_reviews (id, product_id, user_id, rating, title, content, verified_purchase, 
                           is_approved, sentiment_score, sentiment_label, created_at, updated_at) VALUES
(1, 1, 1, 5, 'Excellent gaming laptop!', 'This laptop performs amazingly well in all games. Great build quality and fast delivery!', 
   true, true, 0.95, 'POSITIVE', NOW(), NOW()),
(2, 2, 2, 5, 'Perfect gaming mouse', 'The precision is incredible and the RGB lighting is beautiful. Highly recommended!', 
   true, true, 0.92, 'POSITIVE', NOW(), NOW()),
(3, 3, 1, 4, 'Good keyboard but noisy', 'Great typing experience but the switches are quite loud. Good value for money.', 
   true, true, 0.65, 'MIXED', NOW(), NOW()),
(4, 4, 3, 5, 'Amazing sound quality', 'Crystal clear audio and comfortable to wear for long gaming sessions.', 
   true, true, 0.88, 'POSITIVE', NOW(), NOW()),
(5, 5, 2, 4, 'Great phone overall', 'Camera quality is impressive but battery life could be better.', 
   true, true, 0.70, 'MIXED', NOW(), NOW());

-- Insert Inventory Items
INSERT INTO inventory_items (id, product_id, warehouse_location, quantity_on_hand, quantity_available, 
                           reorder_point, reorder_quantity, demand_forecast_7_days, demand_forecast_30_days, 
                           created_at, updated_at) VALUES
(1, 1, 'WH-001', 25, 23, 10, 20, 3, 12, NOW(), NOW()),
(2, 2, 'WH-001', 100, 95, 20, 50, 8, 30, NOW(), NOW()),
(3, 3, 'WH-001', 50, 48, 15, 30, 5, 20, NOW(), NOW()),
(4, 4, 'WH-001', 75, 70, 25, 40, 6, 25, NOW(), NOW()),
(5, 5, 'WH-002', 40, 35, 12, 25, 4, 18, NOW(), NOW());

-- Insert Orders
INSERT INTO orders (id, order_number, user_id, order_status, subtotal, total_amount, 
                   shipping_address, billing_address, payment_method, fraud_score, risk_level, 
                   created_at, updated_at) VALUES
(1, 'ORD-001', 1, 'DELIVERED', 1299.99, 1299.99, 
   '123 Test St, Test City, 12345', '123 Test St, Test City, 12345', 'CREDIT_CARD', 0.2, 'LOW', NOW(), NOW()),
(2, 'ORD-002', 2, 'PROCESSING', 79.99, 79.99, 
   '456 Game Ave, Gaming City, 67890', '456 Game Ave, Gaming City, 67890', 'PAYPAL', 0.1, 'LOW', NOW(), NOW()),
(3, 'ORD-003', 3, 'PENDING', 799.99, 799.99, 
   '789 Tech Blvd, Tech Town, 11111', '789 Tech Blvd, Tech Town, 11111', 'CREDIT_CARD', 0.3, 'LOW', NOW(), NOW());

-- Insert Order Items
INSERT INTO order_items (id, order_id, product_id, quantity, price, created_at, updated_at) VALUES
(1, 1, 1, 1, 1299.99, NOW(), NOW()),
(2, 2, 2, 1, 79.99, NOW(), NOW()),
(3, 3, 5, 1, 799.99, NOW(), NOW());

-- Insert Chat Sessions
INSERT INTO chat_sessions (id, user_id, session_id, session_status, title, ai_model, 
                          total_tokens_used, total_cost, created_at, updated_at) VALUES
(1, 1, 'CHAT-001', 'ACTIVE', 'Gaming Laptop Help', 'gpt-4', 150, 0.003, NOW(), NOW()),
(2, 2, 'CHAT-002', 'ENDED', 'Mouse Recommendations', 'gpt-4', 200, 0.004, NOW(), NOW()),
(3, 3, 'CHAT-003', 'ACTIVE', 'Smartphone Questions', 'gpt-4', 100, 0.002, NOW(), NOW());

-- Insert Chat Messages
INSERT INTO chat_messages (id, chat_session_id, message_type, content, tokens_used, ai_model, created_at) VALUES
(1, 1, 'USER', 'Hello, I need help finding a gaming laptop', 10, NULL, NOW()),
(2, 1, 'ASSISTANT', 'Hello! I\'d be happy to help you find the perfect gaming laptop. What\'s your budget range and what games do you plan to play?', 25, 'gpt-4', NOW()),
(3, 2, 'USER', 'What gaming mice do you recommend?', 8, NULL, NOW()),
(4, 2, 'ASSISTANT', 'Based on your preferences, I recommend our Wireless Gaming Mouse with RGB lighting. It offers excellent precision and customizable features perfect for competitive gaming.', 30, 'gpt-4', NOW());

-- Insert User Behaviors
INSERT INTO user_behaviors (id, user_id, product_id, behavior_type, session_id, 
                           duration_seconds, page_url, created_at) VALUES
(1, 1, 1, 'PRODUCT_VIEW', 'session-001', 45, '/products/1', NOW()),
(2, 1, 1, 'ADD_TO_CART', 'session-001', 5, '/products/1', NOW()),
(3, 2, 2, 'PRODUCT_VIEW', 'session-002', 30, '/products/2', NOW()),
(4, 2, 2, 'PRODUCT_LIKE', 'session-002', 2, '/products/2', NOW()),
(5, 3, 5, 'PRODUCT_VIEW', 'session-003', 60, '/products/5', NOW());

-- Update sequences to avoid conflicts
ALTER SEQUENCE categories_id_seq RESTART WITH 6;
ALTER SEQUENCE brands_id_seq RESTART WITH 6;
ALTER SEQUENCE products_id_seq RESTART WITH 6;
ALTER SEQUENCE users_id_seq RESTART WITH 4;
ALTER SEQUENCE product_images_id_seq RESTART WITH 6;
ALTER SEQUENCE product_reviews_id_seq RESTART WITH 6;
ALTER SEQUENCE inventory_items_id_seq RESTART WITH 6;
ALTER SEQUENCE orders_id_seq RESTART WITH 4;
ALTER SEQUENCE order_items_id_seq RESTART WITH 4;
ALTER SEQUENCE chat_sessions_id_seq RESTART WITH 4;
ALTER SEQUENCE chat_messages_id_seq RESTART WITH 5;
ALTER SEQUENCE user_behaviors_id_seq RESTART WITH 6; 