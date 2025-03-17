import React, { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from '../../components/TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import {
  fetchPosts,
  selectPostById,
  selectPostIds,
  selectPostsStatus,
  selectPostsError
} from './postsSlice'
import { Spinner } from '@/components/Spinner'

interface PostExcerptProps {
  postId: string
}
  
  
function PostExcerpt({ postId }: PostExcerptProps) {
  const post = useAppSelector(state => selectPostById(state, postId))
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
    </article>
  )
}
  

export const PostList = () => {
    const dispatch = useAppDispatch()
    const orderedPostsIds = useAppSelector(selectPostIds)
    const postsStatus = useAppSelector(selectPostsStatus)
    const postsError = useAppSelector(selectPostsError)

    useEffect(() => {
        if (postsStatus === 'idle') {
            dispatch(fetchPosts())
        }
    }, [postsStatus, dispatch])

    let content: React.ReactNode

    if (postsStatus === 'pending') {
        content = <Spinner text="Loading..." />
    } else if (postsStatus === 'succeeded') {
        content = orderedPostsIds.map(postId => (
            <PostExcerpt key={postId} postId={postId} />
        ))
    } else if (postsStatus === 'failed') {
        content = <div>{postsError}</div>
    }

    return (
        <section className="posts-list">
          <h2>Posts</h2>
          {content}
        </section>
      )    
} 