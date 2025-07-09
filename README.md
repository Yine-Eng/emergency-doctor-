# 🩺 Emergency Doctor

**Emergency Doctor** is a free, cross-platform mobile application built with React Native and backed by a secure Node.js + Express + MongoDB backend. It is designed to **assist users in emergencies**, provide **first aid guidance**, enable **quick emergency reporting**, and support **secure medical profile access** — even from a locked screen.

---

## 🚨 What It Solves

- 📍 **Injury Identification:** Users can select body parts on a diagram to report injuries quickly.
- 📄 **Automatic Report Generation:** The app generates a report that can be shared with emergency contacts or doctors.
- 👩‍⚕️ **First Aid Education:** Offers professional, reliable first-aid steps for common emergencies.
- 🧠 **Medical History on Lock Screen:** Allows optional viewing of critical medical data (e.g. allergies, blood type) from the lock screen.
- 📞 **Emergency Contact Notifications:** Sends messages to pre-selected contacts during alerts.
- 📡 **Disaster Alerts & Forecasting:** Receives AI-powered weather or disaster predictions and sends preemptive warnings.

---

## 🔐 Core Features (Security & UX First)

- Secure **user authentication and role-based authorization**
- 🧠 Intelligent UI with **dark/light themes**
- ✍️ Users can **add notes**, update **emergency contacts**, and mark **favorites**
- ⛑️ Designed to work **offline after initial setup** (coming soon)

---

## 🧱 Technologies Used

### Frontend
- **React Native (Expo)** with Tailwind CSS v4 (via `nativewind`)
- **Firebase (optional)** for push notifications / SMS 2FA
- **Capacitor Ready** for future web + desktop deployment

### Backend
- **Node.js + Express**
- **MongoDB (Atlas)**
- **JWT for Token Auth**, `helmet`, `cors`, `rate-limit` middleware
- Role-based access control (admin, doctor, user, guest)
- Rate-limited login with anomaly detection (coming)

---

## 👥 Team

- **Sampson Anaba** – Project Lead, Full Stack Developer

---

## 🧭 Goals & Vision

We aim to make **lifesaving care more accessible**, especially for vulnerable groups, travelers, and individuals who may not have immediate access to healthcare. This app is inspired by real-world emergency gaps and seeks to:

- Improve emergency communication
- Offer real-time, **device-native support**
- Educate users while respecting privacy and cost

---

## ❓ Questions This App Answers

- "What first aid should I apply before help arrives?"
- "How can I quickly notify someone I'm in danger?"
- "What if I can't speak but need to alert someone?"
- "How can emergency responders know my condition from my lock screen?"

---

## 🛡️ Considerations & Philosophy

- All user inputs are treated as **potentially malicious**
- Authentication errors are **non-descriptive** to prevent info leakage
- App performance is optimized for **low-end devices**
- **Free forever** — no ads, no subscriptions (planned)

---

## 💡 Inspiration

- Stories of delayed emergency care
- The lack of professional, free first-aid apps with real utility
- A vision to bring modern design and security-first engineering to humanitarian problems
- 