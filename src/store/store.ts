/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import widgetReducer from "./widgetSlice";
import dashboardReducer from "./dashboardSlice";
import { widgetApi } from "./api";
// import { widgetApi } from "@/services/widgetApi";

const rootReducer = combineReducers({
  widgets: widgetReducer,
  dashboards: dashboardReducer,
  [widgetApi.reducerPath]: widgetApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["widgets", "dashboards"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    (
      getDefaultMiddleware({
        serializableCheck: false,
      }) as any
    ).concat(widgetApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
