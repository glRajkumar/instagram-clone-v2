import React from 'react'
import Loading from '../Common/Loading'
import '../../CSS/home.css'
import { Link, useHistory } from 'react-router-dom'
import deleteIc from '../../Img/delete.png'
import likeIc from '../../Img/like.png'
import unlikeIc from '../../Img/unlike.png'
import heart from '../../Img/heart.png'
import heartRed from '../../Img/heart_red.png'
import user from '../../Img/user.svg'
import save from '../../Img/save.png'
import saved from '../../Img/saved.png'
import comment from '../../Img/comment.png'
import usePost from '../Customs/usePost'
import { getTime } from '../Customs/getTime'

function Posts({ url, text }) {
  let img = new RegExp('image/*')

  const [
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
  ] = usePost(url)

  const history = useHistory()

  const Nothing = () => (
    <h2 className="text-center"> {text} </h2>
  )

  const PostsLists = () => (
    <div className="home">
      {
        posts.map((post) => {
          return (
            <div className="post" key={post._id}>
              <h4 className="post-name">
                <Link
                  to={post.postedBy._id !== _id
                    ? `/profile/${post.postedBy._id}`
                    : "/profile"}
                >
                  <img
                    src={post.postedBy.img ? `/upload/${post.postedBy.img}` : user}
                    alt="user-img"
                  />
                  {` ${post.postedBy.userName}`}
                </Link>

                {
                  post.postedBy._id === _id
                  && <img className="icons" alt="delete-icon" src={deleteIc} onClick={() => deletePost(post._id)} />
                }
              </h4>

              <div className="post-img">
                {
                  post.files ?
                    post.files.map(file => {
                      return (
                        <div key={file._id}>
                          {
                            img.test(file.fileType) ?
                              <img
                                src={`/upload/${file.fileName}`}
                                alt={post._id}
                              />
                              :
                              <video
                                autoPlay
                                loop
                                // controls
                                playsInline
                                preload="none"
                                src={`/upload/${file.fileName}`}
                              >
                                your browser doesn't supported
                              </video>
                          }
                        </div>
                      )
                    })
                    : null
                }
              </div>

              <div className="post-content">
                <div className="post-icons">
                  {
                    post.isHearted
                      ?
                      <img src={heartRed} alt="heart-icon" className="icons" onClick={() => { unheartPost(post._id) }} />
                      :
                      <img src={heart} alt="heart-icon" className="icons" onClick={() => { heartPost(post._id) }} />
                  }

                  {
                    post.isLiked
                      ?
                      <img className="icons" alt="unlike-icon" src={unlikeIc} onClick={() => { unlikePost(post._id) }} />
                      :
                      <img className="icons" alt="like-icon" src={likeIc} onClick={() => { likePost(post._id) }} />
                  }

                  <img className="icons" alt="like-icon" src={comment} onClick={() => history.push(`/comments/${post._id}`)} />

                  {
                    post.isSaved
                      ?
                      <img className="icons" alt="save-icon" src={saved} onClick={() => { unsavePost(post._id) }} />
                      :
                      <img className="icons" alt="saved-icon" src={save} onClick={() => { savePost(post._id) }} />
                  }
                </div>

                <h6 className="post-likes">{post.likesCount} likes</h6>
                <h4 className="post-title">{post.title}</h4>
                <h6 className="post-body">{post.body}</h6>

                <div className="post-comments" onClick={() => history.push(`/comments/${post._id}`)}>
                  {
                    post.commentsCount > 0 ?
                      `view all ${post.commentsCount} comments` :
                      `still no one commented`
                  }
                </div>
                <p className="post-time"> {getTime(post.createdAt)} </p>

                <form onSubmit={(e) => {
                  e.preventDefault()
                  makeComment(e.target[0].value, post._id)
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

  if (!initPostLoad) {
    return (
      <>
        {
          posts.length > 0 ? <PostsLists /> : <Nothing />
        }

        {
          postLoading &&
          <div className="rel-pos"><Loading /></div>
        }

        {
          (hasMore && !postLoading) &&
          <div className="loadbtn">
            <button onClick={getPosts}>load more</button>
          </div>
        }

        {
          postError && <div>error</div>
        }
      </>
    )
  } else {
    return (
      <div className="rel-pos"><Loading /></div>
    )
  }
}

export default Posts