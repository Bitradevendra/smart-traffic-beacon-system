# Smart Traffic Beacon System

A hybrid monitoring project that combines a modern dashboard, object detection, and hardware integration into a traffic-focused control prototype.

## Why It Feels Bigger Than A Typical Demo

`smart-traffic-beacon-system` is more than a front-end mockup. It sits at the intersection of monitoring, detection, and physical-world integration, with enough docs and assets to feel like a real deployment-minded prototype.

## What It Does

- visualizes live traffic-system status in a React dashboard
- connects to a backend expected at `http://localhost:8000`
- tracks car count, beacon distance, recording state, and connection health
- ships with extensive supporting notes for deployment, wiring, troubleshooting, and hardware behavior

## Project Structure

```text
smart-traffic-beacon-system/
|-- App.tsx
|-- index.tsx
|-- index.html
|-- package.json
|-- requirements.txt
|-- vite.config.ts
|-- types.ts
|-- metadata.json
|-- yolov8n.pt
|-- *.md setup and wiring guides
`-- README.md
```

## Requirements

- Node.js 18+
- npm
- Python environment if you want to use the Python-side pieces documented in the repo
- optional connected hardware for the full system workflow

## Installation

Frontend dependencies:

```bash
npm install
```

Python-side dependencies if needed:

```bash
pip install -r requirements.txt
```

## Run Locally

Start the frontend:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## How It Works

- `App.tsx` polls the backend for system stats and renders connection-aware status cards and a live feed surface.
- the frontend expects a Python service at `http://localhost:8000` for telemetry and video.
- the large set of markdown guides captures the operational side: deployment, beacon behavior, LED logic, camera setup, and troubleshooting.
- `yolov8n.pt` anchors the detection side of the workflow.

## Why Someone Would Open This Repo

It is the kind of project that attracts builders interested in the bridge between dashboards and devices: not just what the interface looks like, but what the system is sensing in the world.
