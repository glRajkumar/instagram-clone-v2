import React, { useContext } from 'react'
import '../../CSS/profile.css'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import user from '../../Img/user.png'
import { useHistory } from 'react-router-dom'
import usePhotos from '../Customs/usePhotos'

function Profile() {
    const { _id, name, email, followers, following, img, headers } = useContext(AuthContext)
    const [ pics, hasMore, getPhotos ] = usePhotos(_id, headers)
    const history = useHistory()

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
                        <h5>{ pics ? pics.length : "0" } posts</h5>
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
            pics.length > 0 ?
            <div className="profile-posts">
                {
                pics.map(item=>{
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