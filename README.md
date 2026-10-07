# PGH Gaming Hub — C2C Marketplace & Real-Time Trading Platform

> **Product Showcase, AI Vision Pipeline & System Overview**

[![Live Application](https://img.shields.io/badge/Live_App-pgh--gaming--hub.vercel.app-000000?style=for-the-badge&logo=vercel)](https://pgh-gaming-hub.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime_%26_Postgres-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google_GenAI-Vision_%26_Moderation-8E75C4?style=for-the-badge&logo=google)](https://ai.google.dev/)

🌐 **Live Application:** [https://pgh-gaming-hub.vercel.app/](https://pgh-gaming-hub.vercel.app/)  
👨‍💻 **Architect & Developer:** [Farhan Pathan](https://github.com/Farhanpathan12)

---

> [!NOTE]
> **Product Prototype & Portfolio Showcase**  
> PGH Gaming Hub is a full-stack C2C gaming gear marketplace platform. This repository documents the **Technical Architecture, AI Pipelines, and System Design** for portfolio and recruiter review. The production application source files and backend secrets remain private.

---

## 📌 Product Overview

Trading pre-owned gaming gear (consoles, GPUs, high-refresh displays) on traditional classified sites suffers from major trust deficits: buyers struggle to verify hardware condition, sellers face non-stop lowball offers, and pricing second-hand tech is largely guesswork.

**PGH Gaming Hub** solves these pain points through:
1. **AI Computer Vision (Google Gemini):** Automated hardware box inspection to detect accurate model SKUs and specifications directly from photos.
2. **Real-Time Negotiation Engine:** Direct in-app negotiation rooms with binding offer and counter-offer acceptance flows on Supabase Realtime.
3. **Automated AI Safety & Moderation:** Real-time message inspection intercepting spam, scam links, and abusive messages.
4. **Dynamic Valuation & Benchmarks:** Multi-step valuation estimator and FPS benchmark estimators for listed hardware.

---

## ✨ Core Features & Functionality

### 1. AI Hardware Box Scan & Inspection
- **Automated Specs Detection:** Sellers upload packaging photos to the vision endpoint, which leverages Google Gemini vision models to automatically detect manufacturer, model name, storage capacity, and hardware condition.
- **Accurate Cataloging:** Prevents inaccurate or misleading listings by pre-filling verified specifications.

### 2. Real-Time Chat & Negotiation State Machine
- **Instant Messaging:** Direct buyer-seller communication channels powered by Supabase Realtime WebSockets.
- **Formal Counter-Offers:** Structured workflow allowing buyers to propose prices and sellers to formally `Accept`, `Counter`, or `Decline` offers with atomic state transitions.

### 3. Automated AI Chat Moderation
- **Real-Time Guardrails:** Outgoing negotiation messages are inspected by a dedicated Gemini safety route (`/api/moderate`).
- **Scam Interception:** Detects unauthorized third-party payment requests, fraudulent external URLs, and toxic language, alerting users before high-risk off-platform trades occur.

### 4. Valuation Wizard & Gaming Benchmarks
- **Pricing Estimation Engine:** Evaluates gear categories (PS5, Switch, GPUs, Monitors) factoring device age, cosmetic wear, and fan noise to recommend fair market price ranges.
- **FPS Performance Estimator:** Built-in gaming benchmark engine displaying expected resolutions and frame rates on listed gaming hardware across popular titles.

---

## 🛠️ Complete Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling & Motion** | Tailwind CSS v4, Framer Motion, Lucide React, Sonner |
| **Backend & Realtime** | Supabase (PostgreSQL, Realtime WebSockets, Storage, RLS) |
| **AI & Computer Vision** | Google AI Studio (`@google/genai` — Gemini / Gemma) |
| **Geolocation & Maps** | Leaflet, React-Leaflet |
| **Data Validation** | Zod |
| **Hosting & Deployment** | Vercel Serverless Edge Network |

---

## 📄 License & Intellectual Property

Copyright © 2026 Farhan Pathan. All Rights Reserved.

This repository is proprietary software provided exclusively for technical inspection, system design evaluation, and portfolio demonstration. No license is granted to copy, reproduce, modify, deploy, or commercially exploit this software or its architecture.
