/**
 * Memory System Module
 * 
 * Handles learning, context management, and recommendation storage
 */

export interface SuccessPattern {
  type: string;
  config: any;
  timestamp: Date;
}

export interface FailurePattern {
  type: string;
  config: any;
  error: string;
  timestamp: Date;
}

export interface Recommendation {
  suggestion: string;
  confidence: number;
  based_on: string[];
}

export class MemorySystem {
  private storage: Map<string, any> = new Map();
  private successPatterns: Map<string, SuccessPattern[]> = new Map();
  private failurePatterns: Map<string, FailurePattern[]> = new Map();
  private context: Map<string, any> = new Map();
  private initialized: boolean = false;

  async initialize(): Promise<void> {
    // Initialize storage (in production, this would connect to persistent storage)
    this.initialized = true;
  }

  async store(key: string, data: any): Promise<void> {
    this.storage.set(key, data);
  }

  async retrieve(key: string): Promise<any> {
    return this.storage.get(key) || null;
  }

  async learnSuccess(type: string, config: any): Promise<void> {
    const pattern: SuccessPattern = {
      type,
      config,
      timestamp: new Date()
    };

    const existing = this.successPatterns.get(type) || [];
    existing.push(pattern);
    this.successPatterns.set(type, existing);
  }

  async learnFailure(type: string, config: any, error: string): Promise<void> {
    const pattern: FailurePattern = {
      type,
      config,
      error,
      timestamp: new Date()
    };

    const existing = this.failurePatterns.get(type) || [];
    existing.push(pattern);
    this.failurePatterns.set(type, existing);
  }

  async getSuccessPatterns(type: string): Promise<SuccessPattern[]> {
    return this.successPatterns.get(type) || [];
  }

  async getFailurePatterns(type: string): Promise<FailurePattern[]> {
    return this.failurePatterns.get(type) || [];
  }

  async getRecommendations(type: string, partialConfig: any): Promise<Recommendation[]> {
    const successPatterns = await this.getSuccessPatterns(type);
    const recommendations: Recommendation[] = [];

    // Simple recommendation algorithm
    for (const pattern of successPatterns) {
      const similarity = this.calculateSimilarity(partialConfig, pattern.config);
      if (similarity >= 0.5) {
        recommendations.push({
          suggestion: `Consider using configuration similar to successful ${type}`,
          confidence: similarity,
          based_on: [`Success pattern from ${pattern.timestamp.toISOString()}`]
        });
      }
    }

    return recommendations;
  }

  async storePattern(type: string, pattern: any): Promise<void> {
    // Store pattern as a success by default
    await this.learnSuccess(type, pattern);
  }

  async retrievePattern(type: string): Promise<any[]> {
    const patterns = await this.getSuccessPatterns(type);
    return patterns.map(p => p.config);
  }

  async storeLessons(type: string, lessons: any): Promise<void> {
    // Store lessons in the general storage
    await this.store(`lessons-${type}`, lessons);
  }

  private calculateSimilarity(config1: any, config2: any): number {
    // Simple similarity calculation
    const keys1 = Object.keys(config1);
    const keys2 = Object.keys(config2);
    const commonKeys = keys1.filter(key => keys2.includes(key));
    
    if (keys1.length === 0 && keys2.length === 0) return 1;
    if (keys1.length === 0 || keys2.length === 0) return 0;
    
    return commonKeys.length / Math.max(keys1.length, keys2.length);
  }

  async setContext(key: string, value: any): Promise<void> {
    this.context.set(key, value);
  }

  async getContext(): Promise<Record<string, any>> {
    const result: Record<string, any> = {};
    for (const [key, value] of this.context.entries()) {
      result[key] = value;
    }
    return result;
  }

  async clearContext(key?: string): Promise<void> {
    if (key) {
      this.context.delete(key);
    } else {
      this.context.clear();
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
} 