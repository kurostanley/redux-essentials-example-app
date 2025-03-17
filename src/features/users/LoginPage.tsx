import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectAllUsers } from './userSlice'
import { login } from '../auth/authSlice'
import { useLayoutEffect, useEffect, useState } from 'react'
interface LoginPageFormFields extends HTMLFormControlsCollection {
    username: HTMLSelectElement
  }
  interface LoginPageFormElements extends HTMLFormElement {
    readonly elements: LoginPageFormFields
  }
  

export const LoginPage = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const users = useAppSelector(selectAllUsers)

    const handleSubmit = async (e: React.FormEvent<LoginPageFormElements>) => {
        e.preventDefault()
        const username = e.currentTarget.elements.username.value
        if (username) {
            await dispatch(login(username))
            navigate('/posts')
        }
    }
    

    const userOptions = users.map(user => (
        <option key={user.id} value={user.id}>{user.name}</option>
    ))

    return (
        <section>
            <h2>Welcone to Tweeter</h2>
            <h3>Please log inL:</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <select id="username" name="username" required>
                    <option value=""></option>
                    {userOptions}
                </select>
                <button>Login</button>
            </form>
        </section>
    )
}