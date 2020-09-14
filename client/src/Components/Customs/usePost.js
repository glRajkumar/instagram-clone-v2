import { useState, useEffect, useContext  } from 'react'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import axios from 'axios'

function usePost(url) {
    const { _id, name, img, headers } = useContext(AuthContext)
    const [ posts, setPosts ] = useState([])
  
    useEffect(()=>{
        axios.get(`/post/${url}`,{headers})
        .then((res)=>{
            setPosts(res.data.posts)
        })
        .catch((err)=>{
        console.log(err)
        })
    }, [])

    const likePost = (postId)=>{
        axios.put('/post/like', {postId}, {headers})
        .then(()=>{
        const newData = posts.map(post =>{
            if (post._id === postId) {
                return{
                    ...post,
                    likes : [
                        ...post.likes,
                        _id
                    ]
                }            
            }else{
                return post
            }
        })
        setPosts(newData)
        })
        .catch((err)=>{
        console.log(err)
        })
    }

    const unlikePost = (postId)=>{
        axios.put('/post/unlike',{postId}, {headers})
        .then(()=>{
        const newData = posts.map(i => {
            if (i._id === postId) {
                let newLike = i.likes.filter(like => like !== _id)
                return {
                    ...i,
                    likes : newLike
                }  
            }else{
                return i
            }
        })
        setPosts(newData)
        })
        .catch((err)=>{
        console.log(err)
        })  
    }

    const heartPost = (postId)=>{
        axios.put('/post/hearted', {postId}, {headers})
        .then(()=>{
        const newData = posts.map(post =>{
            if (post._id === postId) {
                return{
                    ...post,
                    hearted : [
                        ...post.hearted,
                        _id
                    ]
                }            
            }else{
                return post
            }
        })
        setPosts(newData)
        })
        .catch((err)=>{
        console.log(err)
        })
    }

    const unheartPost = (postId)=>{
        axios.put('/post/unhearted',{postId}, {headers})
        .then(()=>{
        const newData = posts.map(i => {
            if (i._id === postId) {
            let newLike = i.hearted.filter(hearted => hearted !== _id)
                return {
                    ...i,
                    hearted : newLike
                }  
            }else{
                return i
            }
        })
        setPosts(newData)
        })
        .catch((err)=>{
        console.log(err)
        })  
    }

    const makeComment = (text,postId)=>{
        if (text !== '') {
        axios.put('/post/comment', {text, postId}, {headers})
        .then((res)=>{
            const newData = posts.map(post =>{
            if (post._id === postId) {
                return{
                    ...post,
                    comments : [
                        ...post.comments,
                        {
                        _id : res.data.newId,
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
            setPosts(newData)
        })
        .catch((err)=>{
            console.log(err)
        })        
        }
    }

    const deletePost = (postId)=>{
        axios.delete(`/post/${postId}`, {headers})
        .then(()=>{
        const newData = posts.filter(item=>{
            return item._id !== postId
        })
        setPosts(newData)
        })
        .catch((err)=>{
        console.log(err)
        })
    }
    
    return [ _id, posts, likePost, unlikePost, heartPost, unheartPost, makeComment, deletePost ]
}

export default usePost