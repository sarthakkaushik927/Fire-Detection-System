# 🔥 Fire Detection System

A real-time monitoring and alerting platform designed to detect fire and smoke using integrated camera feeds and IoT sensors. This project provides a highly responsive dashboard for operators to track anomalies, view live feeds, and manage emergency alerts.

## 🚀 Overview

The Fire Detection System bridges the gap between hardware sensors/computer vision models and end-user visibility. When a connected sensor or AI model detects fire or smoke, the system instantly logs the event and pushes an alert to this web-based dashboard. 

The frontend is built using **React** and **Vite**, ensuring blazing-fast performance and an optimized developer experience.

## ✨ Key Features

* **Real-Time Monitoring:** View live status updates from all connected thermal cameras and smoke sensors.
* **Instant Alerts:** Visual and auditory notifications on the dashboard when a threat is detected.
* **Historical Logs:** Review past incidents, including timestamps, location data, and severity levels.
* **System Diagnostics:** Monitor the battery life and connectivity status of physical IoT sensors.
* **Responsive Design:** Fully functional on desktop, tablet, and mobile devices for on-the-go monitoring.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite (for fast HMR and optimized builds)
* **Styling:** Tailwind CSS (or your preferred CSS framework)
* **Backend/API (Example):** Node.js / Express or Python / FastAPI
* **Hardware/AI Integration:** WebSockets for real-time telemetry data

---

## ⚙️ Getting Started

Follow these instructions to set up the dashboard on your local machine for development and testing.

### Prerequisites

Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
* npm, yarn, or pnpm

### Installation

**1. Clone the repository**
```bash
git clone [https://github.com/yourusername/fire-detection-system.git](https://github.com/yourusername/fire-detection-system.git)
cd fire-detection-system
```

**2. Install dependencies**
```bash
npm install
# or
yarn install
```

**3. Set up environment variables**
Create a `.env` file in the root directory and configure your backend/websocket endpoints:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WEBSOCKET_URL=ws://localhost:3000/realtime
```

**4. Start the development server**
```bash
npm run dev
# or
yarn dev
```
The application will be available at `http://localhost:5173`.

---

## 🏗️ Build & Deployment

To create a production-ready build of the dashboard:

```bash
npm run build
```
This will generate a `dist` folder containing the compiled static assets, which can be deployed to Vercel, Netlify, AWS S3, or any standard web server.

---

## 🛡️ ESLint & Code Quality

This project is configured with ESLint to maintain code quality. If you are extending this to a production application, we highly recommend using TypeScript for type-aware linting to catch data-structure errors from your sensor payloads. 

To run the linter:
```bash
npm run lint
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the detection algorithms, enhance the UI, or add support for new sensor types:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
