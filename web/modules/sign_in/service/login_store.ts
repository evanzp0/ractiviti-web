import { AnyAction, configureStore } from '@reduxjs/toolkit';
import loginReducer from './login_reducer';
import thunkMiddleware, { ThunkDispatch } from 'redux-thunk'

export const store = configureStore({
    reducer: {
        login: loginReducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(thunkMiddleware)
    }
})

export type AppThunkDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;