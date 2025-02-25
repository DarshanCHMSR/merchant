import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartSlice from "./cart_actions";
import authSlice from "./auth_action";
import searchSlice from "./search_action";

// Configuration for persisting the cart state
const cartPersistConfig = {
  key: "cart",
  storage,
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartSlice);

const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    auth: authSlice,
    search: searchSlice,
  },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
