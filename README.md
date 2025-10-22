# Chart Assembly

A small Vite + React + TypeScript project for building chart widgets and assembling dashboards.

This repo provides a lightweight UI to:

- Create and manage chart widgets (title, chart type, data configuration).
- Build dashboards by placing and resizing widget previews.
- Save dashboards to localStorage.

Recent changes

- Save Dashboard now navigates back to the index page after saving.
- The two action cards on the index page were converted to action buttons placed at the top-right of the hero area for quicker access:
  - "Manage Widgets" (navigates to `/widgets`)
  - "Build Dashboard" (navigates to `/dashboard`)

Getting started

Requirements

- Node.js 18+ (or Bun is present in the repo but the scripts use npm/yarn normally)
- npm or yarn

Install

```bash
npm install
# or
# yarn
```

Development

Run the local dev server:

```powershell
npm run dev
```

The app typically runs on http://localhost:5173/ (Vite default).

Build

```powershell
npm run build
```

Preview production build

```powershell
npm run preview
```

Lint

```powershell
npm run lint
```

Project structure (important files)

- `src/pages/Index.tsx` - Landing page with quick action buttons.
- `src/pages/DashboardBuilder.tsx` - Main dashboard builder. Save button now navigates back to index.
- `src/components/WidgetForm.tsx` - Form for editing/creating widget config.
- `src/components/WidgetPreview.tsx` - Widget preview used in dashboard canvas.
- `src/store/dashboardSlice.ts` - Redux slice with actions to manage dashboards and widgets on a dashboard.
- `src/store/widgetSlice.ts` - (if present) widget store.

Notes and tips

- Dashboards are persisted to `localStorage` when you click Save.
- Deleting a widget from the dashboard removes it from the current dashboard state immediately.
- If you'd like confirmation modals or undo for deletions/saves, I can add them.

Testing the save->index flow

1. Open the Dashboard Builder (`/dashboard`).
2. Add at least one widget to the dashboard.
3. Click "Save Dashboard". After the save completes you should be redirected to the index page.

Contributing

This project is a small demo. Feel free to open issues or submit PRs for improvements:

- Add unit tests for reducers and components
- Add undo for deletions
- Add user prompts/confirmations for destructive actions

Contact

For questions about the code changes or to request follow-ups, reply in the workspace or open an issue in the repository.
