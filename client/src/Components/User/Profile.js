import React, { useContext } from 'react'
import '../../CSS/profile.css'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import user from '../../Img/user.png'
import { useHistory } from 'react-router-dom'
import usePhotos from '../Customs/usePhotos'
import { Loading } from '../Common'

function Profile() {
    const { _id, name, email, followers, following, img, headers } = useContext(AuthContext)
    const [ initPicLoad, pics, hasMore, picsLoading, picsError, getPhotos ] = usePhotos(_id, headers)
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
            !initPicLoad ?
            <>
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
                picsLoading &&
                <div className="rel-pos"><Loading /></div>
            }

            {                    
                (hasMore && !picsLoading) &&
                <button onClick={getPhotos}>Load more</button>
            }
            
            {
                picsError && <div>Error</div>
            }
            </>
            : <div className="rel-pos"><Loading /></div>
            }
        </div>
    )        
}

export default Profile