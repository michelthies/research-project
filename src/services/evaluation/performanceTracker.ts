// src/services/performanceTracker.ts

export interface PerformanceMetrics {
    promptTokens: number;
    responseTokens: number;
}

export interface OllamaResponse {
    total_duration?: number;
    load_duration?: number;
    prompt_eval_count?: number;
    prompt_eval_duration?: number;
    eval_count?: number;
    eval_duration?: number;
}

export class PerformanceTracker {
    
    /**
     * Track performance based on Ollama's response metrics
     */
    async trackPerformance(
        prompt: string, 
        response: string, 
        startTime: number, 
        ollamaResponse?: OllamaResponse
    ): Promise<PerformanceMetrics> {
        // Initialize with baseline metrics
        const metrics: PerformanceMetrics = {
            // If Ollama metrics are available, use them; otherwise estimate
            promptTokens: ollamaResponse?.prompt_eval_count || this.estimateTokens(prompt),
            responseTokens: ollamaResponse?.eval_count || this.estimateTokens(response)
        };
        
        return metrics;
    }
    
    /**
     * Simple token estimation for when Ollama metrics aren't available
     * This is a fallback and much less accurate than Ollama's counts
     */
    private estimateTokens(text: string): number {
        // Simple approximation: ~4 characters ≈ 1 token for English text
        return Math.ceil(text.length / 4);
    }
    
    /**
     * Summarize performance metrics from multiple requests
     */
    summarizePerformance(metrics: PerformanceMetrics[]): Record<string, number> {
        if (metrics.length === 0) return {};
        
        const result: Record<string, number> = {
            avgPromptTokens: metrics.reduce((sum, m) => sum + m.promptTokens, 0) / metrics.length,
            avgResponseTokens: metrics.reduce((sum, m) => sum + m.responseTokens, 0) / metrics.length,
            totalTokens: metrics.reduce((sum, m) => sum + m.promptTokens + m.responseTokens, 0)
        };
        
        return result;
    }
}