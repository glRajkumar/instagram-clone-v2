import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import '../../CSS/profile.css'
import user from '../../Img/user.png'
import Loading from '../Common/Loading'

const UsersProfile  = () => {
    const [ userProfile, setProfile ] = useState(null)
    const [ posts, setPosts ] = useState([])   
    const { userid } = useParams()
    const { updateFollow, following, headers } = useContext(AuthContext)
    const [ showfollow, setShowFollow ] = useState(following ? !following.includes(userid) : true)
    const [ hasMore, setHasMore ] = useState(true)
    const [ skip, setSkip ] = useState(0)

    useEffect(()=>{
        axios.get(`/user/${userid}`, {headers})
        .then((res)=>{
            setProfile(res.data.user)
        })
        .catch((err)=>{
            console.log(err)
        })
    },[])

    useEffect(()=>{
        getPhotos()
    },[])

    const getPhotos = () => {
        axios.get(`/post/onlyphotos/${userid}/?skip=${skip}`, {headers})
        .then((res)=>{
            setPosts(prev => [
                ...prev,
                ...res.data.mypost
            ])
            setSkip(prev => prev + 6)
            if (res.data.mypost.length < 6) setHasMore(prev => !prev)
          })
          .catch((err)=>{
            console.log(err)
          })
    }

    const followUser = ()=>{
        axios.put('/user/follow', {followId:userid}, {headers})
        .then(()=>{
            updateFollow(true, userid)
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    followers : [...prevState.followers, userid]
                }
            })
            setShowFollow(false)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const unfollowUser = ()=>{
        axios.put('/user/unfollow', {unfollowId:userid}, {headers})
        .then(()=>{
            updateFollow(false, userid)
            setProfile((prevState)=>{
                const newFollower = prevState.followers.filter(item => item !== userid )
                 return {
                    ...prevState,
                    followers : newFollower
                 }
             })
             setShowFollow(true)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    return (
    <>
       {
       userProfile ?
       <div className="profile">
           <div className="profile-main">
               <div className="profile-img">
                   {
                       userProfile.img ? 
                       <img src={`/upload/${userProfile.img}`} alt="profile-img" /> :
                       <img src={user} alt="profile-img" />
                   }
               </div>
              
               <div className="profile-details">
                   <h4>{userProfile.name}</h4>
                   <h5>{userProfile.email}</h5>
              
                   <div className="profile-mini">
                       <h6>{posts.length} posts</h6>
                       <h6>{userProfile.followers.length} followers</h6>
                       <h6>{userProfile.following.length} following</h6>
                   </div>
              
                   { 
                    showfollow ? 
                   <button onClick={()=>followUser()}>
                        Follow
                    </button>
                    : 
                    <button onClick={()=>unfollowUser()}>
                        UnFollow
                    </button>
                    } 
               </div>
           </div>

           {
            posts.length > 0 ?     
            <div className="profile-posts">
                {
                posts.map(item=>{
                    return(
                    <img
                        key={item._id} 
                        className="item" 
                        src={`/upload/${item.photo}`} 
                        alt={item._id}
                    />  
                    )
                })
                }
            </div>
            : <h3 className="text-center">No post yet</h3>
            }
            
            {
                hasMore && 
                <button onClick={getPhotos}>Load more</button>
            }
       </div>

       : <Loading />
       }
    </>
   )
}

export default UsersProfile