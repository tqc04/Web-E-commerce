package com.example.project.service;

import com.example.project.entity.InventoryItem;
import com.example.project.entity.Product;
import com.example.project.entity.Order;
import com.example.project.entity.OrderItem;
import com.example.project.service.ai.AIService;
import com.example.project.service.ai.VectorStoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class InventoryService {

    @Autowired
    private AIService aiService;

    @Autowired
    private VectorStoreService vectorStoreService;

    /**
     * Dự báo nhu cầu sản phẩm dựa trên AI
     */
    public Map<String, Object> forecastDemand(Long productId, int forecastDays) {
        try {
            // Tạo prompt cho AI dự báo
            String prompt = String.format("""
                Analyze demand patterns for product ID %d over the next %d days.
                Consider factors like:
                - Historical sales data
                - Seasonal trends
                - Market conditions
                - Current inventory levels
                
                Provide forecast in format:
                Expected Daily Demand: [number]
                Confidence Level: [percentage]
                Peak Demand Days: [list]
                Recommendations: [action items]
                """, productId, forecastDays);

            String aiResponse = aiService.generateText(prompt);
            
            // Parse AI response và tạo forecast data
            Map<String, Object> forecast = new HashMap<>();
            forecast.put("productId", productId);
            forecast.put("forecastDays", forecastDays);
            forecast.put("aiAnalysis", aiResponse);
            forecast.put("timestamp", LocalDateTime.now());
            
            // Simulate demand prediction (trong thực tế sẽ dùng ML model)
            Random random = new Random();
            List<Map<String, Object>> dailyForecast = new ArrayList<>();
            
            for (int i = 1; i <= forecastDays; i++) {
                Map<String, Object> dayData = new HashMap<>();
                dayData.put("day", i);
                dayData.put("expectedDemand", 50 + random.nextInt(100));
                dayData.put("confidence", 0.7 + random.nextDouble() * 0.3);
                dailyForecast.add(dayData);
            }
            
            forecast.put("dailyForecast", dailyForecast);
            
            return forecast;
            
        } catch (Exception e) {
            throw new RuntimeException("Error in demand forecasting: " + e.getMessage());
        }
    }

    /**
     * Phân tích tồn kho và đưa ra khuyến nghị
     */
    public Map<String, Object> analyzeInventory(Long productId) {
        try {
            String prompt = String.format("""
                Analyze inventory status for product ID %d:
                
                Analyze:
                - Current stock levels
                - Turnover rate
                - Carrying costs
                - Stockout risk
                - Overstock risk
                
                Provide analysis in format:
                Stock Status: [HEALTHY/WARNING/CRITICAL]
                Reorder Point: [number]
                Optimal Stock Level: [number]
                Actions Required: [list]
                Cost Impact: [analysis]
                """, productId);

            String aiAnalysis = aiService.generateText(prompt);
            
            Map<String, Object> analysis = new HashMap<>();
            analysis.put("productId", productId);
            analysis.put("analysisDate", LocalDateTime.now());
            analysis.put("aiAnalysis", aiAnalysis);
            
            // Simulate inventory metrics
            Random random = new Random();
            analysis.put("currentStock", 100 + random.nextInt(500));
            analysis.put("reorderPoint", 50 + random.nextInt(100));
            analysis.put("optimalStock", 200 + random.nextInt(300));
            analysis.put("turnoverRate", 2.0 + random.nextDouble() * 8.0);
            analysis.put("stockoutRisk", random.nextDouble());
            analysis.put("overstockRisk", random.nextDouble());
            
            return analysis;
            
        } catch (Exception e) {
            throw new RuntimeException("Error in inventory analysis: " + e.getMessage());
        }
    }

    /**
     * Tối ưu hóa tồn kho đa sản phẩm
     */
    public Map<String, Object> optimizeInventoryPortfolio(List<Long> productIds) {
        try {
            String prompt = String.format("""
                Optimize inventory portfolio for %d products:
                
                Consider:
                - Cross-product demand correlation
                - Storage constraints
                - Budget limitations
                - Supply chain efficiency
                - Seasonal variations
                
                Provide optimization strategy:
                Priority Products: [list with reasons]
                Inventory Allocation: [recommendations]
                Cost Reduction Opportunities: [list]
                Risk Mitigation: [strategies]
                """, productIds.size());

            String aiOptimization = aiService.generateText(prompt);
            
            Map<String, Object> optimization = new HashMap<>();
            optimization.put("productIds", productIds);
            optimization.put("optimizationDate", LocalDateTime.now());
            optimization.put("aiOptimization", aiOptimization);
            
            // Simulate optimization results
            List<Map<String, Object>> productOptimization = new ArrayList<>();
            Random random = new Random();
            
            for (Long productId : productIds) {
                Map<String, Object> productData = new HashMap<>();
                productData.put("productId", productId);
                productData.put("currentStock", 100 + random.nextInt(400));
                productData.put("recommendedStock", 150 + random.nextInt(300));
                productData.put("priority", random.nextInt(10) + 1);
                productData.put("expectedSavings", 1000 + random.nextInt(5000));
                productOptimization.add(productData);
            }
            
            optimization.put("productOptimization", productOptimization);
            
            return optimization;
            
        } catch (Exception e) {
            throw new RuntimeException("Error in inventory optimization: " + e.getMessage());
        }
    }

    /**
     * Phát hiện bất thường trong tồn kho
     */
    public List<Map<String, Object>> detectAnomalies(List<Long> productIds) {
        try {
            String prompt = """
                Detect inventory anomalies and unusual patterns:
                
                Look for:
                - Sudden stock changes
                - Unusual demand spikes
                - Slow-moving inventory
                - Discrepancies in stock records
                - Seasonal anomalies
                
                For each anomaly, provide:
                Type: [anomaly type]
                Severity: [HIGH/MEDIUM/LOW]
                Description: [detailed description]
                Recommended Action: [what to do]
                """;

            String aiAnalysis = aiService.generateText(prompt);
            
            List<Map<String, Object>> anomalies = new ArrayList<>();
            Random random = new Random();
            
            // Simulate anomaly detection
            for (Long productId : productIds) {
                if (random.nextDouble() < 0.3) { // 30% chance of anomaly
                    Map<String, Object> anomaly = new HashMap<>();
                    anomaly.put("productId", productId);
                    anomaly.put("type", getRandomAnomalyType());
                    anomaly.put("severity", getRandomSeverity());
                    anomaly.put("detectedAt", LocalDateTime.now());
                    anomaly.put("aiAnalysis", aiAnalysis);
                    anomaly.put("confidence", 0.6 + random.nextDouble() * 0.4);
                    anomalies.add(anomaly);
                }
            }
            
            return anomalies;
            
        } catch (Exception e) {
            throw new RuntimeException("Error in anomaly detection: " + e.getMessage());
        }
    }

    /**
     * Tính toán điểm đặt hàng lại thông minh
     */
    public Map<String, Object> calculateSmartReorderPoint(Long productId) {
        try {
            Map<String, Object> demandForecast = forecastDemand(productId, 30);
            Map<String, Object> inventoryAnalysis = analyzeInventory(productId);
            
            String prompt = String.format("""
                Calculate smart reorder point for product ID %d:
                
                Consider:
                - Lead time variability
                - Demand uncertainty
                - Service level requirements
                - Carrying costs vs stockout costs
                
                Calculate:
                Safety Stock: [amount]
                Reorder Point: [amount]
                Economic Order Quantity: [amount]
                Total Cost Impact: [analysis]
                """, productId);

            String aiCalculation = aiService.generateText(prompt);
            
            Map<String, Object> reorderData = new HashMap<>();
            reorderData.put("productId", productId);
            reorderData.put("calculationDate", LocalDateTime.now());
            reorderData.put("aiCalculation", aiCalculation);
            
            // Simulate reorder calculations
            Random random = new Random();
            reorderData.put("currentReorderPoint", 50 + random.nextInt(100));
            reorderData.put("recommendedReorderPoint", 60 + random.nextInt(120));
            reorderData.put("safetyStock", 20 + random.nextInt(50));
            reorderData.put("economicOrderQuantity", 100 + random.nextInt(200));
            reorderData.put("expectedCostSavings", 500 + random.nextInt(2000));
            
            return reorderData;
            
        } catch (Exception e) {
            throw new RuntimeException("Error in reorder point calculation: " + e.getMessage());
        }
    }

    /**
     * Dự báo xu hướng tồn kho
     */
    public Map<String, Object> predictInventoryTrends(int forecastMonths) {
        try {
            String prompt = String.format("""
                Predict inventory trends for the next %d months:
                
                Analyze:
                - Market trends
                - Seasonal patterns
                - Economic indicators
                - Consumer behavior changes
                - Supply chain disruptions
                
                Provide trends prediction:
                Overall Trend: [direction and magnitude]
                Key Drivers: [list]
                Risk Factors: [list]
                Strategic Recommendations: [actions]
                """, forecastMonths);

            String aiTrends = aiService.generateText(prompt);
            
            Map<String, Object> trends = new HashMap<>();
            trends.put("forecastMonths", forecastMonths);
            trends.put("trendAnalysis", aiTrends);
            trends.put("generatedAt", LocalDateTime.now());
            
            // Simulate trend data
            List<Map<String, Object>> monthlyTrends = new ArrayList<>();
            Random random = new Random();
            
            for (int i = 1; i <= forecastMonths; i++) {
                Map<String, Object> monthData = new HashMap<>();
                monthData.put("month", i);
                monthData.put("expectedDemandGrowth", -0.1 + random.nextDouble() * 0.3);
                monthData.put("inventoryTurnover", 2.0 + random.nextDouble() * 6.0);
                monthData.put("costInflation", random.nextDouble() * 0.1);
                monthlyTrends.add(monthData);
            }
            
            trends.put("monthlyTrends", monthlyTrends);
            
            return trends;
            
        } catch (Exception e) {
            throw new RuntimeException("Error in trend prediction: " + e.getMessage());
        }
    }

    // Helper methods
    private String getRandomAnomalyType() {
        String[] types = {"STOCK_DISCREPANCY", "DEMAND_SPIKE", "SLOW_MOVING", "OVERSTOCK", "UNDERSTOCK"};
        return types[new Random().nextInt(types.length)];
    }

    private String getRandomSeverity() {
        String[] severities = {"HIGH", "MEDIUM", "LOW"};
        return severities[new Random().nextInt(severities.length)];
    }

    /**
     * Tạo báo cáo tồn kho thông minh
     */
    public Map<String, Object> generateInventoryReport(List<Long> productIds) {
        try {
            Map<String, Object> report = new HashMap<>();
            report.put("reportDate", LocalDateTime.now());
            report.put("productCount", productIds.size());
            
            // Tổng hợp dữ liệu từ các phân tích
            List<Map<String, Object>> productAnalyses = new ArrayList<>();
            for (Long productId : productIds) {
                Map<String, Object> analysis = analyzeInventory(productId);
                productAnalyses.add(analysis);
            }
            
            report.put("productAnalyses", productAnalyses);
            
            // Tổng hợp anomalies
            List<Map<String, Object>> anomalies = detectAnomalies(productIds);
            report.put("anomalies", anomalies);
            
            // Dự báo tổng thể
            Map<String, Object> trends = predictInventoryTrends(3);
            report.put("trends", trends);
            
            // Tạo AI summary
            String summaryPrompt = String.format("""
                Generate executive summary for inventory report:
                - %d products analyzed
                - %d anomalies detected
                - 3-month trend forecast included
                
                Provide:
                Key Insights: [main findings]
                Action Items: [priority actions]
                Financial Impact: [cost implications]
                Risk Assessment: [potential risks]
                """, productIds.size(), anomalies.size());

            String aiSummary = aiService.generateText(summaryPrompt);
            report.put("executiveSummary", aiSummary);
            
            return report;
            
        } catch (Exception e) {
            throw new RuntimeException("Error generating inventory report: " + e.getMessage());
        }
    }
} 