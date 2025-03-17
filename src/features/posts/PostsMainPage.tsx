import { PostList } from "./PostList"
import { AddPostForm } from "./AddPostForm"

export const PostsMainPage = () => {
    return (
        <>
            <AddPostForm />
            <PostList />
        </>
    )
}