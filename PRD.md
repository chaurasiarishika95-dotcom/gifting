# Product Requirements Document — EchoGifts

| Field | Details |
|---|---|
| **Product Name** | EchoGifts |
| **Version** | v0.1 — Prototype |
| **Status** | 🟡 Prototype Built |
| **Author** | — |
| **Last Updated** | April 2026 |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Non-Goals](#3-goals--non-goals)
4. [Target Users](#4-target-users)
5. [User Journey](#5-user-journey)
6. [Feature Requirements](#6-feature-requirements)
7. [User Stories & Acceptance Criteria](#7-user-stories--acceptance-criteria)
8. [Technical Architecture](#8-technical-architecture)
9. [AI Design Decisions](#9-ai-design-decisions)
10. [Success Metrics](#10-success-metrics)
11. [Risks & Mitigations](#11-risks--mitigations)
12. [Out of Scope](#12-out-of-scope)
13. [Experiment Plan](#13-experiment-plan)
14. [Future Roadmap](#14-future-roadmap)
15. [Glossary](#15-glossary)

---

## 1. Overview

Choosing a meaningful gift is often time-consuming and stressful — especially when the buyer has little information about the recipient's preferences. EchoGifts is an AI-powered gift recommendation assistant that helps users quickly discover thoughtful, personalised gift ideas.

The system takes natural language input about the recipient (their interests, relationship to the buyer, occasion, and budget) and uses a large language model to generate contextually relevant, curated suggestions — including products from Indian brands.

The current prototype validates the core AI-assisted discovery experience before a full backend is built.

---

## 2. Problem Statement

Most users struggle with gift selection because:

- They are uncertain about what the recipient actually wants
- Browsing marketplaces manually is slow and produces generic results
- Traditional recommendation engines rely on purchase or browsing history, which is unavailable for new or infrequent recipients
- Occasion-specific gifting (Diwali, Rakhi, birthdays) requires cultural context that keyword search doesn't capture

**Result:** Users default to generic gifts, leading to low satisfaction for both the giver and receiver.

---

## 3. Goals & Non-Goals

### Goals

- Allow users to describe a recipient in plain language and receive personalised gift suggestions within seconds
- Support Indian occasions, budgets in INR, and Indian brand recommendations
- Validate the AI-assisted gift discovery model with a working prototype
- Demonstrate a deployable architecture (frontend + AI API + optional backend proxy)

### Non-Goals (v0.1)

- Real-time e-commerce integration or live product inventory
- User authentication or persistent accounts (prototype uses local state only)
- Payment processing or cart functionality
- Mobile-native app (web only)
- Support for non-Indian markets or currencies

---

## 4. Target Users

### Primary Users

Individuals looking for personalised gift ideas quickly, including:

- Friends buying birthday or celebration gifts
- Professionals selecting colleague or client gifts
- Family members choosing festive gifts (Diwali, Rakhi, Eid, Pongal, etc.)

**Common trait:** They know the recipient personally but struggle to translate that knowledge into a specific gift.

### Secondary Users

- E-commerce platforms seeking to improve gift-category conversion rates
- D2C Indian brands looking for AI-driven product discovery surfaces

---

## 5. User Journey

```
1. User opens EchoGifts
2. Enters recipient details
   └─ Relationship (Friend, Parent, Sibling…)
   └─ Interests (free text or quiz)
   └─ Occasion (Birthday, Diwali, New Job…)
   └─ Budget (₹500 – No Limit)
3. AI processes the context
4. User receives 4–6 personalised gift suggestions
   └─ Each includes: title, brand, price range, reasoning
5. User can:
   └─ Save suggestions (wishlist)
   └─ Refine via chat ("something more traditional")
   └─ Browse marketplace by category
   └─ Proceed to purchase (external link)
```

**Alternative entry — Quiz Flow:**

```
1. User selects "This or That" Quiz
2. Answers 10 quick preference questions
3. AI builds a gift persona from answers
4. Suggestions generated from persona
```

---

## 6. Feature Requirements

### 6.1 Recipient Profile Input

- Users can describe the recipient in free text or structured fields
- Required fields: relationship, interests, occasion, budget
- Optional fields: anti-wishlist, recent life events (e.g. "just got promoted")
- Multi-step form with validation before proceeding to suggestions

### 6.2 AI Gift Generator

- Generates 4 personalised suggestions per request
- Each suggestion includes: title, brand, price range, category, description, and AI reasoning
- Suggestions must respect the specified budget range
- Preference for Indian brands where relevant (Vahdam, Forest Essentials, Blue Tokai, Fabindia, Thrillophilia, etc.)
- User can refresh for a new set of suggestions

### 6.3 Gift Scout (Conversational Refinement)

- Chat interface allowing users to refine suggestions in natural language
- Example inputs: "under ₹1,000", "something more traditional", "for Diwali"
- AI responds with updated suggestion list and a brief acknowledgement
- Chat history persists within the session

### 6.4 This or That Quiz

- 10 binary-choice questions covering lifestyle preferences (food, travel, music, sports, etc.)
- Questions use Indian cultural context (chai vs. coffee, Bollywood vs. indie, hill station vs. Goa, etc.)
- AI builds a gift persona from answers: headline, interest summary, personality tags, gift style, anti-wishlist
- Persona can be saved and used to generate suggestions immediately

### 6.5 Marketplace

- Curated catalogue of Indian gift products across categories
- Filterable by category (Food & Drink, Wellness, Fashion, Experience, etc.)
- Each listing shows brand, price, star rating, and review count
- "Browse Shop" links from suggestion cards navigate to relevant category filter

### 6.6 Dashboard

- Overview of upcoming occasions with days-remaining countdown
- People list with relationship health scores (Vibe Score)
- Quick-access "Gift Ideas" per person
- Summary stats: gifts given, total spend, average gift value

### 6.7 People Management

- Add, view, and manage recipient profiles
- Each profile stores: name, relationship, emoji, interests, anti-wishlist, life events, vibe score, gift history
- Vibe Score (0–100) reflects recency and quality of past gifts

---

## 7. User Stories & Acceptance Criteria

### US-01 — Get gift suggestions for a known recipient

> *As a user, I want to enter details about someone I know so I can get personalised gift ideas quickly.*

**Acceptance Criteria:**
- [ ] User can fill a multi-step form (name, relationship, interests, occasion, budget)
- [ ] On submission, AI returns at least 4 suggestions within 10 seconds
- [ ] Each suggestion includes a title, brand, price range, and reasoning
- [ ] Suggestions respect the selected budget range
- [ ] User can refresh to get a new set of suggestions

---

### US-02 — Refine suggestions via chat

> *As a user, I want to refine AI suggestions by typing follow-up requests so I can narrow down to what feels right.*

**Acceptance Criteria:**
- [ ] A chat panel is accessible on the suggestions page
- [ ] Sending a message regenerates the suggestion list based on the new input
- [ ] AI provides a one-line acknowledgement alongside the updated suggestions
- [ ] Chat history is visible within the session

---

### US-03 — Discover preferences via quiz

> *As a user, I want to answer quick questions about someone so the AI can figure out their gift persona without me needing to describe them in detail.*

**Acceptance Criteria:**
- [ ] Quiz presents 10 binary-choice questions with Indian cultural context
- [ ] Progress bar shows completion status
- [ ] On completion, AI generates a persona with headline, personality tags, and gift style
- [ ] User can save the persona and proceed directly to suggestions
- [ ] User can retake the quiz

---

### US-04 — Browse marketplace by category

> *As a user, I want to explore curated Indian gift products so I can discover options beyond AI suggestions.*

**Acceptance Criteria:**
- [ ] Marketplace shows products filterable by category
- [ ] Each product card shows brand, price, rating, and review count
- [ ] "Browse Shop" on a suggestion card navigates to the relevant marketplace category

---

### US-05 — Track upcoming occasions

> *As a user, I want to see upcoming occasions for people I've added so I never miss an important date.*

**Acceptance Criteria:**
- [ ] Dashboard displays upcoming occasions with days-remaining
- [ ] Occasions within 14 days are visually highlighted
- [ ] "Gift" button on each occasion navigates to suggestions for that person

---

## 8. Technical Architecture

### Current Prototype Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (JSX, Hooks) |
| Styling | Inline styles with design tokens |
| AI Integration | LLM API (model-agnostic — see note) |
| Deployment | Vercel (static + serverless) |
| State Management | React `useState` / `localStorage` |
| Build | Babel standalone (no bundler) |

### AI Integration (Model-Agnostic)

The prompt layer is designed to be model-agnostic. The API call is abstracted in a single `ask(prompt, maxTokens)` utility:

- **In production (Vercel):** Calls `/api/suggest` — a serverless proxy that holds the API key securely
- **In local/preview:** Can call any LLM API endpoint directly (key injected via environment variable)

This means the underlying model (Gemini, Claude, OpenAI, etc.) can be swapped without changing product logic.

### Prompt Design

Prompts are structured with explicit context injection:

```
Recipient: [name] ([relationship])
Interests: [free text]
Anti-wishlist: [optional]
Recent events: [optional]
Occasion: [occasion]
Budget: [range in ₹]
```

Output is constrained to a JSON array for reliable parsing:

```json
[{ "title": "", "description": "", "reasoning": "", "priceRange": "", "category": "", "brand": "" }]
```

### File Structure

```
/
├── index.html           # Landing page
├── app.html             # Main React application
├── vercel.json          # Vercel routing + build config
└── api/
    └── suggest.js       # Serverless proxy for LLM API key
```

---

## 9. AI Design Decisions

### Why AI instead of traditional recommendations?

Traditional recommendation systems require purchase history or browsing data — neither of which exists when buying a gift for someone else. AI allows:

- **Semantic understanding** of free-text recipient descriptions
- **Cultural context awareness** (Indian occasions, regional preferences)
- **Creative, non-obvious suggestions** that keyword search cannot generate

### Human-readable suggestions, not direct product links

Suggestions describe a gift concept + brand rather than linking to a specific product listing. This:

- Reduces bias toward any single merchant
- Keeps suggestions useful even if a specific SKU goes out of stock
- Gives users flexibility to purchase from their preferred channel

### Context-first input over keyword search

Asking for relationship, occasion, and interests produces significantly better results than a search bar. Structured context reduces vague or generic AI outputs.

### Prompt guardrails

- Budget is passed as a range; AI is instructed to respect it
- Anti-wishlist field explicitly tells the AI what to avoid
- Brand guidance is embedded in the system prompt to bias toward known Indian brands

---

## 10. Success Metrics

### Product Metrics

| Metric | Target |
|---|---|
| Time to first gift suggestion | < 10 seconds |
| Suggestion acceptance rate (saved or clicked) | > 30% |
| Quiz completion rate | > 70% |
| Suggestion refresh rate | < 2 per session (lower = better first-attempt quality) |

### Business Metrics (Post-Launch)

| Metric | Target |
|---|---|
| Gift purchase conversion rate | +10% vs. manual browse (A/B) |
| Time to gift decision | −30% vs. control |
| User return rate for next occasion | > 40% |
| Average order value for AI-assisted purchases | Track vs. baseline |

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| AI generates irrelevant suggestions | High | Allow user feedback; one-click refresh; chat refinement |
| Generic output due to weak prompts | Medium | Structured prompt templates; enforce brand + budget constraints |
| API latency degrades experience | Medium | Loading states with progress animation; stream responses in v2 |
| API key exposed in client-side code | High | Serverless proxy on Vercel hides key from browser |
| User shares sensitive personal data | Medium | Do not persist personal data server-side in v0.1; add privacy notice |
| LLM returns malformed JSON | Medium | `pj()` parser with regex fallback; graceful error state in UI |

---

## 12. Out of Scope

The following are explicitly **not** part of v0.1:

- User login / authentication
- Persistent server-side storage of profiles or gift history
- Real-time product inventory or pricing
- Payment processing or checkout
- Push notifications or occasion reminders
- Mobile app (iOS / Android)
- Non-Indian markets or multi-currency support
- Seller or merchant onboarding

---

## 13. Experiment Plan

### Hypothesis

AI-assisted gift discovery reduces the time to a confident gift decision and increases purchase intent compared to manual marketplace browsing.

### Setup

| | Control | Variant |
|---|---|---|
| **Experience** | User browses marketplace manually | AI suggestions appear on recipient input |
| **Sample** | 50% of new sessions | 50% of new sessions |
| **Duration** | 4 weeks | 4 weeks |

### Primary Success Criteria

- Reduce time to gift selection by **≥ 30%**
- Increase gift purchase click-through rate by **≥ 10%**

### Secondary Metrics

- Suggestion acceptance rate (save / click)
- Number of suggestion refreshes per session
- Quiz completion rate

---

## 14. Future Roadmap

| Phase | Feature |
|---|---|
| **v0.2** | Vercel serverless API proxy for secure key management |
| **v0.2** | Persistent recipient profiles (database or localStorage sync) |
| **v0.3** | Occasion calendar with reminders (email or push) |
| **v0.3** | Real e-commerce product links via affiliate or partner API |
| **v0.4** | Shareable anonymous quiz links (recipient fills it out themselves) |
| **v0.4** | Gift history tracking with vibe score updates |
| **v1.0** | User accounts (Google OAuth) |
| **v1.0** | Group gifting — split cost across contributors |
| **v1.1** | AI-generated personalised messages and gift cards |
| **v1.1** | Seller/brand dashboard for D2C integration |

---

## 15. Glossary

| Term | Definition |
|---|---|
| **Vibe Score** | A 0–100 score per recipient reflecting relationship health, based on recency and quality of past gifts |
| **Gift Persona** | An AI-generated profile of a recipient's preferences, derived from quiz answers |
| **Anti-Wishlist** | Items or categories the recipient explicitly dislikes or doesn't want |
| **Gift Scout** | The in-app conversational interface for refining AI suggestions via natural language |
| **Occasion** | A gifting event (Birthday, Diwali, Rakhi, Anniversary, etc.) used to contextualise suggestions |
| **This or That Quiz** | A 10-question binary preference quiz used to build a gift persona without manual input |
| **Serverless Proxy** | A Vercel API route (`/api/suggest`) that makes LLM API calls server-side, keeping the API key out of the browser |

---

*EchoGifts — Made for India 🇮🇳*
