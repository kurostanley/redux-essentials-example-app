import { Link, useParams } from "react-router-dom"

import { useAppSelector } from "../../app/hooks"
import { PostAuthor } from "./PostAuthor"
import { TimeAgo } from "../../components/TimeAgo"
import { ReactionButtons } from "./ReactionButtons"
import { selectCurrentUsername } from "../auth/authSlice"

export const SinglePostPage = () => {
    const { postId } = useParams()

    const post = useAppSelector(state => state.posts.find(post => post.id === postId))
    const currentUsername = useAppSelector(selectCurrentUsername)!

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    const canEdit = currentUsername === post.user

    return (
        <section>
            <article className="post">
                <h2>{post.title}</h2>
                <PostAuthor userId={post.user}></PostAuthor>
                <TimeAgo timestamp={post.date}></TimeAgo>
                <p className="post-content">{post.content}</p>
                <ReactionButtons post={post}></ReactionButtons>
                {canEdit && (
                    <Link to={`/editPost/${post.id}`} className="button">
                        Edit Post
                    </Link>
                )}
            </article>
        </section>
    )
}