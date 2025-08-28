# GRM Operator Dashboard

This project is a take-home challenge to create a dashboard for Ground Resources Management (GRM) operators to view and manage satellite contact alerts. The dashboard is built with Angular and the Astro UX Design System.

## Core Features

- **Alert Display**: Each alert shows the message, contact name, and contact time.
- **Alert Details**: A "Show Details" button on each alert opens a dialog with more information.
- **Sorting**: Alerts are sorted by time, with the most recent at the top.
- **Acknowledgement**:
  - Unacknowledged alerts can be acknowledged.
  - Acknowledged alerts are visually distinct.
  - Acknowledged alerts cannot be unacknowledged.
- **Severity Filtering**: Alerts can be filtered by severity (Critical, Serious, Warning, Normal, Off-Nominal).

## Technical Requirements

- **Framework**: Angular
- **Component Library**: Astro UX Design System
- **Package Manager**: bun

## Getting Started

### Prerequisites

- **Node.js**: Latest LTS version recommended.
- **Angular CLI**: `bun install -g @angular/cli`

### Setup

1.  **Fork and Clone**: Fork this repository and clone it to your local machine.
2.  **Install Dependencies**:
    ```bash
    bun install
    ```

### Development Server

1.  **Start the server**:
    ```bash
    bun start
    ```
2.  **Open in browser**: Navigate to `http://localhost:4200/`.

## Building the Project

```bash
bun run build
```

The build artifacts will be stored in the `dist/` directory.
