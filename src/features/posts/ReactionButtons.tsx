import { useAppDispatch } from "../../app/hooks"
import { ReactionName } from "./postsSlice"
import { Post } from "./postsSlice"
import { reactionAdded } from "./postsSlice"

const reactionEmojiL: Record<ReactionName, string>= {
    thumbsUp: '👍',
    tada: '🎉',
    heart: '❤️',
    rocket: '🚀',
    eyes: '👀',
}

interface ReactionButtonsProps {
    post: Post
}

export const ReactionButtons = ({ post }: ReactionButtonsProps) => {
    const dispatch = useAppDispatch()

    const reactionButtons = Object.entries(reactionEmojiL).map(([stringName, emoji]) => {
        const reaction = stringName as ReactionName
        return (
            <button
                key={reaction}
                type="button"
                className="muted-botton reaction-button"
                onClick={() => dispatch(reactionAdded({ postId: post.id, reaction }))}
            >
                {emoji} {post.reactions[reaction]}
            </button>
        )
    })

    return <div>{reactionButtons}</div>
}