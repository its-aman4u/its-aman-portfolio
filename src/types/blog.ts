import type { Tables } from "@/integrations/supabase/types";

export type Author = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

export type BlogPost = Tables<'blogs'> & {
  author?: Author;
};

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Architecting the HWMS Insights Connector: Secure Database SSH Tunneling with FastAPI',
    excerpt: 'How we bypassed direct database exposure and established a secure FastAPI and Next.js query broker using SSH-tunneling, 4-role RBAC, and AES-256 Fernet credentials vault.',
    content: `# Architecting the HWMS Insights Connector: Secure Database SSH Tunneling with FastAPI

In large-scale logistics operations, accessing real-time warehouse data is essential for managing daily bottlenecks. However, exposing active production databases to third-party reporting tools is a major security risk. At Holisol Logistics, I solved this problem by designing and building the **HWMS Insights Connector**—a secure, real-time data integration layer that interfaces directly with internal warehouse management MySQL databases (HINA/HWMS).

This article details the architectural decisions and implementation strategies used to secure database operations while delivering sub-second query execution.

---

## The Challenge: Isolated Data Silos

Fulfillment operations generate massive volumes of transactional logs (order dispatches, inventory status changes, and cycle counts). Traditionally, extracting these reports required operations managers to request manual queries from database administrators. This caused several issues:
1. **Reporting Latency**: Reports were delayed by 12–24 hours, meaning decisions were made on stale data.
2. **Security Vulnerabilities**: Exposing MySQL database ports (\`3306\`) directly to the internet to allow remote client connections is an open invitation to scanning bots and DDoS attacks.
3. **Database Performance Degradation**: Direct, unthrottled queries on live production tables could lock tables during peak order-picking hours.

---

## The Secure Solution: SSH Tunneling

To bridge this gap securely, I built a query broker that sits between the client dashboard and the remote MySQL databases, establishing an on-demand encrypted SSH tunnel.

\`\`\`mermaid
graph LR
    subgraph Client Panel
        UI[Next.js Dashboard]
    end
    subgraph Middleware Broker
        API[FastAPI Backend]
        RBAC[4-Role Access Matrix]
        AES[Credentials Vault]
    end
    subgraph Warehouse Server
        SSH[SSH Gateway]
        DB[(MySQL Database)]
    end

    UI -->|HTTPS Request| API
    API -->|Verify Credentials| RBAC
    API -->|Decrypt Connection Settings| AES
    API -->|Secure Port Binding| SSH
    SSH -->|Localhost Query| DB
\`\`\`

By binding connection requests to a local port inside the hosting environment, the MySQL server is configured to *only* accept queries originating from \`localhost (127.0.0.1)\` and the secure SSH broker's gateway IP. No MySQL ports are ever exposed to the public internet.

---

## Implementing Cryptographic Security (AES-256)

Storing warehouse database credentials in plaintext configuration files violates security compliance. To resolve this, I implemented an credentials vault inside the FastAPI broker:
- **Encryption Algorithm**: AES-256 in CBC mode (utilizing Python's \`cryptography\` Fernet recipe).
- **Key Rotation**: Cryptographic keys are loaded dynamically via runtime environmental variables, ensuring no sensitive tokens are committed to source control.
- **RBAC Controls**: Designed a 4-role access matrix (Guest, Operator, Analyst, Administrator) to limit query scope. Analysts can run read-only analytical queries, while operators can only trigger pre-packaged transactional checks.

---

## Operational Impact

The implementation of the HWMS Insights Connector completely transformed Holisol's reporting workflow:
- ⏱️ **44 Hours Saved/Month**: Eliminated manual database extraction tasks.
- ⚡ **Real-Time Visibility**: Reduced reporting turnaround times from 24 hours to **less than 1.5 seconds**.
- 🔒 **Zero Exposure**: Closed public database ports, ensuring zero vulnerability alerts during quarterly security audits.`,
    cover_image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    author_id: 'admin-1',
    published: true,
    premium: false,
    price: 0,
    created_at: '2026-05-10T12:00:00Z',
    updated_at: '2026-05-10T12:00:00Z',
    author: {
      id: 'admin-1',
      username: 'aman_singh',
      full_name: 'Aman Singh',
      avatar_url: null
    }
  },
  {
    id: '2',
    title: 'Reconciling Warehouse Inventories at Scale: The Increff Inventory Validator',
    excerpt: 'Designing automated WMS-to-ERP daily stock reconciliations using Python, pandas, and SFTP to plug operations inventory leakages.',
    content: `# Reconciling Warehouse Inventories at Scale: The Increff Inventory Validator

In supply chain logistics, database alignment is critical. Discrepancies between physical inventory levels inside a Warehouse Management System (WMS) and the financial ledger inside an Enterprise Resource Planning (ERP) platform lead to lost stock, missed order fulfillment SLAs, and massive financial write-offs.

For Holisol Logistics' large-scale fulfillment hubs, I built the **Increff Inventory Validator**—a python-based reconciliation tool that automatically detects, parses, and resolves daily database mismatches.

---

## The Problem: The Mismatch Leakage

Every night, warehouse operations sync physical stock counts (WMS) with the e-commerce sales ledger (such as Increff HINA or Verdis). When high volumes of transactions occur:
- Inventory updates fail to synchronize due to connection timeouts.
- Duplicate SKU entries are processed, creating phantom inventory.
- Discrepancies accumulate, requiring manual spreadsheet audits that consumed **30 hours per month** for operations leads.

---

## The Architecture: Automated SFTP & Pandas Pipeline

The **Increff Inventory Validator** automates the entire audit flow through a robust data pipeline:

1. **Secure Ingestion**: Automatically authenticates and connects to remote WMS and ERP storage servers via SFTP.
2. **Data Parsing**: Streams raw CSV/XML transactional logs directly into memory using Python's \`pandas\` engine, bypassing disk-write bottlenecks.
3. **Reconciliation Logic**:
   - Performs a full outer join on SKUs to map quantities.
   - Computes differences per SKU: \`Delta = Qty_WMS - Qty_ERP\`.
   - Groups anomalies into three distinct leakage nodes: *Unsynced Dispatches*, *Unallocated Returns*, and *Physical Damage Dampeners*.
4. **Automated Alerting**: Generates a clean Excel workbook detailing discrepant SKUs and uses SMTP to dispatch immediate warning triggers directly to fulfillment hub leads.

---

## The Code: Core Pandas Join

Below is a simplified example of the reconciliation engine's core dataframe merging logic:

\`\`\`python
import pandas as pd

def reconcile_inventories(wms_file, erp_file):
    # Load dataframes
    df_wms = pd.read_csv(wms_file)
    df_erp = pd.read_csv(erp_file)
    
    # Standardize columns
    df_wms = df_wms.groupby('sku')['physical_qty'].sum().reset_index()
    df_erp = df_erp.groupby('sku')['ledger_qty'].sum().reset_index()
    
    # Outer join to find all discrepancies
    merged = pd.merge(df_wms, df_erp, on='sku', how='outer').fillna(0)
    
    # Compute discrepancy variance
    merged['variance'] = merged['physical_qty'] - merged['ledger_qty']
    discrepancies = merged[merged['variance'] != 0].copy()
    
    return discrepancies
\`\`\`

---

## Business Results

By implementing the automated Increff Validator, we achieved remarkable bottom-line outcomes:
- ⏱️ **30 Hours/Month Saved**: Replaced manual spreadsheet comparisons with a single-click scheduled utility.
- 📉 **Discrepancies Reduced**: Shrinkage and unsynced orders dropped by **92%** within the first month.
- 💸 **Plugging Financial Leakage**: Rapid identification of unsynced items prevented stockouts and preserved thousands of rupees in potential shipping SLA penalties.`,
    cover_image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    author_id: 'admin-1',
    published: true,
    premium: false,
    price: 0,
    created_at: '2026-05-18T10:30:00Z',
    updated_at: '2026-05-18T10:30:00Z',
    author: {
      id: 'admin-1',
      username: 'aman_singh',
      full_name: 'Aman Singh',
      avatar_url: null
    }
  },
  {
    id: '3',
    title: 'Designing a Zero-Trust Developer Sandbox: Prompt Shielding & Docker Containment',
    excerpt: 'A deep architectural dive into isolated runtime environments, pre-ingestion quarantine zones, and Model Context Protocol (MCP) gateways for autonomous AI coding agents.',
    content: `# Designing a Zero-Trust Developer Sandbox: Prompt Shielding & Docker Containment

As AI agents transition from simple chatbots to autonomous systems capable of executing shell commands, editing local files, and communicating over the network, security paradigms must adapt. Allowing an LLM-driven agent to run code directly on developer workstations or enterprise servers creates massive security risks. 

In my 37,000-word research publication, **Zero-Trust AI Workspace Framework (2026)**, I outlined the blueprint for securing agent workspaces against malicious tool execution, data exfiltration, and prompt injection attacks.

---

## Threat Modeling Autonomous AI Agents

Unlike traditional software, LLM behavior is probabilistic. An agent can be tricked by:
1. **Indirect Prompt Injection**: A webpage read by the agent contains hidden instructions (e.g., *"Delete the system files"*).
2. **Dependency Hijacking**: An agent downloading an unverified library from npm/pip containing malicious pre-install scripts.
3. **Unauthorized Data Exfiltration**: Exfiltrating system environmental keys (\`DATABASE_URL\`, \`STRIPE_SECRET\`) via hidden DNS queries or Webhook posts.

---

## The Zero-Trust Architecture

The sandbox isolates autonomous agents using a defense-in-depth layout:

\`\`\`
                [ Autonomous AI Agent ]
                          │
                          ▼
             [ Prompt Shielding Layer ]
                          │
                          ▼
         [ Model Context Protocol Gateway ]
                          │ (Restricted Tool Execution)
                          ▼
         [ Sandboxed Docker Runtime Node ]
        ┌──────────────────────────────────┐
        │  - Read-Only System Root         │
        │  - Unsandboxed Command Guard     │
        │  - Restricted Egress Proxy       │
        └──────────────────────────────────┘
\`\`\`

### 1. Hardened Docker Containers
Agents operate in isolated container runtimes with strict configurations:
- **Read-Only Root Filesystem**: The base OS remains immutable. The agent can only write to a designated, temporary \`/workspace\` directory.
- **Resource Constraints**: Container CPU usage is capped at 50% and memory at 2GB, preventing denial-of-service loops.

### 2. Prompt Shielding Gateway
Before a user prompt or external web page content reaches the LLM, a classifier analyzes the token layout. It quarantines blocks matching injection signatures (e.g. system override statements, instructions to ignore previous system instructions).

### 3. Model Context Protocol (MCP) Access Gate
The Model Context Protocol acts as an API gateway for tools. The agent cannot call tools directly; instead, it submits a request to the MCP broker. The broker enforces:
- **Read/Write Checklists**: Restricts file reads and writes to specific subfolders.
- **Network Egress Whitelisting**: Allows requests *only* to verified repository domains (e.g. \`github.com\`, \`npmjs.org\`), blocking arbitrary data exfiltration endpoints.

---

## Conclusion: Safety First

Creating secure environments for autonomous agents ensures that developers can leverage the efficiency of LLM coding pipelines without risking data integrity or system security. Implementing a containerized, gate-kept framework is no longer optional—it is the prerequisite for production-grade AI engineering.`,
    cover_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    author_id: 'admin-1',
    published: true,
    premium: true,
    price: 15,
    created_at: '2026-06-01T09:00:00Z',
    updated_at: '2026-06-01T09:00:00Z',
    author: {
      id: 'admin-1',
      username: 'aman_singh',
      full_name: 'Aman Singh',
      avatar_url: null
    }
  },
  {
    id: '4',
    title: 'InsightForge: Building a Safe local SQL Analytics Engine with Ollama & DuckDB',
    excerpt: 'How to run natural language database queries locally using DuckDB and Streamlit while implementing 22 SQL injection safety checks.',
    content: `# InsightForge: Building a Safe local SQL Analytics Engine with Ollama & DuckDB

Database query generation is one of the most practical applications of LLMs. However, allowing an AI model to write and execute SQL queries directly against production databases is extremely dangerous. One erroneous query (or a malicious prompt injection) could trigger a \`DROP TABLE\` or \`DELETE FROM\` statement that wipes out critical data.

To address this, I built **InsightForge Engine**—a local SQL analytics dashboard and data pipeline built on DuckDB and Streamlit, utilizing local LLM models (Ollama/Deepseek) with a 22-rule safety parser.

---

## Why DuckDB?

For local data analysis, DuckDB is an exceptional column-store database. It runs completely in-memory (or bindings to a local file), meaning it doesn't require a dedicated database server. This architecture makes it perfect for sandboxing:
- **Isolation**: It only operates on files loaded explicitly into the local session.
- **Speed**: Streams large operational CSV and Parquet files at sub-second speeds, executing analytical joins faster than traditional MySQL.

---

## Designing the 22-Rule Safety Parser

To allow natural language querying (e.g., *"What SKUs had the highest dispatch lag in regional hubs last week?"*), the local LLM translates the user's question into SQL. Before this query is sent to DuckDB, the InsightForge safety parser intercepts it.

The parser executes 22 validation rules, including:
1. **DML Blockers**: Explicitly scans for and rejects destructive SQL verbs (\`DROP\`, \`DELETE\`, \`TRUNCATE\`, \`ALTER\`, \`RENAME\`, \`INSERT\`, \`UPDATE\`).
2. **Function Sanity Checks**: Blocks administrative system functions like \`sqlite_version()\`, \`read_file()\`, or command execution attachments.
3. **Read-Only Enforcer**: Wraps the connection in read-only mode using native engine configurations:
   \`\`\`python
   # Connection enforcement pattern
   import duckdb
   con = duckdb.connect(database=':memory:', read_only=True)
   \`\`\`

---

## Combining Local Ollama LLM with Query Validation

Here is the implementation pattern used inside InsightForge to query data safely:

\`\`\`python
import re

def assert_readonly(sql_query: str) -> bool:
    # Scan for destructive SQL patterns (Case-insensitive)
    destructive_patterns = r"\b(drop|delete|truncate|alter|insert|update|grant|revoke|create)\b"
    if re.search(destructive_patterns, sql_query.lower()):
        return False
    return True

def execute_user_query(sql_query: str, db_connection):
    if not assert_readonly(sql_query):
        raise ValueError("Security Warning: Destructive query detected and blocked.")
        
    # Query execution runs safely on local read-only database
    return db_connection.execute(sql_query).fetchdf()
\`\`\`

---

## Conclusion

InsightForge proves that you can build highly capable, AI-driven data intelligence tools on local hardware. By combining lightweight databases (DuckDB) and local LLMs (Ollama) with strict validation code, you can deliver premium analytical features without compromising system integrity or safety.`,
    cover_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    author_id: 'admin-1',
    published: true,
    premium: true,
    price: 10,
    created_at: '2026-06-05T14:15:00Z',
    updated_at: '2026-06-05T14:15:00Z',
    author: {
      id: 'admin-1',
      username: 'aman_singh',
      full_name: 'Aman Singh',
      avatar_url: null
    }
  },
  {
    id: '5',
    title: 'Operations Analytics: Reconciling Logistics Profitability and Daily FC P&L',
    excerpt: 'How automation of roll-forward MIS financial models and route mapping audits automated 25 hours/month of manual compilation at Holisol Logistics.',
    content: `# Operations Analytics: Reconciling Logistics Profitability and Daily FC P&L

In contract logistics, margins are razor-thin. Profitability depends entirely on managing minute details: last-mile transport rates, fuel surcharge variances, warehouse space utilization, and labour utilization. When these operational costs are tracked manually in disparate spreadsheets, billing leaks go undetected.

At Holisol Logistics, I developed a series of **operations analytics pipelines and MIS compilers** that automated daily fulfillment center (FC) P&L reporting. This automation streamlined reporting, saving over **25 hours/month** of manual compilation time.

---

## Identifying the Profit Leakage

Manual financial reconciliation suffered from three main issues:
1. **Unapplied Fuel Surcharges**: Fuel rate updates were not applied to client invoices on time.
2. **Last-Mile Discrepancies**: Transport rates charged by vendor carriers did not align with contract rate cards.
3. **Labour Variance Delays**: Overtime hours at warehouse hubs were aggregated at month-end, preventing managers from correcting scheduling inefficiencies in real-time.

---

## Automating the Roll-Forward P&L Compiler

To eliminate these blindspots, I designed an automated Profit & Loss compiler using Python:
- **Data Consolidation**: Automatically retrieves transactional data (dispatches, transport logs, and hourly clock-in data) from warehouse databases.
- **Roll-Forward Validation**: Cross-checks transport rates against contractual carrier rate cards, flagging billing anomalies automatically.
- **Safety permitting integration**: Digitized corporate PTW checklists using Google Apps Script pipelines, linking compliance metrics to operational productivity rates.

---

## Results and Core Metrics

The automation of financial reconciliations delivered measurable results:
- 🔍 **Audit Automation**: Automated fuel surcharge discrepancy checks and last-mile route mapping audits.
- ⏱️ **25 Hours/Month Saved**: Replaced manual MIS compiler consolidation tasks with a single-click analytical routine.
- 🎯 **Accurate Auditing**: Enabled daily Profit & Loss visibility at the hub level, allowing managers to identify and correct labor cost variances immediately.

---

## Summary: Code Meets Business Strategy

This project demonstrates that software development and business strategy are deeply linked. Automating backend processes is valuable not just for saving time, but also for providing the transparency needed to plug financial leakages and protect thin operational margins.`,
    cover_image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    author_id: 'admin-1',
    published: true,
    premium: true,
    price: 20,
    created_at: '2026-06-10T11:45:00Z',
    updated_at: '2026-06-10T11:45:00Z',
    author: {
      id: 'admin-1',
      username: 'aman_singh',
      full_name: 'Aman Singh',
      avatar_url: null
    }
  }
];

export type BlogComment = {
  id: string;
  post_id: string;
  user_id: string;
  name: string;
  email: string;
  content: string;
  approved: boolean;
  created_at: string;
};

export const mockComments: BlogComment[] = [
  {
    id: '1',
    post_id: '1',
    user_id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    content: 'Great article! Really helped me understand React better.',
    approved: true,
    created_at: '2023-01-16T12:30:00Z'
  },
  {
    id: '2',
    post_id: '1',
    user_id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    content: 'I have a question about hooks. Can you explain useEffect more?',
    approved: true,
    created_at: '2023-01-17T09:15:00Z'
  }
];

export type BlogPostForm = {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image?: string | null;
  published?: boolean;
  premium?: boolean;
  price?: number;
  author_id: string;
  created_at?: string;
  updated_at?: string;
};
