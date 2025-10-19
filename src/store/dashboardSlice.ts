/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDashboard, IDashboardWidget } from "@/types/widget";

interface DashboardState {
  columns: any;
  dashboards: IDashboard[];
  currentDashboard: IDashboard | null;
}

const dashboards =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("dashboards") || "[]")
    : [];

const initialState: DashboardState = {
  dashboards,
  currentDashboard: null,
  columns: undefined,
};

const dashboardSlice = createSlice({
  name: "dashboards",
  initialState,
  reducers: {
    setCurrentDashboard: (state, action: PayloadAction<IDashboard>) => {
      state.currentDashboard = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("currentDashboardId", action.payload.id);
      }
    },

    updateDashboardLayout: (
      state,
      action: PayloadAction<IDashboardWidget[]>
    ) => {
      if (state.currentDashboard) {
        state.currentDashboard.widgets = action.payload;
      }
    },

    saveDashboard: (state) => {
      if (state.currentDashboard) {
        const index = state.dashboards.findIndex(
          (d) => d.id === state.currentDashboard!.id
        );
        if (index !== -1) {
          state.dashboards[index] = state.currentDashboard;
        } else {
          state.dashboards.push(state.currentDashboard);
        }
        if (typeof window !== "undefined") {
          localStorage.setItem("dashboards", JSON.stringify(state.dashboards));
        }
      }
    },

    addWidgetToDashboard: (state, action: PayloadAction<IDashboardWidget>) => {
      if (state.currentDashboard) {
        state.currentDashboard.widgets = state.currentDashboard.widgets || [];
        state.currentDashboard.widgets.push(action.payload);
      }
    },

    removeWidgetFromDashboard: (state, action: PayloadAction<string>) => {
      if (state.currentDashboard) {
        state.currentDashboard.widgets = state.currentDashboard.widgets.filter(
          (w) => w.i !== action.payload
        );
      }
    },
  },
});

export const {
  setCurrentDashboard,
  updateDashboardLayout,
  saveDashboard,
  addWidgetToDashboard,
  removeWidgetFromDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
