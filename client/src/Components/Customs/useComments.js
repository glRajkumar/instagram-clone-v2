import { useEffect, useContext, useReducer, useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import CommentsReducer from '../State/Comments/CommentsReducer'

const initialState = {
    comments: [],
    skip: 0,
    comLoading: false,
    hasMore: true,
    comError: ""
}

function useComments(postId) {
    const [initComLoad, setInit] = useState(true)
    const { _id, userName, img, headers } = useContext(AuthContext)
    const [{ comments, skip, comLoading, hasMore, comError }, dispatch] = useReducer(CommentsReducer, initialState)

    useEffect(() => {
        getComments()
        setInit(false)
    }, [])

    const getComments = async () => {
        try {
            dispatch({ type: 'LOADING' })
            let res = await axios.get(`/comment/${postId}/?skip=${skip}`, { headers })
            const payload = {
                comments: res.data.comments
            }
            dispatch({ type: 'GET', payload })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const makeComment = async (text, postId) => {
        try {
            if (text !== '') {
                const res = await axios.post('/comment', { text, postId }, { headers })
                const payload = {
                    _id: res.data.id,
                    text,
                    postedBy: {
                        _id,
                        img,
                        userName
                    }
                }
                dispatch({ type: 'ADD', payload })
            }

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const editComment = async (text, commentId) => {
        try {
            if (text !== '') {
                const payload = {
                    text,
                    commentId
                }
                await axios.put('/comment', { text, commentId }, { headers })
                dispatch({ type: 'EDIT', payload })
            }

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const deleteComment = async (postId, commentId) => {
        try {
            await axios.delete(`/comment/${postId}/${commentId}`, { headers })
            dispatch({ type: 'DELETE', payload: commentId })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    return [
        _id,
        comments,
        hasMore,
        comLoading,
        comError,
        initComLoad,
        getComments,
        makeComment,
        editComment,
        deleteComment
    ]
}

export default useComments