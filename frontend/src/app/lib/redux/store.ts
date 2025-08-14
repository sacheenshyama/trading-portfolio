"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { persistReducer, persistStore } from "redux-persist";
// import storage from "redux-persist/lib/storage";
import authReducer from "./featureSlice/authSlice";
import portfolioReducer from "./featureSlice/portfolioSlice";
import activityReducer from "./featureSlice/activitySlice";
import storage from "./storage";
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "portfolio", "activity"],
};

const PersistReducer = persistReducer(
  persistConfig,
  combineReducers({
    auth: authReducer,
    portfolio: portfolioReducer,
    activity: activityReducer,
  })
);

export const store = configureStore({
  reducer: PersistReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
export const persistor = persistStore(store);
