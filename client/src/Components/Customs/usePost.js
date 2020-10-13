import { useEffect, useContext, useReducer  } from 'react'
import axios from 'axios'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import PostReducer from '../State/Post/PostReducer'

const initialState = {
    posts : [],
    skip : 0,
    loading : false,
    hasMore : true,
    error : ""
}

function usePost(url) {
    const { _id, name, img, headers } = useContext(AuthContext)
    const [ { posts, skip, loading, hasMore, error } , dispatch ] = useReducer(PostReducer, initialState)
    
    useEffect(()=>{
        getPosts()
    }, [])

    const getPosts = async () => {
        try {
            dispatch({ type : 'LOADING' })
            let res = await axios.get(`/post/${url}/?skip=${skip}`,{headers})
            const payload = {
                posts : res.data.posts
            }            
            dispatch({ type : 'GET', payload })
       
        } catch (error) {
            dispatch({ type : "ERROR" })
            console.log(error)            
        }
    }

    const likePost = async (postId)=>{
        try {
            await axios.put('/post/like', {postId}, {headers})
            const payload = {
                like : true,
                postId,
                _id
            }    
            dispatch({ type: 'LIKE', payload })
    
        } catch (error) {
            dispatch({ type : "ERROR" })
            console.log(error)
        }
    }

    const unlikePost = async (postId)=>{
        try {
            await axios.put('/post/unlike',{postId}, {headers})
            const payload = {
                like : false,
                postId,
                _id
            }
            dispatch({type: 'LIKE', payload})
    
        } catch (error) {
            dispatch({ type : "ERROR" })
            console.log(error)
        }
    }

    const heartPost = async (postId)=>{
        try {
            await axios.put('/post/hearted', {postId}, {headers})
            const payload = {
                hearted : true,
                postId,
                _id
            }
            dispatch({type: 'HEART', payload})
    
        } catch (error) {
            dispatch({ type : "ERROR" })
            console.log(error)
        }
    }

    const unheartPost = async (postId)=>{
        try {
            await axios.put('/post/unhearted',{postId}, {headers})
            const payload = {
                hearted : false,
                postId,
                _id
            }    
            dispatch({type: 'HEART', payload})
    
        } catch (error) {
            dispatch({ type : "ERROR" })
            console.log(error)
        }
    }

    const makeComment = async (text,postId)=>{
        try {
            if (text !== '') {
                const { data } = await axios.put('/post/comment', {text, postId}, {headers})
                const newData = posts.map(post =>{
                    if (post._id === postId) {
                        return{
                            ...post,
                            comments : [
                                ...post.comments,
                                {
                                _id : data.newId,
                                text,
                                postedBy :{
                                    _id,
                                    name,
                                    img
                                    }
                                }
                            ]
                        }            
                    }else{
                        return post
                    }
                })

                dispatch({type: 'COMMENT', payload : newData})
            }        
    
        } catch (error) {
            dispatch({ type : "ERROR" })
            console.log(error)
        }
    }

    const deletePost = async (postId)=>{
        try {
            await axios.delete(`/post/${postId}`, {headers})
            dispatch({ type: 'DELETE', payload : postId })
    
        } catch (error) {
            dispatch({ type : "ERROR" })
            console.log(error)
        }
    }
    
    return [ 
        _id, 
        posts, 
        hasMore,
        loading,
        error,
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