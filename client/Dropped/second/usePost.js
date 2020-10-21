import { useEffect, useContext, useReducer, useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import PostReducer from '../State/Post/PostReducer'

const initialState = {
    posts: [],
    skip: 0,
    postLoading: false,
    hasMore: true,
    postError: ""
}

function usePost(url) {
    const [initPostLoad, setInit] = useState(true)
    const { _id, userName, img, headers, updateTotalPosts } = useContext(AuthContext)
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
            console.log("posts")
            console.log(res.data.posts)
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
                postId,
                _id
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
                postId,
                _id
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
                postId,
                _id
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
                postId,
                _id
            }
            dispatch({ type: 'HEART', payload })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const makeComment = async (text, postId) => {
        try {
            if (text !== '') {
                const { data } = await axios.put('/post/comment', { text, postId }, { headers })
                const newData = posts.map(post => {
                    if (post._id === postId) {
                        return {
                            ...post,
                            comments: [
                                ...post.comments,
                                {
                                    _id: data.newId,
                                    text,
                                    postedBy: {
                                        _id,
                                        userName,
                                        img
                                    }
                                }
                            ]
                        }
                    } else {
                        return post
                    }
                })

                dispatch({ type: 'COMMENT', payload: newData })
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
        makeComment,
        deletePost
    ]
}

export default usePost