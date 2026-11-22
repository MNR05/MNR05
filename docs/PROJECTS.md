# Selected projects — technical overview

This document helps readers understand the public repositories featured on my [GitHub profile](../README.md).

> **Scope:** Public projects include academic, experimental and web-development work. Their presence here does not imply production deployment, active maintenance or quantified business outcomes. For accurate setup steps, refer to each repository's source and documentation.

## EventFlow QR — event registration & check-in starter

**Source:** [EventFlow QR](../projects/eventflow-qr/)

**What it demonstrates**
- A clean, independently rewritten registration and check-in flow using Vercel functions.
- Random QR ticket tokens, staff-controlled access, and a browser camera scanner with manual fallback.
- n8n workflow templates with NocoBase collection API interactions.
- A privacy-first configuration model that excludes personal data and institutional integrations.

**Status:** Portfolio code starter. Requires configuration and end-to-end testing with a separate n8n and NocoBase instance; not yet a deployed public service.

**Read more:** [Project README](../projects/eventflow-qr/README.md) · [Setup and security notes](../projects/eventflow-qr/docs/SETUP.md)

## 1. ESP8266 IoT monitoring prototype

**Repository:** [System-of-monitoring-crops-with-EP8266](https://github.com/MNR05/System-of-monitoring-crops-with-EP8266)

**What it demonstrates**
- Microcontroller development with ESP8266 and Arduino/C++.
- Sensor acquisition for temperature, humidity, moisture, smoke and light.
- Telemetry flow toward Azure IoT Central using a sample integration.

**Where to look**
- [Sketch source](https://github.com/MNR05/System-of-monitoring-crops-with-EP8266/blob/main/esp8266_prueb/esp8266_prueb.ino)
- [Existing sample setup notes](https://github.com/MNR05/System-of-monitoring-crops-with-EP8266/blob/main/esp8266_prueb/README.md)

**Documentation still recommended:** hardware wiring diagram, sensor calibration, secure credential handling and real-world testing evidence.

## 2. Desktop sales management system

**Repository:** [Sistema-de-venta-Licoreria](https://github.com/MNR05/Sistema-de-venta-Licoreria)

**What it demonstrates**
- Desktop application development using C#.
- Layered organization: data, business logic and entities.
- Relational database design with Microsoft SQL Server.
- Business functions involving products, users and roles.

**Where to look**
- [Original project README](https://github.com/MNR05/Sistema-de-venta-Licoreria/blob/main/README.md)
- [SQL script](https://github.com/MNR05/Sistema-de-venta-Licoreria/blob/main/ScriptBD.sql)

**Documentation still recommended:** prerequisites, database initialization, screenshots, solution startup steps and a small use-case diagram.

## 3. Jutmay website

**Repository:** [PW_Jutmay](https://github.com/MNR05/PW_Jutmay)

**What it demonstrates**
- Multi-page web structure using HTML, CSS and JavaScript.
- Dedicated service and landing pages.
- Front-end assets and presentation components.

**Where to look**
- [Main entry page](https://github.com/MNR05/PW_Jutmay/blob/master/index.html)
- [Repository source](https://github.com/MNR05/PW_Jutmay)

**Documentation still recommended:** project purpose, screenshots, dependency attribution, instructions for local preview and accessibility checks.

## 4. MedievalGame

**Repository:** [MedievalGame](https://github.com/MNR05/MedievalGame)

**What it demonstrates**
- Game development in Unity with C#.
- NPC-guided mission flow, coin collection and enemy avoidance.

**Where to look**
- [Original project README](https://github.com/MNR05/MedievalGame/blob/main/README.md)

**Documentation still recommended:** verified Unity editor version, controls, screenshots/gameplay, build instructions and asset attribution.

---

## How I document a project

For future repositories, I aim to include:

1. **Problem & context** — what the project addresses and who it serves.
2. **Architecture** — main components, data flow and design decisions.
3. **Setup** — prerequisites, configuration, run instructions and safe example environment variables.
4. **Usage** — screenshots, sample requests and expected outputs.
5. **Quality & limitations** — tests, known issues and next improvements.
6. **Security & attribution** — no passwords, tokens, internal data or proprietary assets in public repos.

Last profile documentation refresh: November 2026.
