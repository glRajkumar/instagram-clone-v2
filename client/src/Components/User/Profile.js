import React, { useEffect, useState, useContext } from 'react'
import '../../CSS/profile.css'
import axios from 'axios'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import user from '../../Img/user.png'
import { useHistory } from 'react-router-dom'

function Profile() {
    const [ mypics, setPics ] = useState([])
    const { _id, name, email, followers, following, img, headers } = useContext(AuthContext)
    const history = useHistory()
    const [ hasMore, setHasMore ] = useState(true)
    const [ skip, setSkip ] = useState(0)

    useEffect(()=>{
        getPhotos()
    }, [])

    const getPhotos = () => {
        axios.get(`/post/onlyphotos/${_id}/?skip=${skip}`, {headers})
        .then((res)=>{
            setPics(prev => [
                ...prev,
                ...res.data.mypost
            ])
            setSkip(prev => prev + 5)
            if (res.data.mypost.length < 5) setHasMore(prev => !prev)
          })
          .catch((err)=>{
            console.log(err)
          })
    }

    return (
        <div className="profile">
            <div className="profile-main">
                <div className="profile-img">
                    { 
                    img ? 
                    <img src={`/upload/${img}`} alt="profile-img"/> : 
                    <img src={user} alt="profile-img"/>
                    }
                </div>

                <div className="profile-details">
                    <h2>{ name }</h2>
                    <h3>{ email }</h3>
                    
                    <div className="profile-mini">
                        <h5>{ mypics ? mypics.length : "0" } posts</h5>
                        <h5>{ followers.length } followers</h5>
                        <h5>{ following.length } following</h5>
                    </div>
                </div>
            </div>

            <div className="profile-extra">
                <button style={{marginRight: '5px'}} onClick={() =>{ history.push('/updateimg')}}>Update Image</button>
                <button style={{marginRight: '5px'}} onClick={() =>{ history.push('/updatepass')}}>Update Password</button>
                <button onClick={() =>{ history.push('/resetpass')}}>Reset Password</button>
            </div>

            {
            mypics.length > 0 ?
            <div className="profile-posts">
                {
                mypics.map(item=>{
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
    )
}

export default Profile