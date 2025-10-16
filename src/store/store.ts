import { configureStore } from '@reduxjs/toolkit';
import widgetReducer from './widgetSlice';
import dashboardReducer from './dashboardSlice';

export const store = configureStore({
  reducer: {
    widgets: widgetReducer,
    dashboards: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
