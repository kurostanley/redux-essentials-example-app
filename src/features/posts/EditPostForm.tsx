import React from 'react'
import { useAppSelector } from '../../app/hooks'
import { useAppDispatch } from '../../app/hooks'
import { useParams, useNavigate } from 'react-router-dom'
import { postUpdated } from './postsSlice'

interface EditPostFormFields extends HTMLFormControlsCollection {
    postTitle: HTMLInputElement
    postContent: HTMLTextAreaElement
}

interface EditPostFormElements extends HTMLFormElement {
    readonly elements: EditPostFormFields
}

export const EditPostForm = () => {
    const { postId } = useParams()
    const post = useAppSelector(state => state.posts.find(post => post.id === postId))


    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    const onSavePostClicked = (e: React.FormEvent<EditPostFormElements>) => {
        e.preventDefault()

        const {elements} = e.currentTarget
        const title = elements.postTitle.value
        const content = elements.postContent.value

        dispatch(postUpdated({ id: post.id, title, content }))
        navigate(`/posts/${post.id}`)
    }

    return (
        <section>
            <h2>Edit Post</h2>
            <form onSubmit={onSavePostClicked}>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    defaultValue={post.title}
                    required
                />
                <label htmlFor="postContent">Content:</label>
                <textarea id="postContent" name="postContent" defaultValue={post?.content} required></textarea>
                <button>Save Post</button>
            </form>
        </section>
    )

}
