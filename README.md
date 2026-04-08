# 🚨 ResQNav — Real-Time Emergency Traffic Management & Smart Routing System

Environment Variables ->

1.) Server -> 

# Server Configuration
PORT=5001

# Database
DATABASE_URL="file:./dev.db"

# Google Maps (Server-side)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# OpenWeather API
OPENWEATHER_API_KEY=your_openweather_api_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Twilio (SMS Service)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

2.) Client -> 

# Google Maps (Client-side)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Backend API URL
VITE_API_URL=http://localhost:5001/api

> *"When every second counts, ResQNav clears the way."*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-Expo-blue?style=flat-square&logo=react)](https://expo.dev/)
[![Google Maps](https://img.shields.io/badge/Google_Maps_API-enabled-green?style=flat-square&logo=googlemaps)](https://developers.google.com/maps)
[![Twilio](https://img.shields.io/badge/Twilio_SMS-integrated-red?style=flat-square&logo=twilio)](https://www.twilio.com/)
[![SQLite](https://img.shields.io/badge/SQLite+Prisma-database-blue?style=flat-square&logo=sqlite)](https://www.prisma.io/)
[![Blockchain](https://img.shields.io/badge/Blockchain-Ledger-orange?style=flat-square)](https://en.wikipedia.org/wiki/Blockchain)

---

## 📌 Table of Contents

1. [Problem Statement](#-problem-statement)
2. [Our Solution](#-our-solution)
3. [Key Features](#-key-features)
4. [Target Users & Use Cases](#-target-users--use-cases)
5. [Real-World Scenario](#-real-world-scenario)
6. [System Architecture](#-system-architecture)
7. [Technical Approach](#-technical-approach)
8. [Tech Stack & Resources Required](#-tech-stack--resources-required)
9. [Innovation & Impact](#-innovation--impact)
10. [Future Scope](#-future-scope)
11. [Team](#-team)

---

## 🔴 Problem Statement

**What problem are we solving?**

Sudden accidents and road closures in metropolitan cities create severe traffic bottlenecks, trapping daily commuters and **delaying life-saving emergency responses**.

**Why is it important to solve?**

This creates a **double-edged crisis**:
- The general public suffers massive inconvenience and wasted time.
- Accident victims face life-threatening situations because emergency vehicles take too long to reach them through the gridlock.

**Example Scenario:**
> If a user is driving from Location A to Location B and a sudden road closure happens (due to severe weather or a crash), they get completely stuck. More critically, an ambulance trying to reach the victim gets trapped in that exact same traffic — making the immediate response time far too slow.

### 📰 Real Headlines That Inspired This Project

- **"Screamed In Pain": Maharashtra Woman Dies In Ambulance Stuck in NH 48 Jam**
- **16-Month-Old Baby Allegedly Dies After Ambulance Stuck 5 Hours in Mumbai–Ahmedabad Highway Traffic Jam**

These incidents highlight the urgent need for a smarter, technology-driven emergency traffic management system.

---

## 💡 Our Solution

**ResQNav** provides **real-time incident tracking** and **smart routing** for everyday drivers and emergency responders, so they can avoid sudden traffic jams and reach accident victims much faster.

### Core Pillars

| Pillar | Description |
|---|---|
| 🔍 **Detect & Verify** | Custom database filters verify accident reports sent by users, ensuring emergency services only get real, accurate data. |
| 🗺️ **Smart Routing** | Instantly finds the fastest alternative routes for regular commuters, keeping them out of traffic and clearing the way for rescue teams. |
| 🔔 **Alert & Connect** | Acts as a digital bridge, sending instant notifications and exact locations to hospitals and government agencies for a rapid emergency response. |

---

## ⚙️ Key Features

### 1. 🤖 AI Chatbot Assistant (ResQBot)
- Collects user reports, geotagged images, and live GPS locations.
- Feeds all data directly into the verification phase.
- Powered by **Google Gemini** for intelligent, conversational incident reporting.

### 2. ✅ Verified Incident Filtering
- Eliminates fake reports instantly using a **custom database** and **spatial GPS checks**.
- Every crowdsourced public report is strictly verified before any alert is triggered.

### 3. 🟢 Priority Green Corridors
- Actively calculates and clears the **fastest path** for ambulances and rescue teams.
- Creates a dedicated emergency lane in real-time through dynamic traffic signal coordination.

### 4. 🔄 Smart Commuter Rerouting
- Proactively diverts daily traffic with **"Take this path, save a life"** alerts.
- Keeps emergency corridors completely unobstructed for first responders.

### 5. 📡 Automated Emergency Dispatch
- Acts as a **direct digital bridge** to alert hospitals and government agencies instantly.
- Sends real-time SMS alerts via **Twilio** with verified incident coordinates.

---

## 👥 Target Users & Use Cases

ResQNav serves a **primary-to-secondary user spectrum**:

| User Type | Benefit |
|---|---|
| 🚑 **Ambulance Drivers** | Receives the fastest priority route to the incident site |
| 🚒 **Firefighters** | Receives fastest priority route with real-time rerouting |
| 👮 **Police** | Receives fastest priority route for rapid scene management |
| 🏥 **Hospital Administrators** | Manages emergency response effectively with pre-arrival data |
| 🚗 **Daily Commuters** | Avoids traffic jams through smart notifications |
| 🛵 **Ride-hailing Drivers** | Avoids traffic jams with alternate route suggestions |

### Real-Life Use Case
> A severe accident blocks a major road. A user reports it on ResQNav, and our database instantly verifies the event. Immediately, an approaching ambulance receives the fastest priority route. Simultaneously, our route tracking system actively diverts normal commuters to alternate roads with the notification: **"Take this path, save a life"** — keeping the emergency corridor completely clear.

**Outcome:** Lives are saved because emergency response times drop drastically. Rescue teams get a clear, stress-free path, and daily drivers avoid wasting hours trapped in an unexpected traffic jam.

---

## 🚧 Real-World Scenario (Demo Walkthrough)

**Situation:**
- A road accident occurs on a busy city road during rush hour.
- Traffic congestion builds up rapidly, blocking all lanes.
- An ambulance is dispatched but gets stuck in traffic.

**With ResQNav's Solution:**
1. Accident is **instantly reported** via AI chatbot / GPS detection.
2. **Nearby users receive alerts** and are rerouted automatically.
3. A **green corridor is created** for the ambulance.
4. **Emergency services are notified** in real-time.

**Result:**
- ✅ Faster ambulance response
- ✅ Reduced traffic congestion
- ✅ Increased chances of saving lives

---

## 🏗️ System Architecture

USER
└──> ResQNav App (Navigation | Emergencies)
├──> AI CHATBOT (ResQBot)
│ └── Takes image of injury/accident
│ └── Sends information after analyzing the image
│
├──> FILTERS (Verification Layer)
│ └── Confirms incident with geo-location & text info
│
├──> SYSTEM DATABASE (Central Hub)
│ ├── Google Map API
│ ├── Traffic Signal Data
│ └── Weather API
│
├──> ALERTS MODULE
│ ├── Others (Emergency)
│ ├── Fire Stations
│ └── Hospitals
│
└──> DESTINATION REACHED
└── Gives users the best and fastest routes
considering road closures and accidents


**Data Flow Summary:**
- User submits a report → Chatbot analyzes image and geolocates the incident.
- The **Verification Filter** confirms the incident using GPS coordinates and text data.
- The **System Database** (fed by Google Maps, Traffic Signals, and Weather APIs) processes the incident.
- **Alerts** are dispatched to emergency services.
- **Optimized routing** is pushed to all affected users, guiding them to their destination safely.

---

## 🛠️ Technical Approach

### Architecture Layers

#### 🖥️ Client Layer (UI)
| Component | Technology | Purpose |
|---|---|---|
| Web App | **Next.js 14 PWA** (Neumorphism Frame) | Main user interface — cross-platform |
| Mobile App | **React Native Expo** | Cross-platform mobile experience |
| Dashboard & Maps | **Google Maps** (corridor view) | Real-time map rendering and navigation |

#### 🤖 AI / Input Layer
| Component | Technology | Purpose |
|---|---|---|
| ResQBot | **Google Gemini Chatbot** | Conversational incident reporting |
| Voice Input | Speech-to-incident engine | Hands-free incident reporting while driving |
| Map Interaction | Pin-drop reporting | User marks exact incident location on the map |
| AI Verify | Debug & validate module | Validates all incoming reports before processing |

#### ⚙️ Backend Layer
| Component | Technology | Purpose |
|---|---|---|
| Incident Engine | **Prisma + SQLite + Events** | Handles and stores incident data |
| Priority Routing | Green corridor dispatch | Calculates and clears emergency lanes dynamically |
| Analytics | Hotspot & KPI tracking | Monitors congestion trends and system performance |

#### 🔗 Services Layer
| Service | Provider | Role |
|---|---|---|
| SMS Alerts | **Twilio SMS** | Offline fallback alerts to emergency responders |
| Payments | **Razorpay** | Civic rewards and dispatch flow payments |
| Navigation | **Google Maps API** | Live traffic routing |
| Live Analytics | Real-time stream | Congestion and response monitoring |

#### 🔐 Data / Trust Layer
| Component | Technology | Purpose |
|---|---|---|
| Primary Database | **SQLite + Prisma** | Incidents, users, and logs |
| Immutable Audit | **Blockchain Ledger** | Tamper-proof, transparent audit compliance |
| Real-Time Events | **WebSocket Event Bus** | Live streaming of incident and traffic updates |

#### 👤 Stakeholders
- **Gov / Insurance** — Incident audit & compliance reports
- **Responders (Ambulance/Fire/Police)** — Dispatch SMS and fastest routes
- **Citizens** — Report incidents, track status, earn civic incentives

---

## 📦 Tech Stack & Resources Required

### Core Technologies

Frontend: Next.js 14 (PWA) | React Native Expo
Backend: Node.js | Prisma ORM | SQLite
AI/ML: Google Gemini API (ResQBot chatbot)
Database: SQLite + Prisma | Blockchain Ledger
APIs: Google Maps API | Traffic Signal API | Live Weather API
Messaging: Twilio SMS
Payments: Razorpay
Real-time: WebSocket (event bus)
Cloud: AWS / Google Cloud


### External Resources Required

| Resource | Purpose |
|---|---|
| **Google Maps / Mapbox API** | Base routing and map rendering |
| **Live Weather & Traffic APIs** | Contextual data for dynamic rerouting |
| **AWS / Google Cloud Credits** | Hosting the real-time spatial database and chatbot backend |
| **Twilio API** | SMS-based alert delivery as offline fallback |

### Timeline & Feasibility

- **Core MVP** (chatbot + database + routing): Highly feasible within a **hackathon limit**.
- **Assumption**: The system relies on a critical mass of everyday drivers using the app to provide crowdsourced reports and clear the roads.

---

## 🌟 Innovation & Impact

### Innovation Aspects

- 🔗 Creates a **first-of-its-kind bridge** between a daily map app and a life-saving emergency alert system.
- 🤝 Combines **frictionless UX** (AI Chatbot reporting) with **deep tech** (spatial database filtering).
- 📢 Includes **direct, automated dispatch alerts** to governments and hospitals.
- 🚦 Uses a **priority system** to treat emergency traffic differently from regular traffic.
- ✔️ Ensures reliability by **strictly verifying every crowdsourced public report** before acting on it.

### Impact

- 🚑 **Reduces ambulance response time** and improves emergency outcomes.
- 🚗 **Minimizes traffic congestion** in critical situations.
- ⏱️ **Saves time and fuel** for daily commuters.
- 🤝 **Enables faster coordination** between public and emergency services.
- 🏙️ **Contributes to safer and smarter urban mobility**.

---

## 🔭 Future Scope

### Business & Partnerships
- 🏛️ Securing **B2G (Business-to-Government) partnerships** with smart city planners.
- 🚗 Integrating alerts directly into **autonomous vehicle dashboards**.
- 🏅 Introducing **civic rewards** for users who report verified incidents.

### Long-Term Impact
- 🌍 **Highly scalable** to any major metropolis globally.
- 📉 **Reduces ambulance fatality rates** caused by avoidable delays.
- ⛽ **Saves thousands of hours and fuel** for daily commuters.
- 🚦 **Helps avoid large-scale traffic gridlock** in metropolitan areas.

### 🚁 Stretch Goal — Automated Drone Dispatch
> Linking verified GPS coordinates to **emergency drone networks** to deliver first-aid supplies at the accident site **before ambulances even arrive**.

This feature would revolutionize first-response care in dense urban environments where road access is critically delayed.


## 📄 License

This project is developed for hackathon purposes. All rights reserved by the ResQNav team.

---

> **ResQNav** — *Detect. Route. Save Lives.* 🚨
