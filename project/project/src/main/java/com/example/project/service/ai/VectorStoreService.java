package com.example.project.service.ai;

import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.document.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class VectorStoreService {
    
    @Autowired(required = false)
    private VectorStore vectorStore;
    
    @Autowired
    private AIService aiService;
    
    /**
     * Store document with embedding
     */
    public void storeDocument(String id, String content, Map<String, Object> metadata) {
        try {
            metadata = new HashMap<>(metadata); // Make mutable copy
            metadata.put("id", id); // Store ID in metadata
            Document document = new Document(content, metadata);
            
            vectorStore.add(List.of(document));
        } catch (Exception e) {
            throw new VectorStoreException("Failed to store document: " + e.getMessage(), e);
        }
    }
    
    /**
     * Store multiple documents with embeddings
     */
    public void storeDocuments(List<DocumentData> documents) {
        if (vectorStore == null) {
            System.out.println("Vector store is not available. Skipping document storage.");
            return;
        }
        
        try {
            List<Document> docs = documents.stream()
                    .map(doc -> {
                        Map<String, Object> metadata = new HashMap<>(doc.getMetadata());
                        metadata.put("id", doc.getId());
                        return new Document(doc.getContent(), metadata);
                    })
                    .toList();
            
            vectorStore.add(docs);
        } catch (Exception e) {
            throw new VectorStoreException("Failed to store documents: " + e.getMessage(), e);
        }
    }
    
        /**
     * Search similar documents by text query
     */
    public List<Document> searchSimilar(String query, int limit) {
        if (vectorStore == null) {
            System.out.println("Vector store is not available. Returning empty results.");
            return List.of();
        }
        
        try {
            SearchRequest request = SearchRequest.query(query).withTopK(limit);
            return vectorStore.similaritySearch(request);
        } catch (Exception e) {
            throw new VectorStoreException("Failed to search similar documents: " + e.getMessage(), e);
        }
    }

    /**
     * Search similar documents by text query with threshold
     */
    public List<Document> searchSimilar(String query, int limit, double threshold) {
        if (vectorStore == null) {
            System.out.println("Vector store is not available. Returning empty results.");
            return List.of();
        }
        
        try {
            SearchRequest request = SearchRequest.query(query).withTopK(limit).withSimilarityThreshold(threshold);
            return vectorStore.similaritySearch(request);
        } catch (Exception e) {
            throw new VectorStoreException("Failed to search similar documents with threshold: " + e.getMessage(), e);
        }
    }
    
    /**
     * Delete document by ID
     */
    public void deleteDocument(String id) {
        try {
            vectorStore.delete(List.of(id));
        } catch (Exception e) {
            throw new VectorStoreException("Failed to delete document: " + e.getMessage(), e);
        }
    }
    
    /**
     * Delete multiple documents by IDs
     */
    public void deleteDocuments(List<String> ids) {
        try {
            vectorStore.delete(ids);
        } catch (Exception e) {
            throw new VectorStoreException("Failed to delete documents: " + e.getMessage(), e);
        }
    }
    
    /**
     * Update document content and metadata
     */
    public void updateDocument(String id, String content, Map<String, Object> metadata) {
        try {
            // Delete old document
            deleteDocument(id);
            
            // Add updated document
            storeDocument(id, content, metadata);
        } catch (Exception e) {
            throw new VectorStoreException("Failed to update document: " + e.getMessage(), e);
        }
    }
    
    /**
     * Store product embedding for recommendations
     */
    public void storeProductEmbedding(Long productId, String productName, String description, 
                                    String category, String brand, List<String> tags) {
        try {
            String content = String.format("%s %s %s %s %s", 
                    productName, description, category, brand, String.join(" ", tags));
            
            Map<String, Object> metadata = Map.of(
                    "type", "product",
                    "productId", productId,
                    "productName", productName,
                    "category", category,
                    "brand", brand,
                    "tags", tags
            );
            
            storeDocument("product_" + productId, content, metadata);
        } catch (Exception e) {
            throw new VectorStoreException("Failed to store product embedding: " + e.getMessage(), e);
        }
    }
    
    /**
     * Store user behavior embedding
     */
    public void storeUserBehaviorEmbedding(Long userId, String behaviorType, 
                                         String productInfo, Map<String, Object> context) {
        try {
            String content = String.format("%s %s %s", 
                    behaviorType, productInfo, context.toString());
            
            Map<String, Object> metadata = Map.of(
                    "type", "user_behavior",
                    "userId", userId,
                    "behaviorType", behaviorType,
                    "timestamp", System.currentTimeMillis()
            );
            metadata.putAll(context);
            
            String id = String.format("behavior_%d_%d", userId, System.currentTimeMillis());
            storeDocument(id, content, metadata);
        } catch (Exception e) {
            throw new VectorStoreException("Failed to store user behavior embedding: " + e.getMessage(), e);
        }
    }
    
    /**
     * Find similar products for recommendation
     */
    public List<Document> findSimilarProducts(String query, int limit) {
        try {
            List<Document> results = searchSimilar(query, limit * 2); // Get more results to filter
            
            return results.stream()
                    .filter(doc -> "product".equals(doc.getMetadata().get("type")))
                    .limit(limit)
                    .toList();
        } catch (Exception e) {
            throw new VectorStoreException("Failed to find similar products: " + e.getMessage(), e);
        }
    }
    
    /**
     * Find products based on user preferences
     */
    public List<Document> findProductsForUser(Long userId, List<String> preferences, 
                                            String category, int limit) {
        try {
            String query = String.join(" ", preferences);
            if (category != null && !category.isEmpty()) {
                query += " " + category;
            }
            
            List<Document> results = findSimilarProducts(query, limit * 2);
            
            // Filter out products user might have already interacted with
            return results.stream()
                    .limit(limit)
                    .toList();
        } catch (Exception e) {
            throw new VectorStoreException("Failed to find products for user: " + e.getMessage(), e);
        }
    }
    
    /**
     * Get embedding vector for text
     */
    public List<Double> getEmbeddingVector(String text) {
        return aiService.generateEmbedding(text);
    }
    
    /**
     * Calculate similarity between two texts
     */
    public double calculateSimilarity(String text1, String text2) {
        try {
            List<Double> embedding1 = aiService.generateEmbedding(text1);
            List<Double> embedding2 = aiService.generateEmbedding(text2);
            
            return cosineSimilarity(embedding1, embedding2);
        } catch (Exception e) {
            throw new VectorStoreException("Failed to calculate similarity: " + e.getMessage(), e);
        }
    }
    
    /**
     * Calculate cosine similarity between two vectors
     */
    private double cosineSimilarity(List<Double> vector1, List<Double> vector2) {
        if (vector1.size() != vector2.size()) {
            throw new IllegalArgumentException("Vectors must have the same dimension");
        }
        
        double dotProduct = 0.0;
        double norm1 = 0.0;
        double norm2 = 0.0;
        
        for (int i = 0; i < vector1.size(); i++) {
            dotProduct += vector1.get(i) * vector2.get(i);
            norm1 += Math.pow(vector1.get(i), 2);
            norm2 += Math.pow(vector2.get(i), 2);
        }
        
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }
    
    // Inner classes
    public static class DocumentData {
        private final String id;
        private final String content;
        private final Map<String, Object> metadata;
        
        public DocumentData(String id, String content, Map<String, Object> metadata) {
            this.id = id;
            this.content = content;
            this.metadata = metadata;
        }
        
        public String getId() { return id; }
        public String getContent() { return content; }
        public Map<String, Object> getMetadata() { return metadata; }
    }
    
    public static class VectorStoreException extends RuntimeException {
        public VectorStoreException(String message, Throwable cause) {
            super(message, cause);
        }
    }
} 