import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { sub } from 'date-fns'
import { logout } from '../auth/authSlice'
import { client } from '@/api/client'
import { createAppAsyncThunk } from '@/app/withTypes'
import { createAsyncThunk, createSelector, createEntityAdapter, EntityState } from '@reduxjs/toolkit'
import { AppStartListening } from '@/app/listenerMiddleware'


export interface Reactions {
    thumbsUp: number
    tada: number
    heart: number
    rocket: number
    eyes: number
}

export type ReactionName = keyof Reactions

export interface Post {
    id: string
    title: string
    content: string
    user: string
    date: string
    reactions: Reactions
}

interface PostsState extends EntityState<Post, string> {
    status: 'idle' | 'pending' | 'succeeded' | 'failed'
    error: string | null
}

const postsAdapter = createEntityAdapter<Post>({
    // Sort in descending date order
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})


  

type PostUpdate = Pick<Post, 'id' | 'title' | 'content'>
type NewPost = Pick<Post, 'title' | 'content' | 'user'>

export const addNewPost = createAppAsyncThunk(
    'posts/addNewPost',
    async (initialPost: NewPost) => {
        const response = await client.post<Post>('/fakeApi/posts', initialPost)
        return response.data
    }
)

export const fetchPosts = createAppAsyncThunk(
    'posts/fetchPosts', 
    async () => {
        const response = await client.get<Post[]>('/fakeApi/posts')
        return response.data
    },
    {
        condition(arg, thunkApi) {
            const postsStatus = selectPostsStatus(thunkApi.getState())
            if (postsStatus !== 'idle') {
                return false
            }
        }
    }
)

const initialReactions: Reactions = {
    thumbsUp: 0,
    tada: 0,
    heart: 0,
    rocket: 0,
    eyes: 0,
}

const initialState: PostsState = postsAdapter.getInitialState({
    status: 'idle',
    error: null
})



// Create the slice and pass in the initial state
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state, action: PayloadAction<{ postId: string; reaction: ReactionName }>) {
            const { postId, reaction } = action.payload
            const existingPost = state.entities[postId]
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        postUpdated(state, action: PayloadAction<PostUpdate>) {
            const { id, title, content } = action.payload
            postsAdapter.updateOne(state, { id, changes: { title, content } })
        }
    },
    extraReducers(builder) {
        builder
            .addCase(logout.fulfilled, (state) => {
                return initialState
            })
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                postsAdapter.setAll(state, action.payload)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? 'Unknown Error'
            })
            .addCase(addNewPost.fulfilled, postsAdapter.addOne)
        }
})

export const { postUpdated, reactionAdded } = postsSlice.actions
export default postsSlice.reducer
// Export the customized selectors for this adapter using `getSelectors`
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
    // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors((state: RootState) => state.posts)
  
// export const selectAllPosts = (state: RootState) => state.posts.posts
// export const selectPostById = (state: RootState, postId: string) => state.posts.posts.find(post => post.id === postId)
export const selectPostsStatus = (state: RootState) => state.posts.status
export const selectPostsError = (state: RootState) => state.posts.error
export const selectPostsByUser = createSelector(
    // Pass in one or more "input selectors"
    [
      // we can pass in an existing selector function that
      // reads something from the root `state` and returns it
      selectAllPosts,
      // and another function that extracts one of the arguments
      // and passes that onward
      (state: RootState, userId: string) => userId
    ],
    // the output function gets those values as its arguments,
    // and will run when either input value changes
    (posts, userId) => posts.filter(post => post.user === userId)
)
export const addPostsListeners = (startAppListening: AppStartListening) => {
    startAppListening({
        actionCreator: addNewPost.fulfilled,
        effect: async (action, listenerApi) => {
            const { toast } = await import('react-tiny-toast')

            const toastId = toast.show('New post added!', {
                variant: 'success',
                position: 'bottom-right',
                pause: true
            })

            await listenerApi.delay(5000)
            toast.remove(toastId)
        }
    })
}