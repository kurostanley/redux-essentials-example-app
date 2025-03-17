import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import { client } from "@/api/client"

import { RootState } from "../../app/store"

import { createAppAsyncThunk } from '@/app/withTypes'


interface AuthState {
    username: string | null
}

export const login = createAppAsyncThunk(
    'auth/login',
    async (username: string) => {
        await client.post('/fakeApi/login', { username })
        return username
    }
)

export const logout = createAppAsyncThunk(
    'auth/logout',
    async () => {
        await client.post('/fakeApi/login', {})
    }
)

const initialState: AuthState = {
    username: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.username = action.payload
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.username = null
            })
    }
})

export const selectCurrentUsername = (state: RootState) => state.auth.username
export default authSlice.reducer