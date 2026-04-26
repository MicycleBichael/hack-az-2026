# Implementation Plan: Wildcat Recall

## 1. Project Overview
Wildcat Recall is an educational tool utilizing a Spaced Repetition System (SRS) enhanced with a local-first AI architecture. This plan outlines the development path for the application, focusing on zero-cost local AI inference and scalable cloud synchronization.

## 2. Technology Stack
*   **Frontend**: React, Vite, TypeScript
*   **Database & Auth**: Supabase
*   **AI Engine**: WebLLM (running directly in browser via WebGPU)
*   **AI Model**: Gemma 4 E2B (optimized for edge, ~1.2GB)
*   **Storage**: IndexedDB (for local caching of model files)

## 3. Architecture & Key Systems

### 3.1. Local-First AI Engine
Instead of costly cloud AI inference (like Vertex AI), the application relies on client-side AI:
*   **WebLLM integration** to execute the Gemma 4 E2B model via WebGPU.
*   **IndexedDB** integration to cache model weights on the user's device, enabling faster subsequent loads and offline support.
*   **Use Case**: The AI engine will dynamically generate slightly varied questions based on a core "Fact" to ensure conceptual understanding over rote memorization.

### 3.2. Spaced Repetition (SM-2 Algorithm)
The core learning logic is based on the SuperMemo-2 (SM-2) algorithm.
*   **Initial State**: Ease Factor (EF) = 2.5, Interval (I) = 0 days.
*   **Review "Good"**: `I_new = I_old * EF`.
*   **Review "Again"**: Interval resets to 1 day.

### 3.3. Database Schema (Supabase)
The application state and user data are managed via Supabase.

**Table: `srs_cards`**
*   `id` (uuid, primary key)
*   `user_id` (uuid, references `auth.users`)
*   `fact_text` (text)
*   `ease_factor` (float, default: 2.5)
*   `interval` (int, default: 0)
*   `repetitions` (int, default: 0)
*   `next_review` (timestamp with time zone)

### 3.4. Monetization & Tiers
*   **Free Tier**: 10 reviews/week (Local AI). Supported by "Rewarded Interstitial" ads.
*   **Supporter Tier ($5/mo)**: Ad-free experience + Cloud Sync (cross-device progress via Supabase).
*   **Premium Tier ($15/mo)**: Unlimited reviews, Multimodal Image Analysis (Gemini 1.5 Flash API), and "Semester Memory" (Long Context window).

## 4. Phase-by-Phase Development

### Phase 1: Core Web App & Supabase Setup
1.  Initialize Vite + React application.
2.  Set up Supabase project and define the `srs_cards` table schema with RLS (Row Level Security).
3.  Implement Supabase Authentication.
4.  Build basic CRUD interface for adding and managing "Facts" (`srs_cards`).

### Phase 2: SM-2 Logic Implementation
1.  Implement SM-2 review mathematical logic in frontend utility functions.
2.  Build the UI for reviewing cards ("Good" vs "Again" buttons).
3.  Ensure database syncs the updated `ease_factor`, `interval`, and `next_review` after each interaction.

### Phase 3: Local-First AI Integration
1.  Integrate WebLLM and configure it to use the target edge model (e.g., Gemma 4 E2B).
2.  Implement caching mechanisms via IndexedDB for the model weights.
3.  Connect the WebLLM prompt to the reviewing interface: Before showing a fact, prompt the model to generate a question based on the `fact_text`. Provide loading states for model initialization.

### Phase 4: Polish & Deployment
1.  Implement UI/UX improvements (responsive design, animations).
2.  Configure routing and deployment to GitHub Pages (or alternative hosting).
3.  Test across devices, ensuring WebGPU support falls back gracefully if unsupported.
