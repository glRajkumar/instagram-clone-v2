import React, { useContext } from 'react'
import '../../CSS/profile.css'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import user from '../../Img/user.svg'
import { useHistory } from 'react-router-dom'
import Photos from '../Common/Photos'

function Profile() {
    const {
        _id,
        fullName,
        userName,
        img,
        followersCount,
        followingCount,
        totalPosts,
        headers
    } = useContext(AuthContext)

    const history = useHistory()

    return (
        <div className="profile">
            <p className="profile-username"> {userName} </p>

            <div className="profile-main">
                <div className="profile-img">
                    <img
                        src={img ? `/upload/${img}` : user}
                        alt="profile-img"
                    />

                    <p>{fullName}</p>
                </div>

                <div className="profile-details">
                    <div className="profile-mini">
                        <div>
                            <p> <strong>{totalPosts}</strong> </p>
                            <p> posts </p>
                        </div>
                        <div onClick={() => history.push('/followers')}>
                            <p> <strong>{followersCount}</strong> </p>
                            <p> followers </p>
                        </div>
                        <div onClick={() => history.push('/following')}>
                            <p> <strong>{followingCount}</strong> </p>
                            <p> following </p>
                        </div>
                    </div>

                    <button
                        className="profile-edit"
                        onClick={() => history.push('/editprofile')}
                    >
                        Edit profile
                    </button>
                </div>
            </div>

            <Photos id={_id} headers={headers} />

        </div>
    )
}

export default Profile