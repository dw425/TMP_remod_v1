# Blueprint Marketplace 2.0 — Addendum: Integrations, Secure Content & Databricks Deployment

**Extends**: Blueprint_Marketplace_2.0_Master_Plan.md
**Covers**: bpcs.com integration hooks, secure GitHub content delivery, notebook/product storage, IP protection, and Databricks workspace deployment

---

## PART A: BPCS.COM INTEGRATION LAYER

### A.1 Why This Matters

The marketplace currently has 20+ hardcoded links to bpcs.com subpages (data-migration, genai, databricks, contact, etc.). When you eventually consolidate or redesign bpcs.com, every link will need updating. The integration layer solves this by centralizing all cross-site references and preparing hooks for deeper integrations.

### A.2 Cross-Site Configuration (Single Source of Truth)

```typescript
// src/config/bpcs.ts
// ALL bpcs.com references live here — change once, updates everywhere

export const BPCS = {
  // Base
  baseUrl: 'https://bpcs.com',

  // Navigation links (used in Header MegaMenu)
  nav: {
    home: 'https://bpcs.com',
    contact: 'https://bpcs.com/contact',
    caseStudies: 'https://bpcs.com/case-studies',
    about: 'https://bpcs.com/about',
  },

  // Service pages (used in product pages, footer, migration)
  services: {
    dataMigration: 'https://bpcs.com/data-migration',
    dataGovernance: 'https://bpcs.com/data-governance',
    dataManagement: 'https://bpcs.com/data-management',
    dataPlatform: 'https://bpcs.com/data-platform-modernization',
    dataScience: 'https://bpcs.com/data-science',
    appDev: 'https://bpcs.com/application-development',
    cloud: 'https://bpcs.com/cloud-and-infrastructure',
    genai: 'https://bpcs.com/genai',
    databricks: 'https://bpcs.com/databricks',
    databricksSql: 'https://bpcs.com/databricks-sql',
    lakehouse: 'https://bpcs.com/lakehouse-optimization',
    futureProofing: 'https://bpcs.com/future-proofing',
    productization: 'https://bpcs.com/productization',
    tcoPlanning: 'https://bpcs.com/tco-planning',
    intelligentSop: 'https://bpcs.com/intelligent-sop',
    videoAnalytics: 'https://bpcs.com/video-analytics',
  },

  // API hooks (for future backend integration)
  api: {
    baseUrl: import.meta.env.VITE_BPCS_API_URL || 'https://api.bpcs.com',
    leads: '/v1/leads',           // POST new lead from contact form
    customers: '/v1/customers',   // GET customer data for logged-in users
    sso: '/v1/auth/sso',         // SSO token exchange
    crm: '/v1/crm/sync',         // Sync marketplace activity to CRM
  },

  // SSO settings (for future unified auth)
  sso: {
    enabled: import.meta.env.VITE_BPCS_SSO_ENABLED === 'true',
    provider: 'auth0',           // Shared Auth0 tenant
    returnUrl: 'https://marketplace.bpcs.com/auth/callback',
  },
} as const;
```

### A.3 Cross-Site Navigation Component

```typescript
// src/components/composed/Header/BPCSLink.tsx
// Smart component that handles cross-site links with analytics

import { useTrack } from '@/features/analytics/useTrack';
import { BPCS } from '@/config/bpcs';

interface BPCSLinkProps {
  href: string;                    // Must be a BPCS config value
  children: React.ReactNode;
  className?: string;
  trackLabel?: string;             // Analytics label
}

export function BPCSLink({ href, children, className, trackLabel }: BPCSLinkProps) {
  const track = useTrack();

  function handleClick() {
    track('bpcs_link_clicked', {
      destination: href,
      label: trackLabel || href,
      source: window.location.pathname,
    });
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
```

### A.4 Future SSO Bridge Hook

```typescript
// src/features/auth/useBPCSAuth.ts
// Hook ready for when bpcs.com and marketplace share authentication

import { BPCS } from '@/config/bpcs';
import { useAuth } from '@/features/auth/useAuth';

export function useBPCSAuth() {
  const { user, token } = useAuth();

  /** Exchange marketplace JWT for bpcs.com session (future) */
  async function bridgeToBPCS(returnPath?: string) {
    if (!BPCS.sso.enabled) {
      // Fallback: just navigate
      window.open(BPCS.nav.home + (returnPath || ''), '_blank');
      return;
    }

    // Future: exchange tokens via shared Auth0 tenant
    const response = await fetch(BPCS.api.baseUrl + BPCS.api.sso, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ returnPath }),
    });

    const { redirectUrl } = await response.json();
    window.location.href = redirectUrl;
  }

  /** Push marketplace events to bpcs.com CRM (future) */
  async function syncToCRM(event: string, data: Record<string, any>) {
    if (!token) return;
    await fetch(BPCS.api.baseUrl + BPCS.api.crm, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ event, data, userId: user?.id }),
    });
  }

  return { bridgeToBPCS, syncToCRM };
}
```

### A.5 Lead Capture Hook (Ready Now)

```typescript
// src/features/integrations/bpcs/leadService.ts
// When someone submits a contact form, push to bpcs.com CRM (future)
// For now: Formspree + Slack notification

import { BPCS } from '@/config/bpcs';
import { sendSlackNotification } from '@/features/integrations/slack/slackService';
import { env } from '@/config/env';

interface Lead {
  name: string;
  email: string;
  company: string;
  interest: string;     // Product/service they're interested in
  source: string;       // Which page they came from
}

export async function captureLead(lead: Lead) {
  // 1. Send to Formspree (works now)
  await fetch(`https://formspree.io/f/${env.VITE_FORMSPREE_CONTACT}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });

  // 2. Notify Slack (works now)
  await sendSlackNotification({
    text: `📋 New Marketplace Lead: ${lead.name} (${lead.company}) — ${lead.interest}`,
  });

  // 3. Push to bpcs.com CRM API (future — enable when ready)
  if (BPCS.sso.enabled) {
    await fetch(BPCS.api.baseUrl + BPCS.api.leads, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
  }
}
```

---

## PART B: SECURE CONTENT DELIVERY & IP PROTECTION

### B.1 The Problem

You have notebooks, apps, and proprietary tools stored in a private GitHub repo. Users who purchase products on the marketplace need to download them, but you need to prevent:

- Users sharing raw files publicly (open sourcing your IP)
- Direct access to the private repo from the browser
- GitHub PAT tokens leaking to the client
- Unauthorized downloads without a valid marketplace session

### B.2 Architecture: Proxy-Based Secure Delivery

```
┌─────────────────────────────────────────────────────────────────┐
│                     MARKETPLACE (React SPA)                      │
│                                                                  │
│  User clicks "Download CampaignIQ Notebook"                     │
│        │                                                         │
│        ▼                                                         │
│  ┌──────────────────┐     JWT token in header                   │
│  │ useDownload hook  │ ──────────────────────►                   │
│  └──────────────────┘                                           │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│              DOWNLOAD PROXY SERVER (Serverless Function)          │
│              Cloudflare Worker / Vercel Edge Function             │
│                                                                  │
│  1. Validate JWT (is user logged in?)                           │
│  2. Check entitlements (has user purchased this product?)        │
│  3. Rate limit (max 5 downloads/hour per user)                  │
│  4. Log download event (analytics + audit trail)                │
│  5. Fetch file from GitHub using server-side PAT                │
│  6. Stream file to user (never expose PAT to browser)           │
│  7. Add watermark metadata to notebook (optional)               │
│                                                                  │
│  ┌──────────────┐                                               │
│  │ GitHub PAT    │  ← Stored as server ENV var, NEVER in client │
│  │ (repo scope)  │                                               │
│  └──────────────┘                                               │
│        │                                                         │
│        ▼                                                         │
│  GitHub API: GET /repos/{owner}/{repo}/contents/{path}          │
│  Header: Accept: application/vnd.github.v3.raw                  │
│  Header: Authorization: Bearer {PAT}                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PRIVATE GITHUB REPO                            │
│              github.com/bpcs/marketplace-content                 │
│                                                                  │
│  (Structure defined in Part C below)                             │
│  Files are NEVER directly accessible from browser                │
│  Only the proxy server has the PAT                               │
└─────────────────────────────────────────────────────────────────┘
```

### B.3 Download Proxy Implementation

```typescript
// api/downloads/[assetId].ts  (Vercel Edge Function / Cloudflare Worker)
// This runs SERVER-SIDE — the GitHub PAT never reaches the browser

import { verifyJWT } from '@/lib/auth';
import { checkEntitlement } from '@/lib/entitlements';
import { logDownload } from '@/lib/analytics';

const GITHUB_PAT = process.env.GITHUB_CONTENT_PAT;  // Server-only
const GITHUB_REPO = 'bpcs/marketplace-content';

// Asset manifest — maps product IDs to file paths in the private repo
const ASSET_MANIFEST: Record<string, AssetConfig> = {
  'ciq-notebook-v1': {
    path: 'products/campaign-iq/notebooks/CampaignIQ_v1.0.py',
    filename: 'CampaignIQ_v1.0.py',
    contentType: 'text/x-python',
    requiredProduct: 'campaign-iq',
    version: '1.0',
  },
  'ciq-bundle-v1': {
    path: 'products/campaign-iq/bundles/campaign_iq_bundle.tar.gz',
    filename: 'campaign_iq_bundle.tar.gz',
    contentType: 'application/gzip',
    requiredProduct: 'campaign-iq',
    version: '1.0',
  },
  'sap-wc-notebook-v1': {
    path: 'products/sap-wc/notebooks/SAP_WC_Connector_v1.0.py',
    filename: 'SAP_WC_Connector_v1.0.py',
    contentType: 'text/x-python',
    requiredProduct: 'sap-wc',
    version: '1.0',
  },
  // ... all products
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const assetId = url.pathname.split('/').pop();

  // 1. AUTHENTICATE: Verify JWT from Authorization header
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const user = await verifyJWT(authHeader.replace('Bearer ', ''));
  if (!user) {
    return new Response('Invalid token', { status: 401 });
  }

  // 2. VALIDATE: Check asset exists
  const asset = ASSET_MANIFEST[assetId!];
  if (!asset) {
    return new Response('Asset not found', { status: 404 });
  }

  // 3. AUTHORIZE: Check user has purchased / is entitled to this product
  const entitled = await checkEntitlement(user.id, asset.requiredProduct);
  if (!entitled) {
    return new Response('Not entitled to this product', { status: 403 });
  }

  // 4. RATE LIMIT: Max 5 downloads per hour per user
  const rateKey = `dl:${user.id}:${new Date().toISOString().slice(0, 13)}`;
  // (implement with KV store / Redis / Cloudflare KV)

  // 5. FETCH from GitHub private repo (server-side only)
  const githubResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${asset.path}`,
    {
      headers: {
        'Authorization': `Bearer ${GITHUB_PAT}`,
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'Blueprint-Marketplace-Proxy',
      },
    }
  );

  if (!githubResponse.ok) {
    console.error('GitHub fetch failed:', githubResponse.status);
    return new Response('Download temporarily unavailable', { status: 502 });
  }

  // 6. LOG: Audit trail + analytics
  await logDownload({
    userId: user.id,
    email: user.email,
    assetId: assetId!,
    productId: asset.requiredProduct,
    version: asset.version,
    timestamp: new Date().toISOString(),
    ip: request.headers.get('CF-Connecting-IP') || 'unknown',
  });

  // 7. STREAM to user with proper headers
  return new Response(githubResponse.body, {
    headers: {
      'Content-Type': asset.contentType,
      'Content-Disposition': `attachment; filename="${asset.filename}"`,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',                    // Never cache sensitive files
      'X-Download-Id': crypto.randomUUID(),            // Traceable download ID
      'X-Blueprint-Watermark': `licensed-to:${user.email}`,  // Metadata watermark
    },
  });
}
```

### B.4 Client-Side Download Hook (React)

```typescript
// src/features/downloads/useSecureDownload.ts
import { useAuth } from '@/features/auth/useAuth';
import { useTrack } from '@/features/analytics/useTrack';
import { useAlertStore } from '@/features/notifications/alertStore';
import { env } from '@/config/env';

interface DownloadableAsset {
  assetId: string;
  displayName: string;
  fileType: 'notebook' | 'bundle' | 'wheel' | 'report';
}

export function useSecureDownload() {
  const { token, isAuthenticated, user } = useAuth();
  const track = useTrack();
  const { push } = useAlertStore();

  async function download(asset: DownloadableAsset) {
    // Gate: must be logged in
    if (!isAuthenticated) {
      push({
        type: 'warning',
        title: 'Login Required',
        message: 'Please sign in to download content.',
        action: { label: 'Sign In', onClick: () => window.location.href = '/login' },
      });
      return;
    }

    push({ type: 'info', title: 'Starting download...', message: asset.displayName });
    track('download_initiated', { assetId: asset.assetId, fileType: asset.fileType });

    try {
      const response = await fetch(`${env.VITE_API_URL}/downloads/${asset.assetId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 403) {
        push({
          type: 'error',
          title: 'Not Available',
          message: 'You need to purchase this product to download it.',
          action: { label: 'View Pricing', onClick: () => {} },
        });
        track('download_blocked', { assetId: asset.assetId, reason: 'not_entitled' });
        return;
      }

      if (!response.ok) throw new Error(`Download failed: ${response.status}`);

      // Stream to file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.headers.get('Content-Disposition')
        ?.match(/filename="(.+)"/)?.[1] || asset.displayName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      push({ type: 'success', title: 'Download complete', message: asset.displayName });
      track('download_completed', { assetId: asset.assetId });

    } catch (error) {
      push({ type: 'error', title: 'Download failed', message: 'Please try again.' });
      track('download_failed', { assetId: asset.assetId, error: String(error) });
    }
  }

  return { download };
}
```

---

## PART C: GITHUB REPO STRUCTURE FOR PRODUCT STORAGE

### C.1 Private Content Repository

```
github.com/bpcs/marketplace-content/   (PRIVATE repo)
│
├── README.md                           # Internal docs only
├── LICENSE                             # Proprietary — NOT open source
│
├── products/
│   ├── campaign-iq/
│   │   ├── notebooks/
│   │   │   ├── CampaignIQ_v1.0.py              # Databricks notebook (Python)
│   │   │   ├── CampaignIQ_v1.0.ipynb           # Jupyter format
│   │   │   └── CampaignIQ_v1.0.dbc             # Databricks archive format
│   │   ├── bundles/
│   │   │   ├── databricks.yml                    # Databricks Asset Bundle config
│   │   │   └── src/
│   │   │       ├── main_notebook.py
│   │   │       ├── utils.py
│   │   │       └── config.yml
│   │   ├── wheels/
│   │   │   └── campaign_iq-1.0.0-py3-none-any.whl
│   │   └── manifest.json                         # Version, deps, requirements
│   │
│   ├── sap-wc/
│   │   ├── notebooks/
│   │   │   └── SAP_WC_Connector_v1.0.py
│   │   ├── bundles/
│   │   │   └── ...
│   │   └── manifest.json
│   │
│   ├── churn-iq/
│   │   └── ...
│   ├── promotion-iq/
│   │   └── ...
│   ├── cs-iq/
│   │   └── ...
│   └── lho/
│       └── ...
│
├── accelerators/
│   ├── migration-sap/
│   │   ├── notebooks/
│   │   │   ├── SAP_Migration_Accelerator.py
│   │   │   └── ROM_Calculator.py
│   │   └── manifest.json
│   ├── migration-snowflake/
│   │   └── ...
│   └── migration-oracle/
│       └── ...
│
├── templates/
│   ├── notebook-header.py               # Standard BPCS header/license block
│   └── bundle-template/                 # Template for new DAB products
│       ├── databricks.yml
│       └── src/
│
└── .github/
    └── workflows/
        ├── validate-notebooks.yml       # Lint/test notebooks on PR
        └── version-check.yml            # Ensure manifests are updated
```

### C.2 Product Manifest Schema

```json
// products/campaign-iq/manifest.json
{
  "productId": "campaign-iq",
  "version": "1.0.0",
  "displayName": "CampaignIQ",
  "description": "AI-powered campaign analytics for Databricks",
  "license": "Blueprint Proprietary — All Rights Reserved",

  "assets": [
    {
      "assetId": "ciq-notebook-v1",
      "type": "notebook",
      "path": "notebooks/CampaignIQ_v1.0.py",
      "language": "python",
      "format": "SOURCE",
      "databricksRuntime": "14.3 LTS+",
      "sizeBytes": 24576
    },
    {
      "assetId": "ciq-bundle-v1",
      "type": "bundle",
      "path": "bundles/",
      "description": "Full Databricks Asset Bundle with job definitions"
    },
    {
      "assetId": "ciq-wheel-v1",
      "type": "wheel",
      "path": "wheels/campaign_iq-1.0.0-py3-none-any.whl",
      "pythonVersion": ">=3.9"
    }
  ],

  "requirements": {
    "databricksRuntime": "14.3 LTS or above",
    "clusterType": "any",
    "unityCatalog": true,
    "libraries": [
      "pandas>=2.0",
      "mlflow>=2.8"
    ]
  },

  "deploymentOptions": {
    "notebook": true,
    "assetBundle": true,
    "wheel": true
  }
}
```

### C.3 Marketplace Product Data Integration

```typescript
// src/data/products.ts — each product now includes downloadable assets

export const products: Product[] = [
  {
    id: 'campaign-iq',
    slug: 'campaign-iq',
    title: 'CampaignIQ',
    description: 'AI-powered campaign analytics...',
    // ... existing fields ...

    // NEW: Downloadable assets (references to private repo content)
    assets: [
      {
        assetId: 'ciq-notebook-v1',
        displayName: 'CampaignIQ Notebook (Python)',
        fileType: 'notebook',
        description: 'Single notebook — import directly into Databricks workspace',
        icon: 'notebook',
      },
      {
        assetId: 'ciq-bundle-v1',
        displayName: 'CampaignIQ Asset Bundle',
        fileType: 'bundle',
        description: 'Full DAB — includes job definitions, deploy with CLI',
        icon: 'package',
      },
      {
        assetId: 'ciq-wheel-v1',
        displayName: 'CampaignIQ Python Wheel',
        fileType: 'wheel',
        description: 'Install as library on any cluster',
        icon: 'library',
      },
    ],

    // NEW: Databricks deployment config
    deployment: {
      supportsOneClick: true,
      defaultPath: '/Users/{email}/Blueprint/CampaignIQ',
      requiredRuntime: '14.3 LTS',
      requiredLibraries: ['pandas>=2.0', 'mlflow>=2.8'],
    },
  },
  // ... other products
];
```

---

## PART D: IP PROTECTION & WRITE PROTECTION

### D.1 Multi-Layer Protection Strategy

```
LAYER 1: ACCESS CONTROL
├── Private GitHub repo (no public access)
├── Server-side proxy (PAT never in browser)
├── JWT + entitlement check on every download
└── Rate limiting (5 downloads/hour/user)

LAYER 2: CONTENT PROTECTION
├── License header injected into every notebook
├── Watermark metadata with user email + download ID
├── Obfuscated Python wheels (compiled .pyc, not source)
├── Download audit trail (who, what, when, IP)
└── DMCA takedown process documented

LAYER 3: LEGAL PROTECTION
├── Terms of Service: no redistribution clause
├── License agreement accepted before first download
├── Copyright notice in every file header
└── Proprietary license (NOT MIT/Apache/GPL)

LAYER 4: TECHNICAL DETERRENTS
├── Notebook header with embedded license + user ID
├── Runtime license check (notebook phones home on execution)
├── Unique download IDs traceable to specific users
└── Compiled wheels where possible (harder to reverse-engineer)
```

### D.2 License Header (Auto-Injected on Download)

The download proxy injects this header into every notebook before streaming:

```python
# ┌─────────────────────────────────────────────────────────┐
# │  BLUEPRINT TECHNOLOGY MARKETPLACE                        │
# │  Product: CampaignIQ v1.0                                │
# │  License: Blueprint Proprietary — All Rights Reserved    │
# │                                                          │
# │  Licensed to: john.doe@acmecorp.com                     │
# │  Download ID: bf7a2c3d-1234-5678-9abc-def012345678       │
# │  Date: 2026-02-08                                        │
# │                                                          │
# │  UNAUTHORIZED REDISTRIBUTION IS STRICTLY PROHIBITED.     │
# │  This software is protected by copyright law and         │
# │  international treaties. Reverse engineering,             │
# │  decompilation, or redistribution without written         │
# │  permission from Blueprint Technology Solutions is        │
# │  prohibited and may result in legal action.               │
# │                                                          │
# │  Support: marketplace@bpcs.com                           │
# │  Terms: https://marketplace.bpcs.com/terms               │
# └─────────────────────────────────────────────────────────┘
```

### D.3 Runtime License Validation (Optional, for Premium Products)

```python
# Embedded in the notebook itself — runs on first cell execution
# This is a soft check — provides telemetry, not hard DRM

import requests, os, json

def _validate_blueprint_license():
    """Validates Blueprint marketplace license. Remove at your own risk."""
    try:
        workspace_url = os.environ.get('DATABRICKS_HOST', 'unknown')
        user_email = (
            dbutils.notebook.entry_point  # type: ignore
            .getDbutils()
            .notebook()
            .getContext()
            .userName()
            .get()
        )
        requests.post(
            'https://api.marketplace.bpcs.com/v1/telemetry/notebook-run',
            json={
                'product': 'campaign-iq',
                'version': '1.0',
                'workspace': workspace_url,
                'user': user_email,
                'downloadId': 'bf7a2c3d-1234-5678-9abc-def012345678',
            },
            timeout=3,
        )
    except Exception:
        pass  # Never block execution — telemetry only

_validate_blueprint_license()
```

### D.4 Compiled Wheel Protection

For maximum IP protection on core logic, distribute as compiled Python wheels instead of raw notebooks:

```
Raw Source (internal only):       campaign_iq/core/engine.py     ← readable Python
Compiled Wheel (distributed):     campaign_iq/core/engine.cpython-311.pyc  ← bytecode only

Users install with:  %pip install /Volumes/blueprint/wheels/campaign_iq-1.0.0-py3-none-any.whl
Users call with:     from campaign_iq import run_analysis
Users CANNOT:        Read the source code of the core analysis logic
```

Build process:
```yaml
# .github/workflows/build-wheel.yml (in the private content repo)
name: Build Protected Wheel
on:
  push:
    paths: ['products/*/src/**']
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: pip install wheel setuptools
      - run: |
          cd products/campaign-iq
          python setup.py bdist_wheel --python-tag cp311
          # The wheel contains .pyc files, not .py source
      - run: cp dist/*.whl products/campaign-iq/wheels/
      - run: git add . && git commit -m "build: update wheel" && git push
```

### D.5 Download Terms Acceptance (UI Component)

```typescript
// src/components/modals/DownloadTermsModal.tsx
// Shown ONCE before first download — stores acceptance

import { Modal, Button } from '@/components/ui';
import { useAuth } from '@/features/auth/useAuth';

interface Props {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  productName: string;
}

export function DownloadTermsModal({ isOpen, onAccept, onDecline, productName }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onDecline}>
      <div className="p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          License Agreement — {productName}
        </h2>

        <div className="bg-gray-50 border border-gray-200 p-4 h-48 overflow-y-auto
                        text-xs text-gray-600 mb-6 font-mono">
          <p className="font-bold mb-2">BLUEPRINT TECHNOLOGY SOLUTIONS — PROPRIETARY LICENSE</p>
          <p className="mb-2">
            This software is licensed, not sold. By downloading, you agree to the following:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>You may use this software only within your organization's Databricks workspace(s).</li>
            <li>You may NOT redistribute, sublicense, publish, or share this software.</li>
            <li>You may NOT reverse-engineer, decompile, or create derivative works.</li>
            <li>You may NOT remove license headers, watermarks, or copyright notices.</li>
            <li>Blueprint reserves the right to revoke access for violations.</li>
            <li>Downloads are logged and traceable for compliance purposes.</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Button variant="primary" onClick={onAccept}>
            I Accept — Download
          </Button>
          <Button variant="ghost" onClick={onDecline}>
            Decline
          </Button>
        </div>
      </div>
    </Modal>
  );
}
```

---

## PART E: DATABRICKS DEPLOYMENT PIPELINE

### E.1 Three Deployment Options for Users

Users get three ways to deploy your products to their Databricks workspaces. Each serves a different skill level:

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER'S PRODUCT DASHBOARD                      │
│                                                                  │
│  ┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐ │
│  │  OPTION 1        │ │  OPTION 2         │ │  OPTION 3       │ │
│  │  One-Click       │ │  Download         │ │  Asset Bundle   │ │
│  │  Deploy          │ │  Notebook         │ │  (CLI)          │ │
│  │                  │ │                   │ │                 │ │
│  │  Imports         │ │  .py / .ipynb     │ │  Full DAB with  │ │
│  │  notebook        │ │  file download    │ │  jobs, clusters │ │
│  │  directly to     │ │  for manual       │ │  pipelines      │ │
│  │  their workspace │ │  upload           │ │                 │ │
│  │                  │ │                   │ │                 │ │
│  │  [Deploy Now]    │ │  [Download]       │ │  [Get Bundle]   │ │
│  │                  │ │                   │ │                 │ │
│  │  Skill: Basic    │ │  Skill: Basic     │ │  Skill: DevOps  │ │
│  └─────────────────┘ └──────────────────┘ └─────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### E.2 Option 1: One-Click Deploy (Databricks Workspace Import API)

This is the flagship feature — users click one button and the notebook appears in their Databricks workspace.

**Flow:**

```
1. User clicks "Deploy to Databricks"
2. Marketplace shows Databricks connection modal:
   - Workspace URL: https://adb-1234567890.azuredatabricks.net
   - User authenticates via Databricks OAuth U2M flow
3. Marketplace proxy:
   a. Fetches notebook from private GitHub repo (server-side PAT)
   b. Injects license header with user's email
   c. Calls Databricks Workspace Import API with user's OAuth token
   d. Notebook appears at /Users/{email}/Blueprint/{ProductName}/
4. User sees success confirmation with link to open notebook
```

**Databricks OAuth U2M Integration:**

```typescript
// src/features/databricks/useDatabricksAuth.ts
// OAuth User-to-Machine flow — user authorizes marketplace to act on their behalf

const DATABRICKS_CLIENT_ID = import.meta.env.VITE_DATABRICKS_CLIENT_ID;

interface DatabricksConnection {
  workspaceUrl: string;
  accessToken: string;
  tokenExpiry: number;
}

export function useDatabricksAuth() {
  const [connection, setConnection] = useState<DatabricksConnection | null>(null);
  const track = useTrack();

  /**
   * Initiate OAuth U2M flow:
   * 1. User enters workspace URL
   * 2. We redirect to Databricks OAuth authorize endpoint
   * 3. User logs into Databricks and grants permission
   * 4. Databricks redirects back with authorization code
   * 5. We exchange code for access token
   */
  async function connect(workspaceUrl: string) {
    // Generate PKCE code verifier + challenge
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store verifier for the callback
    sessionStorage.setItem('dbx_code_verifier', codeVerifier);
    sessionStorage.setItem('dbx_workspace_url', workspaceUrl);

    // Redirect to Databricks OAuth
    const authUrl = new URL(`${workspaceUrl}/oidc/v1/authorize`);
    authUrl.searchParams.set('client_id', DATABRICKS_CLIENT_ID);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth/databricks/callback`);
    authUrl.searchParams.set('scope', 'all-apis offline_access');
    authUrl.searchParams.set('code_challenge', codeChallenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');
    authUrl.searchParams.set('state', crypto.randomUUID());

    track('databricks_auth_started', { workspaceUrl });
    window.location.href = authUrl.toString();
  }

  /** Handle OAuth callback — exchange code for token */
  async function handleCallback(code: string) {
    const verifier = sessionStorage.getItem('dbx_code_verifier');
    const workspaceUrl = sessionStorage.getItem('dbx_workspace_url');

    if (!verifier || !workspaceUrl) throw new Error('Missing OAuth state');

    const tokenResponse = await fetch(`${workspaceUrl}/oidc/v1/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: DATABRICKS_CLIENT_ID,
        code_verifier: verifier,
        redirect_uri: `${window.location.origin}/auth/databricks/callback`,
      }),
    });

    const tokens = await tokenResponse.json();

    setConnection({
      workspaceUrl,
      accessToken: tokens.access_token,
      tokenExpiry: Date.now() + (tokens.expires_in * 1000),
    });

    // Clean up
    sessionStorage.removeItem('dbx_code_verifier');
    sessionStorage.removeItem('dbx_workspace_url');

    track('databricks_auth_completed', { workspaceUrl });
  }

  function disconnect() {
    setConnection(null);
  }

  return { connection, connect, handleCallback, disconnect };
}
```

**Server-Side Deploy Endpoint:**

```typescript
// api/deploy/notebook.ts  (Vercel Edge Function)
// Fetches from GitHub, injects license, imports to user's Databricks workspace

export async function POST(request: Request) {
  const { assetId, workspaceUrl, databricksToken, targetPath } = await request.json();

  // 1. Validate marketplace JWT
  const user = await verifyJWT(request.headers.get('Authorization')!.replace('Bearer ', ''));
  if (!user) return new Response('Unauthorized', { status: 401 });

  // 2. Check entitlement
  const asset = ASSET_MANIFEST[assetId];
  const entitled = await checkEntitlement(user.id, asset.requiredProduct);
  if (!entitled) return new Response('Not entitled', { status: 403 });

  // 3. Fetch notebook from private GitHub repo
  const notebookResponse = await fetch(
    `https://api.github.com/repos/bpcs/marketplace-content/contents/${asset.path}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_CONTENT_PAT}`,
        'Accept': 'application/vnd.github.v3.raw',
      },
    }
  );
  let notebookContent = await notebookResponse.text();

  // 4. Inject license header
  const licenseHeader = generateLicenseHeader(user.email, asset, crypto.randomUUID());
  notebookContent = licenseHeader + '\n\n' + notebookContent;

  // 5. Import to user's Databricks workspace using THEIR OAuth token
  const importPath = targetPath || `/Users/${user.email}/Blueprint/${asset.requiredProduct}`;

  // Create directory first
  await fetch(`${workspaceUrl}/api/2.0/workspace/mkdirs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${databricksToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path: importPath }),
  });

  // Import notebook
  const encoded = Buffer.from(notebookContent).toString('base64');
  const importResponse = await fetch(`${workspaceUrl}/api/2.0/workspace/import`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${databricksToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      path: `${importPath}/${asset.filename.replace(/\.[^.]+$/, '')}`,
      format: 'SOURCE',
      language: 'PYTHON',
      content: encoded,
      overwrite: false,
    }),
  });

  if (!importResponse.ok) {
    const error = await importResponse.text();
    return new Response(JSON.stringify({ error }), { status: 502 });
  }

  // 6. Log deployment
  await logDeployment({
    userId: user.id,
    email: user.email,
    assetId,
    workspaceUrl,
    importPath,
    timestamp: new Date().toISOString(),
  });

  return new Response(JSON.stringify({
    success: true,
    path: importPath,
    workspaceUrl: `${workspaceUrl}/#workspace${importPath}`,
  }));
}
```

### E.3 Option 2: Download Notebook (Manual Upload)

Already covered in Part B. User downloads .py/.ipynb file and imports manually via Databricks UI.

### E.4 Option 3: Databricks Asset Bundle (CLI Power Users)

For DevOps-oriented customers who want the full package with job definitions, cluster configs, and pipeline YAML.

```typescript
// src/features/databricks/DeployBundleInstructions.tsx
// Shown when user clicks "Get Asset Bundle" — provides CLI instructions

export function DeployBundleInstructions({ product }: { product: Product }) {
  return (
    <div className="bg-gray-50 p-6 border border-gray-200 font-mono text-sm">
      <h3 className="font-bold text-gray-900 mb-4">Deploy via Databricks Asset Bundle CLI</h3>

      <p className="text-gray-600 mb-4">
        After downloading the bundle archive, extract and deploy:
      </p>

      <pre className="bg-black text-green-400 p-4 overflow-x-auto mb-4">
{`# 1. Extract the bundle
tar -xzf ${product.id}_bundle.tar.gz
cd ${product.id}_bundle

# 2. Authenticate with your workspace
databricks auth login --host https://YOUR-WORKSPACE.azuredatabricks.net

# 3. Validate the bundle configuration
databricks bundle validate

# 4. Deploy to your workspace
databricks bundle deploy -t dev

# 5. Run the job
databricks bundle run ${product.id}_job -t dev`}
      </pre>

      <p className="text-gray-500 text-xs">
        Requires Databricks CLI v0.218+ installed.
        The bundle includes: notebook, job definition, cluster config, and library dependencies.
      </p>
    </div>
  );
}
```

### E.5 User Dashboard — Deployment Panel

```typescript
// src/pages/account/DeploymentsPage.tsx
// Shows user their deployed products and available downloads

export default function DeploymentsPage() {
  const { user } = useAuth();
  const { download } = useSecureDownload();
  const { connection, connect } = useDatabricksAuth();
  const entitlements = useEntitlements(user?.id);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Products & Deployments</h1>
      <p className="text-gray-500 mb-8">Download, deploy, and manage your marketplace products.</p>

      {/* Databricks Connection Status */}
      <section className="mb-8 p-6 bg-white border border-gray-200">
        <h2 className="font-bold text-gray-900 mb-3">Databricks Workspace</h2>
        {connection ? (
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm">Connected to {connection.workspaceUrl}</span>
          </div>
        ) : (
          <Button onClick={() => connect(prompt('Enter workspace URL:')!)}>
            Connect Databricks Workspace
          </Button>
        )}
      </section>

      {/* Products Grid */}
      <section className="space-y-4">
        {entitlements.map((product) => (
          <ProductDeploymentCard
            key={product.id}
            product={product}
            onDownload={download}
            databricksConnection={connection}
          />
        ))}
      </section>
    </div>
  );
}
```

---

## PART F: UPDATED PROJECT STRUCTURE (ADDITIONS)

New files and directories added to the master plan:

```
src/
├── config/
│   └── bpcs.ts                          # NEW — all bpcs.com URLs and API hooks
│
├── features/
│   ├── databricks/                       # NEW — entire module
│   │   ├── useDatabricksAuth.ts         # OAuth U2M connection flow
│   │   ├── useDatabricksDeploy.ts       # One-click deploy hook
│   │   ├── DatabricksCallbackPage.tsx   # OAuth redirect handler
│   │   ├── DatabricksConnectionModal.tsx # Workspace URL + auth UI
│   │   └── DeployBundleInstructions.tsx # CLI instructions component
│   │
│   ├── downloads/                        # ENHANCED
│   │   ├── useSecureDownload.ts         # Updated with proxy + entitlements
│   │   ├── downloadService.ts           # API calls to proxy
│   │   └── useEntitlements.ts           # Check what user has purchased
│   │
│   └── integrations/
│       └── bpcs/                         # NEW — bpcs.com integration
│           ├── leadService.ts           # Push leads to bpcs.com CRM
│           └── useBPCSAuth.ts           # SSO bridge hook
│
├── pages/
│   └── account/
│       └── DeploymentsPage.tsx           # NEW — products + deploy dashboard
│
├── components/
│   └── modals/
│       └── DownloadTermsModal.tsx        # NEW — license acceptance

api/                                      # NEW — serverless functions
├── downloads/
│   └── [assetId].ts                     # Secure download proxy
├── deploy/
│   └── notebook.ts                      # Databricks workspace import
└── telemetry/
    └── notebook-run.ts                  # Runtime license check endpoint
```

### F.2 Updated Routes

```typescript
// Additions to src/config/routes.ts
export const ROUTES = {
  // ... existing routes ...

  // Databricks OAuth
  DATABRICKS_CALLBACK: '/auth/databricks/callback',

  // Account (enhanced)
  DEPLOYMENTS: '/account/deployments',

  // Future bpcs.com SSO
  BPCS_SSO_CALLBACK: '/auth/bpcs/callback',
} as const;
```

### F.3 Updated Environment Variables

```bash
# Additions to .env.example

# bpcs.com Integration
VITE_BPCS_API_URL=https://api.bpcs.com
VITE_BPCS_SSO_ENABLED=false

# Databricks OAuth (register app at Databricks Account Console)
VITE_DATABRICKS_CLIENT_ID=your-oauth-app-client-id

# Server-side only (Vercel/Cloudflare env vars, NOT VITE_ prefixed)
GITHUB_CONTENT_PAT=ghp_xxxxxxxxxxxxxxxxxxxx
DOWNLOAD_RATE_LIMIT_PER_HOUR=5
```

---

## PART G: SECURITY SUMMARY FOR CONTENT DELIVERY

| Attack Vector | Protection |
|---------------|-----------|
| User shares download URL | URLs are authenticated — useless without valid JWT |
| User leaks GitHub PAT | PAT is server-side only — never reaches browser |
| User redistributes notebook | Watermarked with their email + download ID, traceable |
| User reverse-engineers wheel | Compiled .pyc bytecode, not raw Python source |
| Brute-force download attempts | Rate limited to 5/hour/user + JWT required |
| Session hijack | OAuth tokens expire < 1 hour, PKCE prevents interception |
| Man-in-the-middle | HTTPS everywhere, no HTTP fallback |
| Unauthorized Databricks deploy | Uses USER'S own OAuth token — marketplace never stores workspace credentials |
| User removes license header | Runtime telemetry still phones home with download ID |
| User publishes to public repo | DMCA takedown + audit trail proves origin |

### Key Principle: Zero Trust Content Delivery

```
The marketplace NEVER gives users direct access to the content repository.
The marketplace NEVER stores Databricks workspace credentials.
The marketplace NEVER puts the GitHub PAT in client-side code.
Every download is authenticated, authorized, rate-limited, logged, and watermarked.
Every deployment uses the USER'S own Databricks OAuth token, not a service account.
```

---

## PART H: IMPLEMENTATION PRIORITY

These additions slot into the existing phase plan:

| Phase | Addition | Effort |
|-------|----------|--------|
| Phase 1 (Foundation) | `bpcs.ts` config, `BPCSLink` component | 1 hour |
| Phase 5 (Auth) | `DownloadTermsModal`, entitlements check | 3 hours |
| Phase 5 (Auth) | Download proxy serverless function | 1 day |
| Phase 5 (Auth) | `DeploymentsPage` with download buttons | 1 day |
| Phase 6 (Integrations) | `useBPCSAuth` SSO bridge hook (dormant) | 2 hours |
| Phase 6 (Integrations) | `leadService` → bpcs.com CRM hook | 2 hours |
| **New Phase 8** | Databricks OAuth U2M integration | 2-3 days |
| **New Phase 8** | One-click deploy proxy function | 1-2 days |
| **New Phase 8** | Asset Bundle download packaging | 1 day |
| **New Phase 8** | Runtime telemetry endpoint | 0.5 day |
| **New Phase 8** | Compiled wheel build pipeline | 1 day |

**Phase 8 total: ~1.5 weeks**
