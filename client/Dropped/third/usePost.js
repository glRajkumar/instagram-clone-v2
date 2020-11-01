import { useEffect, useContext, useReducer, useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import PostReducer from '../State/Posts/PostsReducer'

const initialState = {
    posts: [],
    skip: 0,
    postLoading: false,
    hasMore: true,
    postError: ""
}

function usePost(url) {
    const [initPostLoad, setInit] = useState(true)
    const { _id, headers, updateTotalPosts } = useContext(AuthContext)
    const [{ posts, skip, postLoading, hasMore, postError }, dispatch] = useReducer(PostReducer, initialState)

    useEffect(() => {
        getPosts()
        setInit(false)
    }, [])

    const getPosts = async () => {
        try {
            dispatch({ type: 'LOADING' })
            let res = await axios.get(`/post/${url}/?skip=${skip}`, { headers })
            const payload = {
                posts: res.data.posts
            }
            dispatch({ type: 'GET', payload })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const likePost = async (postId) => {
        try {
            await axios.put('/post/like', { postId }, { headers })
            const payload = {
                like: true,
                postId
            }
            dispatch({ type: 'LIKE', payload })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const unlikePost = async (postId) => {
        try {
            await axios.put('/post/unlike', { postId }, { headers })
            const payload = {
                like: false,
                postId
            }
            dispatch({ type: 'LIKE', payload })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const heartPost = async (postId) => {
        try {
            await axios.put('/post/hearted', { postId }, { headers })
            const payload = {
                hearted: true,
                postId
            }
            dispatch({ type: 'HEART', payload })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const unheartPost = async (postId) => {
        try {
            await axios.put('/post/unhearted', { postId }, { headers })
            const payload = {
                hearted: false,
                postId
            }
            dispatch({ type: 'HEART', payload })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const savePost = async (postId) => {
        try {
            await axios.put('/user/savepost', { postId }, { headers })
            const payload = {
                save: true,
                postId
            }
            dispatch({ type: 'SAVE', payload })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const unsavePost = async (postId) => {
        try {
            await axios.put('/user/unsavepost', { postId }, { headers })
            const payload = {
                save: false,
                postId
            }
            dispatch({ type: 'SAVE', payload })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const makeComment = async (text, postId) => {
        try {
            if (text !== '') {
                await axios.post('/comment', { text, postId }, { headers })
                dispatch({ type: 'COMMENT', payload: postId })
            }

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const deletePost = async (postId) => {
        try {
            await axios.delete(`/post/${postId}`, { headers })
            updateTotalPosts(false)
            dispatch({ type: 'DELETE', payload: postId })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    return [
        _id,
        posts,
        hasMore,
        postLoading,
        postError,
        initPostLoad,
        getPosts,
        likePost,
        unlikePost,
        heartPost,
        unheartPost,
        savePost,
        unsavePost,
        makeComment,
        deletePost
    ]
}

export default usePost