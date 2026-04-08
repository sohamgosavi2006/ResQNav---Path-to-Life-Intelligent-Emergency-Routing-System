# 🚨 ResQNav — Path to Life

### AI-Powered Emergency Traffic Orchestration & Smart Routing System

> *“When every second counts, ResQNav clears the way.”*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square\&logo=next.js)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-Expo-blue?style=flat-square\&logo=react)](https://expo.dev/)
[![Google Maps](https://img.shields.io/badge/Google_Maps_API-enabled-green?style=flat-square\&logo=googlemaps)](https://developers.google.com/maps)
[![Twilio](https://img.shields.io/badge/Twilio_SMS-integrated-red?style=flat-square\&logo=twilio)](https://www.twilio.com/)
[![SQLite](https://img.shields.io/badge/SQLite+Prisma-database-blue?style=flat-square\&logo=sqlite)](https://www.prisma.io/)
[![Blockchain](https://img.shields.io/badge/Blockchain-Ledger-orange?style=flat-square)](https://en.wikipedia.org/wiki/Blockchain)

---

## 📌 Overview

**ResQNav** is a real-time intelligent traffic orchestration system designed to prioritize emergency response while maintaining efficient urban mobility. It transforms traditional navigation into a **proactive, life-saving system** by combining AI, real-time data, smart routing, and civic participation.

---

## 🔴 Problem Statement

Sudden accidents and road closures in metropolitan cities create severe traffic bottlenecks, trapping daily commuters and delaying life-saving emergency responses.

### Why it matters:

* 🚗 Public faces massive delays and fuel wastage
* 🚑 Emergency vehicles get stuck in traffic
* ⏱ Critical response time increases → risk to life

### Real Scenario:

> An ambulance trying to reach a victim gets trapped in the same traffic as commuters — making immediate response far too slow.

---

## 💡 Our Solution

ResQNav introduces a **real-time, AI-powered traffic coordination system** that:

* Detects and verifies incidents
* Dynamically reroutes traffic
* Creates emergency “green corridors”
* Instantly connects responders

---

Twilio SMS Sent to our Server Mobile Number from Twilio Number which informs us where the incident has occured

<img width="414" height="896" alt="IMG_4920" src="https://github.com/user-attachments/assets/1131fc7e-ab8b-4794-bd0c-c3d41f8be485" />


---

## ⚙️ Key Features

### 🤖 AI Chatbot (ResQBot)

* Voice + text-based incident reporting
* Multilingual support
* Powered by Google Gemini

---

### ✅ Verified Incident Engine

* AI + GPS-based validation
* Multi-layer verification (crowd + sensor + metadata)
* Prevents fake reports

---

### 🟢 Dynamic Green Corridor

* Automatically clears traffic for ambulances
* Priority-based routing system
* Real-time road optimization

---

### 🔄 Smart Rerouting System

* Diverts civilian traffic intelligently
* Alert: *“Take this path, save a life”*
* Reduces congestion dynamically

---

### 📡 SMS Fallback System

* Works without internet using Twilio
* Sends emergency alerts via SMS
* Ensures reliability in low connectivity

---

### 💳 Fintech Integration

* Ambulance booking via Razorpay
* Micro-transactions & payments
* Incentive-based participation

---

### 🔗 Blockchain Trust Layer

* Immutable incident logs
* Transparent emergency response tracking
* Useful for insurance & audits

---

### 📊 Analytics Dashboard

* Accident hotspots
* Traffic patterns
* Response time KPIs

---

### 📱 Cross-Platform Access

* Web App (Next.js PWA)
* Mobile App (React Native Expo)

---

## 👥 Target Users

| User                 | Benefit                      |
| -------------------- | ---------------------------- |
| 🚑 Ambulance Drivers | Fastest priority route       |
| 👮 Police            | Faster response coordination |
| 🏥 Hospitals         | Pre-arrival emergency data   |
| 🚗 Commuters         | Avoid traffic via rerouting  |
| 🏙 Governments       | Traffic analytics & control  |

---

## 🚧 Real-World Workflow

1. Accident occurs
2. User / AI detects incident
3. System verifies event
4. Alerts sent to responders
5. Traffic rerouted
6. Green corridor created
7. Ambulance reaches faster

---

## 🏗️ System Architecture

**Input Layer**

* User app, chatbot, GPS, voice input

**Processing Layer**

* Verification engine
* Routing engine
* Analytics system

**Service Layer**

* Maps API
* SMS alerts
* Payment gateway

**Data Layer**

* SQLite + Prisma
* Blockchain ledger

---

## 🛠️ Tech Stack

### Frontend

* Next.js 14 (PWA)
* React Native (Expo)
* Tailwind CSS + Framer Motion

### Backend

* Node.js
* Prisma ORM
* SQLite

### Integrations

* Google Maps API
* Twilio (SMS)
* Razorpay (Payments)
* OpenWeather API
* Google Gemini AI

---

## ⚙️ Environment Variables

### 🖥️ Server (.env)

```env
PORT=5001
DATABASE_URL="file:./dev.db"

GOOGLE_MAPS_API_KEY=your_google_maps_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
GEMINI_API_KEY=your_gemini_api_key

TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

---

### 🌐 Client (.env.local)

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_API_URL=http://localhost:5001/api
```

---

## 💰 Business Model

### 🏙 B2G (Primary)

* Government SaaS licensing
* Smart city integration

### 🏢 B2B

* Hospitals & ambulance networks
* Fleet optimization services
* API subscriptions

### 📱 B2C

* Freemium app model
* Premium features subscription

### 💳 Revenue Streams

* Razorpay transaction fees
* Data analytics insights
* Sponsored rewards

---

## 🌟 Innovation & Impact

### Innovation

* First system combining navigation + emergency response
* AI + blockchain + real-time routing
* Citizen participation model

### Impact

* 🚑 Saves lives
* 🚗 Reduces traffic congestion
* ⛽ Saves fuel & time
* 🌍 Enables smarter cities

---

## 🔭 Future Scope

* Smart traffic signal integration
* Autonomous vehicle integration
* Drone-based emergency delivery
* Global smart city deployment

---

## ⚡ Scalability

* Cloud-native architecture
* Real-time streaming systems
* Microservices ready
* Network effect growth

---

## 🛡 Security

* bcryptjs password hashing
* API key protection via environment variables
* Blockchain-based data integrity

---

## 📄 License

This project is developed for hackathon purposes. All rights reserved by the ResQNav team.

---

## 👨‍💻 Team

* Soham Gosavi
* Debarpan Chaudhuri
* Vaishnavi Jagtap
* Shristi Rani

---

# 🚀 Final Note

> **ResQNav is not just a navigation system — it is a life-saving traffic intelligence network.**
