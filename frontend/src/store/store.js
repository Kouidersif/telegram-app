import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import chatReducer from "./slices/chatSlice";
import userReducer from "./slices/userSlice";
import telegramReducer from "./slices/telegramSlice";
import alertReducer from "./slices/alertSlice";



const persistConfig = {
    key: 'me',
    storage,
}

const rootReducer = combineReducers({
    chat: chatReducer,
    telegram: telegramReducer,
    user: persistReducer(persistConfig, userReducer),
    alert: alertReducer,
})

export const store =  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})


export const persistor = persistStore(store);