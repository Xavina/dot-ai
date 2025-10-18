# Core Services Architecture

**Reference guide for all core services in the DevOps AI Toolkit.**

## Overview

This document provides a comprehensive catalog of all core services, their locations, purposes, and relationships. Use this as a reference when working with the codebase or understanding the system architecture.

## Vector Database Services

### CapabilityVectorService

**Location**: `src/core/capability-vector-service.ts`

**Purpose**: Vector-based storage and retrieval for Kubernetes resource capabilities

**Description**: 
- Extends `BaseVectorService` to provide capability-specific operations
- Stores semantic information about what each Kubernetes resource actually does
- Enables intelligent resource matching through semantic search
- Foundation for AI-powered deployment recommendations

**Key Features**:
- Store and retrieve resource capabilities
- Semantic search based on user intent
- Filter by complexity level and providers
- Automatic capability ID generation

**Export**: Available from `src/core/index.ts` as:
```typescript
export { CapabilityVectorService, ResourceCapability, CapabilitySearchOptions } from './capability-vector-service';
```

**Usage Examples**:
```typescript
import { CapabilityVectorService } from '../core/index';

const capabilityService = new CapabilityVectorService('capabilities');
await capabilityService.storeCapability(capability);
const results = await capabilityService.searchCapabilities('postgresql database');
```

**Related Documentation**: 
- [Capability Management Guide](./mcp-capability-management-guide.md)
- [Organizational Data Concepts](./organizational-data-concepts.md)

---

### PatternVectorService

**Location**: `src/core/pattern-vector-service.ts`

**Purpose**: Vector-based storage and retrieval for organizational deployment patterns

**Description**:
- Extends `BaseVectorService` for pattern-specific operations
- Stores organizational best practices for resource combinations
- Enables pattern matching based on deployment intent
- Enhances AI recommendations with institutional knowledge

**Key Features**:
- Store and retrieve deployment patterns
- Semantic search for relevant patterns
- Pattern lifecycle management

**Export**: Available from `src/core/index.ts` as:
```typescript
export { PatternVectorService, PatternSearchOptions, PatternSearchResult } from './pattern-vector-service';
```

**Related Documentation**:
- [Pattern Management Guide](./pattern-management-guide.md)
- [Organizational Data Concepts](./organizational-data-concepts.md)

---

### PolicyVectorService

**Location**: `src/core/policy-vector-service.ts`

**Purpose**: Vector-based storage and retrieval for governance policy intents

**Description**:
- Extends `BaseVectorService` for policy-specific operations
- Stores governance and compliance requirements
- Enables semantic matching of policies to deployment scenarios
- Integrates compliance into AI recommendation workflow

**Key Features**:
- Store and retrieve policy intents
- Semantic search for applicable policies
- Support for Kyverno policy generation
- Policy lifecycle management

**Export**: Available from `src/core/index.ts` as:
```typescript
export { PolicyVectorService, PolicySearchOptions, PolicySearchResult } from './policy-vector-service';
```

**Related Documentation**:
- [Policy Management Guide](./policy-management-guide.md)
- [Organizational Data Concepts](./organizational-data-concepts.md)

---

### BaseVectorService

**Location**: `src/core/base-vector-service.ts`

**Purpose**: Abstract base class providing common vector database operations

**Description**:
- Template for all specialized vector services
- Handles embedding generation and vector storage
- Provides standard CRUD operations for vector data
- Integrates with VectorDBService and EmbeddingService

**Key Features**:
- Abstract methods for service-specific customization
- Standard search, store, retrieve, and delete operations
- Automatic embedding generation
- Pagination support

**Export**: Available from `src/core/index.ts` as:
```typescript
export { BaseVectorService, BaseSearchOptions, BaseSearchResult } from './base-vector-service';
```

---

### VectorDBService

**Location**: `src/core/vector-db-service.ts`

**Purpose**: Direct interface to Qdrant vector database

**Description**:
- Low-level client for Qdrant vector database operations
- Manages collections, points, and search operations
- Provides connection management and error handling
- Foundation for all vector-based services

**Key Features**:
- Collection management (create, delete, check existence)
- Point operations (upsert, retrieve, delete, scroll)
- Vector search with filtering
- Connection pooling and retry logic

**Export**: Available from `src/core/index.ts` as:
```typescript
export { VectorDBService, VectorDBConfig, VectorDocument, SearchResult } from './vector-db-service';
```

**Configuration**:
```typescript
const config: VectorDBConfig = {
  host: process.env.QDRANT_HOST || 'localhost',
  port: parseInt(process.env.QDRANT_PORT || '6333'),
  apiKey: process.env.QDRANT_API_KEY
};
```

---

## AI and Embedding Services

### EmbeddingService

**Location**: `src/core/embedding-service.ts`

**Purpose**: Generate vector embeddings for text using various AI providers

**Description**:
- Supports multiple embedding providers (OpenAI, Anthropic, custom)
- Converts text into vector representations for semantic search
- Manages API credentials and rate limiting
- Provider-agnostic interface for embedding generation

**Key Features**:
- Multi-provider support (OpenAI text-embedding-3-small, Voyage AI, etc.)
- Configurable embedding dimensions
- Batch embedding generation
- Error handling and retry logic

**Export**: Available from `src/core/index.ts` as:
```typescript
export { EmbeddingService, EmbeddingConfig, EmbeddingProvider, OpenAIEmbeddingProvider } from './embedding-service';
```

**Configuration**:
```typescript
const config: EmbeddingConfig = {
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  model: 'text-embedding-3-small'
};
```

**Related Documentation**:
- [MCP Setup Guide - Embedding Provider Configuration](./mcp-setup.md#embedding-provider-configuration)

---

### AIProvider (Interface)

**Location**: `src/core/ai-provider.interface.ts`

**Purpose**: Common interface for AI model providers

**Description**:
- Defines contract for AI provider implementations
- Supports multiple providers (Anthropic Claude, OpenAI, etc.)
- Standardizes AI interaction across the platform
- Enables provider-agnostic AI operations

**Export**: Available from `src/core/index.ts` as:
```typescript
export { AIProvider, AIResponse, IntentAnalysisResult, AIProviderConfig } from './ai-provider.interface';
```

---

### AIProviderFactory

**Location**: `src/core/ai-provider-factory.ts`

**Purpose**: Factory for creating AI provider instances

**Description**:
- Creates appropriate AI provider based on configuration
- Handles provider selection and initialization
- Manages API credentials
- Provides fallback and error handling

**Export**: Available from `src/core/index.ts` as:
```typescript
export { createAIProvider, AIProviderFactory } from './ai-provider-factory';
```

**Related Documentation**:
- [MCP Setup Guide - AI Model Configuration](./mcp-setup.md#ai-model-configuration)

---

## Discovery and Schema Services

### KubernetesDiscovery

**Location**: `src/core/discovery.ts`

**Purpose**: Discover and analyze Kubernetes cluster resources

**Description**:
- Connects to Kubernetes clusters
- Discovers available API resources and CRDs
- Retrieves resource schemas and explanations
- Foundation for capability scanning

**Key Features**:
- Cluster connectivity management
- API resource enumeration
- Resource schema retrieval via kubectl explain
- CRD and operator detection

**Export**: Available from `src/core/index.ts` as:
```typescript
export { KubernetesDiscovery } from './discovery';
```

---

### SchemaParser

**Location**: `src/core/schema.ts`

**Purpose**: Parse and analyze Kubernetes resource schemas

**Description**:
- Parses kubectl explain output
- Extracts resource structure and fields
- Provides schema information to AI for recommendations
- Integrates with CapabilityVectorService for enhanced understanding

**Export**: Available from `src/core/index.ts` as:
```typescript
export { SchemaParser, ManifestValidator, ResourceRecommender } from './schema';
```

---

## Capability Operations

### Capability Operations Module

**Location**: `src/core/capability-operations.ts`

**Purpose**: High-level operations for capability management

**Description**:
- Provides convenient functions for capability CRUD operations
- Integrates CapabilityVectorService with other services
- Handles capability scanning workflows
- Used by MCP tools and CLI commands

**Key Functions**:
- `getCapabilityService()` - Get or create CapabilityVectorService instance
- `storeCapabilityData()` - Store capability with validation
- `searchCapabilities()` - Search with intent and filters
- `listAllCapabilities()` - Retrieve all stored capabilities
- `deleteCapability()` - Remove specific capability

**Import**: Not exported from index.ts, used internally

---

### Capability Scan Workflow

**Location**: `src/core/capability-scan-workflow.ts`

**Purpose**: Orchestrate the capability scanning process

**Description**:
- Manages the multi-step capability discovery workflow
- Coordinates between discovery, AI analysis, and storage
- Handles user interactions for manual scanning mode
- Provides progress tracking and session management

**Key Features**:
- Auto and manual scanning modes
- Progress monitoring
- Session state management
- Error handling and recovery

**Import**: Not exported from index.ts, used internally by tools

---

## Pattern and Policy Operations

### Pattern Operations Module

**Location**: `src/core/pattern-operations.ts`

**Purpose**: High-level operations for pattern management

**Description**:
- Pattern validation and creation
- Serialization/deserialization
- Integration with PatternVectorService
- Used by MCP tools for pattern management

**Export**: Available from `src/core/index.ts` as:
```typescript
export { validatePattern, createPattern, serializePattern, deserializePattern } from './pattern-operations';
```

---

### Platform Operations Module

**Location**: `src/core/platform-operations.ts`

**Purpose**: Platform building and infrastructure operations

**Description**:
- Discovers available platform operations from infrastructure scripts
- Provides AI-powered intent mapping
- Orchestrates platform tool installations
- Manages cluster creation workflows

**Import**: Not exported from index.ts, used internally by tools

---

## Workflow and Memory Services

### WorkflowEngine

**Location**: `src/core/workflow.ts`

**Purpose**: Orchestrate multi-step deployment workflows

**Description**:
- Manages deployment workflow state
- Coordinates between discovery, AI, and execution
- Handles user interactions and decision points
- Tracks workflow progress

**Export**: Available from `src/core/index.ts` as:
```typescript
export { WorkflowEngine } from './workflow';
```

---

### MemorySystem

**Location**: `src/core/memory.ts`

**Purpose**: Session and context management

**Description**:
- Stores conversation context
- Manages deployment sessions
- Provides context for AI interactions
- Enables resumable workflows

**Export**: Available from `src/core/index.ts` as:
```typescript
export { MemorySystem } from './memory';
```

---

## Service Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│              (MCP Tools, CLI Commands, REST API)              │
└───────────────────┬─────────────────────────────────────────┘
                    │
┌───────────────────┴─────────────────────────────────────────┐
│                  High-Level Operations                        │
│  (capability-operations, pattern-operations,                 │
│   capability-scan-workflow, platform-operations)             │
└───────────────────┬─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┬──────────────┬──────────────┐
        │                       │              │              │
┌───────▼──────────┐  ┌────────▼────────┐  ┌──▼────────┐  ┌──▼────────┐
│ Vector Services  │  │  AI Services    │  │ Discovery │  │ Workflow  │
│ CapabilityVector │  │  AIProvider     │  │ K8s       │  │ Memory    │
│ PatternVector    │  │  Embedding      │  │ Schema    │  │           │
│ PolicyVector     │  │                 │  │           │  │           │
└────────┬─────────┘  └────────┬────────┘  └───────────┘  └───────────┘
         │                     │
         │                     │
    ┌────▼─────────────────────▼──┐
    │   Infrastructure Services   │
    │   BaseVectorService         │
    │   VectorDBService (Qdrant)  │
    └─────────────────────────────┘
```

## Service Dependencies

### Vector Services Hierarchy

```
BaseVectorService (abstract)
    ├── CapabilityVectorService
    ├── PatternVectorService
    └── PolicyVectorService

All depend on:
    - VectorDBService (Qdrant connection)
    - EmbeddingService (text → vectors)
```

### AI Services Stack

```
AIProvider (interface)
    └── Implementations:
        ├── AnthropicProvider
        ├── OpenAIProvider
        └── VercelProvider

EmbeddingService
    └── Providers:
        ├── OpenAIEmbeddingProvider
        └── Custom providers
```

## Common Service Patterns

### Service Initialization

Most services follow this pattern:

```typescript
// 1. Import from core
import { CapabilityVectorService } from '../core/index';

// 2. Create instance with optional config
const service = new CapabilityVectorService('collection-name');

// 3. Use service operations
await service.storeCapability(data);
const results = await service.searchCapabilities(intent);
```

### Service Configuration

Services typically use environment variables:

```bash
# Vector DB
QDRANT_HOST=localhost
QDRANT_PORT=6333
QDRANT_API_KEY=your_key

# AI Providers
ANTHROPIC_API_KEY=your_key
OPENAI_API_KEY=your_key

# Embedding
OPENAI_API_KEY=your_key  # for embeddings
```

## See Also

### User-Facing Documentation
- [Capability Management Guide](./mcp-capability-management-guide.md)
- [Pattern Management Guide](./pattern-management-guide.md)
- [Policy Management Guide](./policy-management-guide.md)
- [Organizational Data Concepts](./organizational-data-concepts.md)

### Technical Documentation
- [MCP Setup Guide](./mcp-setup.md) - Service configuration
- [Integration Testing Guide](./integration-testing-guide.md) - Testing services
- [MCP Tools Overview](./mcp-tools-overview.md) - Tools using these services

### Code References
- `src/core/index.ts` - Service exports and main DotAI class
- `src/tools/` - MCP tools using core services
- `tests/integration/` - Service integration tests

---

*Last Updated: 2025-10-18*  
*Version: 1.0*
