# Core Services

This directory contains all core services for the DevOps AI Toolkit.

## Quick Reference

### Where are services defined?

- **CapabilityVectorService** → `capability-vector-service.ts`
- **PatternVectorService** → `pattern-vector-service.ts`
- **PolicyVectorService** → `policy-vector-service.ts`
- **VectorDBService** → `vector-db-service.ts`
- **BaseVectorService** → `base-vector-service.ts`
- **EmbeddingService** → `embedding-service.ts`
- **KubernetesDiscovery** → `discovery.ts`
- **SchemaParser** → `schema.ts`
- **WorkflowEngine** → `workflow.ts`
- **MemorySystem** → `memory.ts`

### Where are services exported?

All public services are exported from `index.ts`:

```typescript
export { CapabilityVectorService, ResourceCapability, CapabilitySearchOptions } from './capability-vector-service';
export { PatternVectorService, PatternSearchOptions, PatternSearchResult } from './pattern-vector-service';
export { PolicyVectorService, PolicySearchOptions, PolicySearchResult } from './policy-vector-service';
export { VectorDBService, VectorDBConfig, VectorDocument, SearchResult } from './vector-db-service';
export { BaseVectorService, BaseSearchOptions, BaseSearchResult } from './base-vector-service';
export { EmbeddingService, EmbeddingConfig, EmbeddingProvider } from './embedding-service';
export { KubernetesDiscovery } from './discovery';
export { SchemaParser, ManifestValidator, ResourceRecommender } from './schema';
export { WorkflowEngine } from './workflow';
export { MemorySystem } from './memory';
// ... and more
```

### How to use services?

Import from the core module:

```typescript
import { CapabilityVectorService } from '../core/index';
// or
import { CapabilityVectorService } from '../core';
```

## Documentation

For comprehensive information about all services:

- **[Core Services Architecture](../../docs/core-services-architecture.md)** - Complete reference guide
- **[Capability Management Guide](../../docs/mcp-capability-management-guide.md)** - Using CapabilityVectorService
- **[Pattern Management Guide](../../docs/pattern-management-guide.md)** - Using PatternVectorService
- **[Policy Management Guide](../../docs/policy-management-guide.md)** - Using PolicyVectorService

## Service Categories

### Vector Database Services
Handle storage and retrieval of organizational data with semantic search:
- `base-vector-service.ts` - Abstract base class
- `capability-vector-service.ts` - Resource capabilities
- `pattern-vector-service.ts` - Deployment patterns
- `policy-vector-service.ts` - Governance policies
- `vector-db-service.ts` - Qdrant client

### AI Services
Provide AI model integration and embeddings:
- `ai-provider.interface.ts` - AI provider interface
- `ai-provider-factory.ts` - Provider factory
- `embedding-service.ts` - Text embeddings
- `providers/` - Specific AI provider implementations

### Discovery Services
Kubernetes cluster and resource discovery:
- `discovery.ts` - Cluster resource discovery
- `schema.ts` - Resource schema parsing
- `kubernetes-utils.ts` - K8s utilities
- `cluster-utils.ts` - Cluster operations

### Operations
High-level business logic:
- `capability-operations.ts` - Capability CRUD
- `pattern-operations.ts` - Pattern management
- `platform-operations.ts` - Platform building
- `capability-scan-workflow.ts` - Scanning orchestration

### Supporting Services
- `workflow.ts` - Workflow orchestration
- `memory.ts` - Session management
- `error-handling.ts` - Error utilities
- `solution-utils.ts` - Solution helpers
