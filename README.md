# smart-traffic-beacon-system

`smart-traffic-beacon-system` is a traffic-monitoring project that combines a Vite-based dashboard with supporting files for object detection, hardware integration, and deployment notes.

## Overview

The repository is organized around a web frontend plus project documentation and assets for a smart traffic beacon workflow, including object detection and hardware-side setup.

## Project Structure

```text
smart-traffic-beacon-system/
|-- App.tsx
|-- index.html
|-- index.tsx
|-- types.ts
|-- metadata.json
|-- package.json
|-- requirements.txt
|-- *.md guides
|-- yolov8n.pt
`-- README.md
```

## Requirements

- Node.js 18+
- npm
- Python environment if you plan to use the Python-side utilities described in the docs

## Installation

```bash
npm install
```

If you need the Python-side dependencies described by the project:

```bash
pip install -r requirements.txt
```

## Running The Project

Start the frontend locally:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## How It Works

- `App.tsx`, `index.tsx`, and `index.html` define the dashboard frontend
- project markdown files document hardware integration, deployment, troubleshooting, and wiring
- `yolov8n.pt` is included for object-detection related workflows described by the project
- `metadata.json` and `types.ts` support the frontend configuration and typing layer
