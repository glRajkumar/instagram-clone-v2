import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import '../../CSS/profile.css'
import user from '../../Img/user.png'
import Loading from '../Common/Loading'
import usePhotos from '../Customs/usePhotos'

const UsersProfile = () => {
    const [userProfile, setProfile] = useState(null)
    const { userid } = useParams()
    const { updateFollow, headers } = useContext(AuthContext)
    const [showfollow, setShowFollow] = useState(true)
    const [initPicLoad, pics, hasMore, picsLoading, picsError, getPhotos] = usePhotos(userid, headers)

    useEffect(() => {
        axios.get(`/user/${userid}`, { headers })
            .then((res) => {
                console.log(res.data)
                setProfile(res.data.otherUser)
                setShowFollow(res.data.isFollowing)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const followUser = () => {
        axios.put('/user/follow', { followId: userid }, { headers })
            .then(() => {
                updateFollow(true)
                setProfile((prev) => {
                    return {
                        ...prev,
                        followersCount: prev.followersCount + 1
                    }
                })
                setShowFollow(true)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const unfollowUser = () => {
        axios.put('/user/unfollow', { unfollowId: userid }, { headers })
            .then(() => {
                updateFollow(false)
                setProfile((prev) => {
                    return {
                        ...prev,
                        followersCount: prev.followersCount - 1
                    }
                })
                setShowFollow(false)
            })
            .catch((err) => {
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
                                <h2>{userProfile.fullName}</h2>
                                <h2>{userProfile.userName}</h2>
                                <h3>{userProfile.email}</h3>

                                <div className="profile-mini">
                                    <h5>{userProfile.totalPosts} posts</h5>
                                    <h5>{userProfile.followersCount} followers</h5>
                                    <h5>{userProfile.followingCount} following</h5>
                                </div>

                                {
                                    !showfollow ?
                                        <button onClick={followUser}>
                                            Follow
                                        </button>
                                        :
                                        <button onClick={unfollowUser}>
                                            UnFollow
                                        </button>
                                }
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
                    : <div className="rel-pos"><Loading /></div>
            }
        </>
    )
}

export default UsersProfile