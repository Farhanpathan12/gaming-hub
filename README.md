# PGH Gaming Hub — C2C Marketplace & Real-Time Trading Platform

> **Technical Architecture, AI Vision Pipeline & System Design Case Study**

[![Live Demo](https://img.shields.io/badge/Live_App-pgh--gaming--hub.vercel.app-000000?style=for-the-badge&logo=vercel)](https://pgh-gaming-hub.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime_%26_Postgres-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google_GenAI-Vision_%26_Moderation-8E75C4?style=for-the-badge&logo=google)](https://ai.google.dev/)

🌐 **Live Application:** [https://pgh-gaming-hub.vercel.app/](https://pgh-gaming-hub.vercel.app/)  
👨‍💻 **Architect & Engineer:** [Farhan Pathan](https://github.com/Farhanpathan12)

---

> [!NOTE]
> **Product Prototype & System Design Case Study**  
> PGH Gaming Hub is a full-stack C2C gaming gear marketplace platform. This repository documents the **Technical Architecture, Computer Vision Pipeline, and System Design** for portfolio and technical review. Proprietary application source files, internal microservices, and production secrets remain strictly private.

---

## 📌 Executive Summary

Trading second-hand gaming hardware (consoles, GPUs, high-refresh displays) on general classified sites suffers from severe trust deficits: buyers struggle to verify hardware condition, sellers face endless haggling spam, and pricing pre-owned gear is largely guesswork.

**PGH Gaming Hub** solves these pain points by integrating **AI Computer Vision (Google Gemini)** for automated hardware box inspection, **Supabase Realtime** for instant buyer-seller negotiations with formal counter-offer acceptance, and dynamic gear valuation algorithms.

---

## 🏗️ High-Level System Architecture

```mermaid
flowchart TD
    subgraph ClientLayer [Next.js 16 Web Client]
        MarketplaceFeed[Marketplace Catalog & Discovery]
        ListingWizard[Listing Creation & Vision Scan]
        NegotiationRoom[Real-Time Chat & Counter-Offers]
        ValuationTool[Dynamic Valuation Wizard]
    end

    subgraph BackendAPI [Next.js Server Actions & Route Handlers]
        VisionRoute[/api/listings/analyze-hardware]
        ModerateRoute[/api/moderate]
        PricingRoute[/api/pricing/evaluate]
    end

    subgraph AIServices [Google AI Studio / GenAI]
        GeminiVision[Google Gemini 2.5 / Gemma Vision OCR]
        GeminiSafety[Gemini Text Content Moderation]
    end

    subgraph DataLayer [Supabase Cloud Infrastructure]
        Postgres[(PostgreSQL Relational DB)]
        RealtimePubSub[Supabase Realtime WebSocket Channels]
        StorageBuckets[Product Media Storage Buckets]
        RLSPolicies[Row Level Security Engine]
    end

    ListingWizard -->|Upload packaging photo| VisionRoute
    VisionRoute -->|Analyze specs, serials, condition| GeminiVision
    GeminiVision -->|Structured JSON specs| ListingWizard

    NegotiationRoom -->|Send message / offer| ModerateRoute
    ModerateRoute -->|Check scam/UPI/abusive content| GeminiSafety
    ModerateRoute -->|Safe message pass-through| RealtimePubSub

    NegotiationRoom <-->|Bi-directional negotiation sync| RealtimePubSub
    RealtimePubSub <--> Postgres

    MarketplaceFeed -->|Fetch verified listings| RLSPolicies
    RLSPolicies --> Postgres
    MarketplaceFeed -->|Fetch CDN assets| StorageBuckets
```

---

## ⚙️ Core Technical Highlights

### 1. AI Hardware Box Scan & Vision Pipeline
- **Automated Specs Extraction:** When a seller uploads photos of hardware packaging, the `/api/listings/analyze-hardware` endpoint streams image payloads to Google Gemini vision models.
- **Structured Schema Detection:** The model extracts manufacturer, exact model SKU (e.g., *PS5 Disc Edition CFI-1200*, *RTX 4070 12GB*), cosmetic state, and storage capacity, automatically populating the listing form to prevent misleading listings.

### 2. Real-Time Negotiation & Offer State Machine
- **WebSocket Synchronization:** Negotiation rooms leverage Supabase Realtime pub/sub channels for instantaneous message delivery.
- **Formal Offer Workflow:** Buyers submit binding monetary offers; sellers can formally `Accept`, `Counter`, or `Decline`, triggering atomic database updates and state transitions.

### 3. Automated AI Chat Moderation & Scam Prevention
- **Real-Time Guardrails:** Outgoing negotiation messages are inspected by a dedicated Gemini safety route (`/api/moderate`).
- **Scam Interception:** Detects unauthorized third-party payment requests, fraudulent external URLs, and toxic language, alerting users before high-risk off-platform trades occur.

### 4. Dynamic Gear Valuation & FPS Benchmarks
- **Algorithmic Pricing Wizard:** Calculates fair market value factoring hardware category, device age, cosmetic scratches, and fan noise/defects.
- **Hardware Performance Estimator:** Built-in benchmark lookup engine (see [`architecture/benchmarks.ts`](architecture/benchmarks.ts)) displaying expected target resolutions and frame rates on listed GPUs and consoles across major titles.

---

## 🛠️ Complete Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling & Motion** | Tailwind CSS v4, Framer Motion, Lucide React, Sonner |
| **Backend & Realtime** | Supabase (PostgreSQL, Realtime WebSockets, Storage, RLS) |
| **AI & Computer Vision** | Google AI Studio (`@google/genai` — Gemini / Gemma) |
| **Geolocation** | Leaflet, React-Leaflet |
| **Data Validation** | Zod |
| **Hosting & Deployment** | Vercel Serverless Edge Network |

---

## 📄 License & Intellectual Property

Copyright © 2026 Farhan Pathan. All Rights Reserved.

This repository is proprietary software provided exclusively for technical inspection, system design evaluation, and portfolio demonstration. No license is granted to copy, reproduce, modify, deploy, or commercially exploit this software or its architecture.
