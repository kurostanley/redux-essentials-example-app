import React, { useState } from 'react'
import { nanoid } from '@reduxjs/toolkit'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { type Post, addNewPost } from './postsSlice'
import { selectCurrentUsername } from '../auth/authSlice'
interface AddPostFormFields extends HTMLFormControlsCollection {
    postTitle: HTMLInputElement
    postContent: HTMLTextAreaElement
    postAuthor: HTMLSelectElement
}

interface AddPostFormElement extends HTMLFormElement {
    readonly elements: AddPostFormFields
}

export const AddPostForm = () => {
    const [addRequestStatus, setAddRequestStatus] = useState<'idle' | 'pending'>(
        'idle'
      )    
    const dispatch = useAppDispatch()
    const userId = useAppSelector(selectCurrentUsername)
    const handleSubmit = async (e: React.FormEvent<AddPostFormElement>) => {
        // Prevent the default form submission behavior
        e.preventDefault()

        const { elements } = e.currentTarget
        const title = elements.postTitle.value   
        const content = elements.postContent.value

        const form = e.currentTarget
        try {
            setAddRequestStatus('pending')
            await dispatch(addNewPost({ title, content, user: userId! })).unwrap()
      
            form.reset()
        } catch (err) {
            console.error('Failed to save the post: ', err)
        } finally {
            setAddRequestStatus('idle')
        }
      
        e.currentTarget.reset()
    }


    return (
        <section>
            <h2>Add a New Post</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="postTitle">Post Title:</label>
                <input type="text" id="postTitle" defaultValue="" required></input>
                <label htmlFor="postContent">Content:</label>
                <textarea id="postContent" name="postContent" defaultValue="" required></textarea>
                <button>Save Post</button>
            </form>
        </section>
    )
}