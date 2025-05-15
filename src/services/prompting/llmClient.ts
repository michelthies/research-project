// src/services/prompting/llmClient.ts

import { OllamaResponse } from '../evaluation/performanceTracker';

interface OllamaResponseData {
  response: string;
  model?: string;
  created_at?: string;
  done?: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export class LLMClient {
    private promptResponseLog: string = "";
    private lastOllamaResponse: OllamaResponse | null = null;
    
    async queryModel(prompt: string, modelName: string = "llama3"): Promise<string> {
      // Reset lastOllamaResponse for new query
      this.lastOllamaResponse = null;
      
      // Add this console log to debug
      console.log("LLMClient: Adding to log, current size:", this.promptResponseLog.length);
      
      try {
        // Make sure to add the prompt to the log BEFORE the request
        this.logPrompt(prompt);
        
        console.log("LLMClient: Added prompt to log, new size:", this.promptResponseLog.length);
        
        const response = await fetch("http://localhost:11434/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: modelName,
            prompt: prompt,
            stream: false,
            options: {
              temperature: 0.1,
              top_p: 0.9,
              num_predict: 2048,
            },
          }),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          this.logResponse(`ERROR: HTTP status ${response.status}: ${errorText}`);
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }
  
        const data = await response.json() as OllamaResponseData;
        
        // Store Ollama metrics from response
        this.lastOllamaResponse = {
          total_duration: data.total_duration,
          load_duration: data.load_duration,
          prompt_eval_count: data.prompt_eval_count,
          prompt_eval_duration: data.prompt_eval_duration,
          eval_count: data.eval_count,
          eval_duration: data.eval_duration
        };
        
        // Log the response AFTER receiving it
        this.logResponse(data.response);
        
        console.log("LLMClient: Added response to log, new size:", this.promptResponseLog.length);
        
        return data.response;
      } catch (error) {
        console.error("Error querying LLM:", error);
        // Log the error too
        this.logResponse(`ERROR: ${error}`);
        throw error;
      }
    }
    
    getLastOllamaResponse(): OllamaResponse | null {
      return this.lastOllamaResponse;
    }
    
    private logPrompt(prompt: string): void {
      // Since the log might be initialized as "", make sure to append properly
      if (this.promptResponseLog.length > 0) {
        this.promptResponseLog += "\n\n";
      }
      this.promptResponseLog += "==================== PROMPT ====================\n\n";
      this.promptResponseLog += prompt;
    }
    
    private logResponse(response: string): void {
      this.promptResponseLog += "\n\n==================== RESPONSE ====================\n\n";
      this.promptResponseLog += response;
    }
    
    getLog(): string {
      // Debug output
      console.log("LLMClient.getLog called, log size:", this.promptResponseLog.length);
      return this.promptResponseLog;
    }
}