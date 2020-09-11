import React, { useState, useEffect, useContext } from 'react'
import '../../CSS/home.css'
import axios from 'axios'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import { Link } from 'react-router-dom'
import deleteIc from '../../Img/delete.png'
import likeIc from '../../Img/like.png'
import unlikeIc from '../../Img/unlike.png'
import heart from '../../Img/heart.png'
import heartRed from '../../Img/heart_red.png'
import user from '../../Img/user.png'

function FollowingProfile() {  
  const { _id, name, img, headers } = useContext(AuthContext)
  const [ posts, setPosts ] = useState([])
  
  useEffect(()=>{
    axios.get('/post/getsubpost',{headers})
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
      .then(()=>{
        const newData = posts.map(post =>{
          if (post._id === postId) {
            return{
              ...post,
              comments : [
                ...post.comments,
                {
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
    
  return(
    <div className="home">
      {
        posts ?
        posts.map((post)=>{
          return(
          <div className="post" key={post._id}>
            <h4 className="post-name">
              <Link 
               to={ post.postedBy._id !== _id 
               ? `/profile/${post.postedBy._id}` 
               : "/profile" }
              >
                <img
                 src={post.postedBy.img ? `/upload/${post.postedBy.img}` : user} 
                 alt="user-img"
                />
                {` ${post.postedBy.name}`}
              </Link> 
        
              {
                post.postedBy._id === _id 
                && <img className="icons" alt="delete-icon" src={deleteIc} onClick={()=>deletePost(post._id)} />
              }
            </h4>

            <div className="post-img">
              <img src={`/upload/${post.photo}`} alt={post._id} />
            </div>

            <div className="post-content">
              <div className="post-icons">
                {
                post.hearted.includes(_id)
                ?
                <img src={heartRed} alt="heart-icon" className="icons" onClick={()=>{unheartPost(post._id)}} />
                :
                <img src={heart} alt="heart-icon" className="icons" onClick={()=>{heartPost(post._id)}} />
                }
                
                { 
                post.likes.includes(_id)
                ? 
                <img className="icons" alt="unlike-icon" src={unlikeIc} onClick={()=>{unlikePost(post._id)}} />
                : 
                <img className="icons" alt="like-icon" src={likeIc} onClick={()=>{likePost(post._id)}} />
                }
              </div>
                            
              <h6 className="post-likes">{post.likes.length} likes</h6>
              <h4 className="post-title">{post.title}</h4>
              <h6 className="post-body">{post.body}</h6>
              
              <div className="post-comments">
              {
                post.comments.map(comment=>{
                    return(
                    <div style={{paddingBottom : '0.3rem'}} key={comment._id}>
                      <span style={{fontWeight: "bolder"}}>
                        <img  
                         className="post-comments-img"
                         src={comment.postedBy.img ? `/upload/${comment.postedBy.img}` : user} 
                         alt="user-img" 
                        />
                        {` ${comment.postedBy.name} - `}
                      </span> 
                      <span> {comment.text} </span>  
                    </div>
                    )
                })
              }    
              </div>
              
              <form onSubmit={(e)=>{
                  e.preventDefault()
                  makeComment(e.target[0].value,post._id)
                  e.target[0].value = '' 
                }}>
                <input
                 type="text" 
                 className="input-com"
                 placeholder="add a comment..." 
                />  
              </form>    
              </div>
          </div>
          )
        })
        : <h5 className="text-center">Nothing yet posted</h5>
      }
    </div>
)
}

export default FollowingProfile