# StayNest - Native Android PG Accommodation & Property Management App

StayNest is a complete, native Android application for discovering and managing Paying Guest (PG) accommodations, built with **Kotlin**, **Jetpack Compose**, **Material 3**, **Navigation Compose**, and a maintainable **MVVM Architecture**.

---

## 🌟 App Roles & Features

StayNest provides role-tailored user experiences for three distinct user types:

### 1. 🏠 Resident Experience
- **Sign Up / Sign In**: Email/Password, Firebase Phone Auth, and secure server-side Email OTP.
- **PG Discovery**: Neighbourhood search, filters for rent range, room sharing types, amenities (WiFi, AC, Food, Gym), and safety features (CCTV, Guards, Biometric Gate).
- **Sorting & Property Details**: Sort by rent or rating, view detailed rules and room pricing.
- **Saved PGs & Visits**: Save favorite properties, schedule PG visits with preferred time slots, and manage room reservation requests.
- **Maintenance Ticket System ("Raise a Ticket")**:
  - Submit maintenance requests with issue title, room number, category (Plumbing, Electrical, Cleaning, Appliance), priority (Low, Medium, High, Urgent), and detailed description.
  - Automatically attaches signed-in resident's identity and timestamp.
  - Real-time ticket queue tracking with status timeline history updated live by maintenance staff.

### 2. 🏢 Property Owner Experience
- **Live Dashboard**: Summary cards for total properties, available rooms/beds, pending visit tours, pending reservations, and open maintenance tickets.
- **Property & Room Management**: Add/Edit PG listings, addresses, amenities, pricing, rules, and manage individual room units.
- **Bookings & Reviews**: Confirm or cancel visit requests and room reservations, inspect waitlist requests and resident reviews.
- **Maintenance Staff Access Control**: Add staff by email or phone number; approve or revoke operational access with server-side enforcement.
- **CSV Reports & Export**: Export property occupancy and maintenance summary reports directly as `.csv` files.

### 3. 🛠️ Maintenance Staff Experience
- **Operational Access Control**: Requires property owner approval before accessing operational data. Unapproved staff are directed to an access restriction screen with sign-out.
- **Real-Time Ticket Queue**: Live queue of resident tickets displaying requester info, property/room, priority, and description.
- **Status Updates with Audit Trail**: Update status (`OPEN`, `IN_PROGRESS`, `SCHEDULED`, `COMPLETED`, `CANCELLED`) with custom notes. Automatically records who updated it and when. Updates appear instantly on the resident's device.
- **Preventive Maintenance & Housekeeping**: Schedule and complete recurring service tasks (water tank cleaning, fire extinguisher checks) and room housekeeping tasks.
- **Inventory & Alerts**: Track spare parts (bulbs, valves, filters) with low-inventory threshold indicators and resolve operational alerts.
- **CSV Export**: Export maintenance ticket resolution logs.

---

## 🔒 Backend, Security & Cloud Functions

StayNest uses **Firebase Authentication** and **Cloud Firestore** for real-time shared data across devices.

### Server-Side Email OTP & Staff Approvals (`functions/index.js`)
- **`sendEmailOtp`**: Generates a 6-digit cryptographically secure OTP on the server, stores the expiration hash in Firestore, and sends an email via configured Nodemailer / SMTP / SendGrid secrets. *OTPs are never exposed in client API responses.*
- **`verifyEmailOtp`**: Validates OTP expiration and code server-side, returning a Firebase Custom Auth Token.
- **`approveMaintenanceStaff`**: Privileged action restricting staff account approval to authenticated Property Owners.

### Security Rules (`firestore.rules`)
- Role- and property-scoped permissions enforce read/write access:
  - **Residents**: Can read/write their own tickets, visits, reservations, and saved properties.
  - **Maintenance Staff**: Authorized approved staff can read/update ticket queues and maintenance operations.
  - **Property Owners**: Full management access to their properties, rooms, staff members, and bookings.

---

## 🛠️ Firebase Setup Guide

If `google-services.json` is missing or unconfigured, StayNest automatically displays an **Interactive Firebase Setup Screen** with step-by-step setup guides and an option to explore the app in **Local Demo Mode**.

### Step 1: Add Firebase Configuration
1. Register an Android app in the [Firebase Console](https://console.firebase.google.com/) with package name `com.example.staynest`.
2. Download `google-services.json` and place it in `app/google-services.json`.

### Step 2: Enable Firebase Authentication
- In Firebase Console > Authentication > Sign-in method:
  - Enable **Email/Password**
  - Enable **Phone Auth**

### Step 3: Deploy Firestore Security Rules & Indexes
Run the following commands using the Firebase CLI:
```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### Step 4: Deploy Cloud Functions
```bash
cd functions
npm install
firebase deploy --only functions
```

Set email provider secrets for Nodemailer:
```bash
firebase functions:secrets:set SMTP_EMAIL
firebase functions:secrets:set SMTP_PASSWORD
```

---

## 🧪 Testing & Execution

### Running Unit Tests
Unit tests cover form validation, ticket ownership/permissions, and ticket status transition history:
```bash
./gradlew testDebugUnitTest
```

### Running Compose UI Instrumentation Tests
```bash
./gradlew connectedAndroidTest
```

### Building & Running the App
Build debug APK and launch on an Android emulator or connected physical device:
```bash
./gradlew assembleDebug
```
Or use the **Run** button in Android Studio.
