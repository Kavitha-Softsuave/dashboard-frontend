# Customizable Dashboard
A small Vite + React + TypeScript project for building chart widgets and assembling dashboards.
This repo provides a lightweight UI to:
- Create and manage chart widgets (title, chart type, data configuration).
- Build dashboards by placing and resizing widget previews.
- Save dashboards to localStorage.
- Upload and import dashboards from JSON files.

## Recent changes
- Save Dashboard now navigates back to the index page after saving.
- The two action cards on the index page were converted to action buttons placed at the top-right of the hero area for quicker access:
  - "Manage Widgets" (navigates to `/widgets`)
  - "Build Dashboard" (navigates to `/dashboard`)
- **Upload Dashboard** functionality added to import dashboards from JSON files.

## Getting started

### Requirements
- Node.js 18+ (or Bun is present in the repo but the scripts use npm/yarn normally)
- npm or yarn

### Install
```bash
npm install
# or
# yarn
```

### Development
Run the local dev server:
```powershell
npm run dev
```
The app typically runs on http://localhost:5173/ (Vite default).

### Build
```powershell
npm run build
```

### Preview production build
```powershell
npm run preview
```

### Lint
```powershell
npm run lint
```

## Project structure (important files)
- `src/pages/DashboardBuilder.tsx` - Landing page with quick action buttons for dashboard builder.
- `src/components/WidgetForm.tsx` - Form for editing/creating widget config.
- `src/components/WidgetPreview.tsx` - Widget preview used in dashboard canvas.
- `src/store/dashboardSlice.ts` - Redux slice with actions to manage dashboards and widgets on a dashboard.
- `src/store/widgetSlice.ts` - (if present) widget store.

## Features

### Dashboard Management
- **Create Dashboards**: Build custom dashboards by adding and arranging widgets.
- **Save Dashboards**: Persist dashboards to `localStorage` for later use.
- **Upload Dashboards**: Import dashboards from JSON files.

### Upload Functionality
The dashboard supports importing configurations via JSON file upload:

1. Navigate to the Dashboard Builder page (`/dashboard`).
2. Click the "Upload Dashboard" button in the toolbar.
3. Select a valid JSON file containing dashboard configuration.
4. The dashboard will be loaded with all widgets and their positions.

#### Validation
The upload feature validates:
- File type (must be `.csv`)

## Notes and tips
- Dashboards are persisted to `localStorage` when you click Save.
- Deleting a widget from the dashboard removes it from the current dashboard state immediately.
- Uploaded dashboards replace the current dashboard state.
- Widget IDs should be unique within a dashboard.

## Testing the save
1. Open the Dashboard Builder (`/dashboard`).
2. Add at least one widget to the dashboard.
3. Click "Save Dashboard".
4. You will be navigated back to the dashboard page.

## Testing the upload flow
1. Create a valid dashboard csv file following the format above.
2. Open the Dashboard Builder (`/dashboard`).
3. Click "Upload Dashboard" and select your csv file.
4. Verify that widgets are loaded and positioned correctly.
