/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IWidget } from "@/types/widget";

interface WidgetState {
  widgetChartData: any;
  widgets: IWidget[];
}

const initialState: WidgetState = {
  widgets: JSON.parse(localStorage.getItem("widgets") || "[]"),
  widgetChartData: undefined,
};

const widgetSlice = createSlice({
  name: "widgets",
  initialState,
  reducers: {
    addWidget: (state, action: PayloadAction<IWidget>) => {
      state.widgets.push(action.payload);
      localStorage.setItem("widgets", JSON.stringify(state.widgets));
    },
    updateWidget: (state, action: PayloadAction<IWidget>) => {
      const index = state.widgets.findIndex((w) => w.id === action.payload.id);
      if (index !== -1) {
        state.widgets[index] = action.payload;
        localStorage.setItem("widgets", JSON.stringify(state.widgets));
      }
    },
    deleteWidget: (state, action: PayloadAction<string>) => {
      state.widgets = state.widgets.filter((w) => w.id !== action.payload);
      localStorage.setItem("widgets", JSON.stringify(state.widgets));
    },
  },
});

export const { addWidget, updateWidget, deleteWidget } = widgetSlice.actions;
export default widgetSlice.reducer;
