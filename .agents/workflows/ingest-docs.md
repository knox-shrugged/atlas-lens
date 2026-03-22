---
description: Re-parse the atlas-docs and update the Atlas Lens visualization data
---

# Workflow: Ingest Documentation

This workflow triggers the `parse-docs.js` engine to synchronize the `atlas-lens` visualization with the latest strategic content in `atlas-docs`. 

## Execution Steps

### Step 1: Run the Ingestion Script

// turbo
```bash
# Ensure you are in the atlas-lens directory
# Run the ingestion script to regenerate graph_data.json
npm run ingest
```

## Post-Completion Requirements

1. Verify the terminal output displays the number of nodes and edges ingested (e.g., `Ingested X nodes and Y edges.`).
2. Refresh the local Atlas Lens browser page to view the updated graph.
