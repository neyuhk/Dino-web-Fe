import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
// @ts-ignore
import { getLocalStorage, putLocalStorage, removeLocalStorage } from '@/helpers/localStorageHelper';
// @ts-ignore
import { LOCAL_STORAGE_KEYS } from '@/constants/localStorageKey';
import { getCurrentUserAction, loginAction, refreshTokenAction } from './authAction';
import { User } from '../model/model';

// Define UPDATE_USER as a typed action creator
export const UPDATE_USER = createAction<User>('UPDATE_USER');

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: getLocalStorage(LOCAL_STORAGE_KEYS.IS_LOGIN) || false,
        user: JSON.parse(getLocalStorage(LOCAL_STORAGE_KEYS.INFO)) || null,
    },
    reducers: {
        logout: (state) => {
            console.log('dang xuat ne');
            state.isAuthenticated = false;
            state.user = null;
            removeLocalStorage(LOCAL_STORAGE_KEYS.INFO);
            removeLocalStorage(LOCAL_STORAGE_KEYS.IS_LOGIN);
            removeLocalStorage(LOCAL_STORAGE_KEYS.AUTHENTICATION_TOKEN);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAction.fulfilled, (state, action) => {
                console.log(action.payload);
                putLocalStorage(LOCAL_STORAGE_KEYS.AUTHENTICATION_TOKEN, action.payload.data.data.accessToken);
            })
            .addCase(getCurrentUserAction.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                putLocalStorage(LOCAL_STORAGE_KEYS.INFO, JSON.stringify(action.payload));
                putLocalStorage(LOCAL_STORAGE_KEYS.IS_LOGIN, true);
                state.user = action.payload;
            })
            .addCase(refreshTokenAction.fulfilled, (state, action) => {
                putLocalStorage(LOCAL_STORAGE_KEYS.AUTHENTICATION_TOKEN, action.payload.data.accessToken);
            })
            .addCase(getCurrentUserAction.rejected, (state, action) => {
                // Handle rejection if needed
            })
            // Use the typed UPDATE_USER action creator
            .addCase(UPDATE_USER, (state, action: PayloadAction<User>) => {
                state.user = action.payload;
                // Update local storage too
                putLocalStorage(LOCAL_STORAGE_KEYS.INFO, JSON.stringify(action.payload));
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
