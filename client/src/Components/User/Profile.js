import React, { useContext } from 'react'
import '../../CSS/profile.css'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import user from '../../Img/user.svg'
import { useHistory } from 'react-router-dom'
import usePhotos from '../Customs/usePhotos'
import { Loading } from '../Common'

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

    const [initPicLoad, pics, hasMore, picsLoading, picsError, getPhotos] = usePhotos(_id, headers)
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
                            <p> {totalPosts} </p>
                            <p> posts </p>
                        </div>
                        <div onClick={() => history.push('/followers')}>
                            <p> {followersCount} </p>
                            <p> followers </p>
                        </div>
                        <div onClick={() => history.push('/following')}>
                            <p> {followingCount} </p>
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

            {
                !initPicLoad ?
                    <>
                        {
                            pics.length > 0 ?
                                <div className="profile-posts">
                                    {
                                        pics.map(item => {
                                            return (
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