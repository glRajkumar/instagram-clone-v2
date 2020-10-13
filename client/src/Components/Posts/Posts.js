import React from 'react'
import Loading from '../Common/Loading'
import '../../CSS/home.css'
import { Link } from 'react-router-dom'
import deleteIc from '../../Img/delete.png'
import likeIc from '../../Img/like.png'
import unlikeIc from '../../Img/unlike.png'
import heart from '../../Img/heart.png'
import heartRed from '../../Img/heart_red.png'
import user from '../../Img/user.png'
import usePost from '../Customs/usePost'

function Posts({url, text}){      
  const [ 
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
  ] = usePost(url)

  const Nothing = () => (
    <h2 className="text-center"> {text} </h2>
  )

  const PostsLists = () => (
    <div className="home">
    {
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
            <img
             src={`/upload/${post.photo}`} 
             alt={post._id} 
            />
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
    }
    </div>      
  )
  
  if (posts.length > 0) {
    return(
      <>
        <PostsLists />
        {
          loading && 
          <div className="post-load"><Loading /></div>
        }

        {
          (hasMore && !loading) &&
          <div className="loadbtn">
            <button onClick={getPosts}>load more</button>
          </div>
        }

        {
          error && <div>error</div>
        }
      </>
    )
  }else{
    return(
      <Nothing />
    )
  }
}

export default Posts