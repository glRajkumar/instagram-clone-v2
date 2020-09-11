import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import '../../CSS/profile.css'
import user from '../../Img/user.png'

const UserProfile  = ()=>{
    const [ userProfile,setProfile ] = useState(null)    
    const { userid } = useParams()
    const { updateFollow, following, headers } = useContext(AuthContext)
    const [ showfollow, setShowFollow ] = useState(following ? !following.includes(userid) : true)
    
    useEffect(()=>{
        axios.get(`/user/${userid}`, {headers})
        .then((res)=>{
            setProfile(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    },[])

    const followUser = ()=>{
        axios.put('/user/follow', {followId:userid}, {headers})
        .then((res)=>{
            updateFollow(true, userid)
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers, userid]
                       }
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
        .then((res)=>{
            updateFollow(false, userid)
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item => item !== userid )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
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
                       userProfile.user.img ? 
                       <img src={`/upload/${userProfile.user.img}`} alt="profile-img" /> :
                       <img src={user} alt="profile-img" />
                   }
               </div>
              
               <div className="profile-details">
                   <h4>{userProfile.user.name}</h4>
                   <h5>{userProfile.user.email}</h5>
              
                   <div className="profile-mini">
                       <h6>{userProfile.posts.length} posts</h6>
                       <h6>{userProfile.user.followers.length} followers</h6>
                       <h6>{userProfile.user.following.length} following</h6>
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
     
           <div className="profile-posts">
               {
                userProfile.posts.map(item=>{
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
       </div>
       : <h2>loading...!</h2>}
       </>
   )
}


export default UserProfile