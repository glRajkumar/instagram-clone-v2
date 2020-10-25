import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import '../../CSS/profile.css'
import user from '../../Img/user.svg'
import lock from '../../Img/locked.png'
import Loading from '../Common/Loading'
import usePhotos from '../Customs/usePhotos'

const UsersProfile = () => {
    const [userProfile, setProfile] = useState(null)
    const { userid } = useParams()
    const { updateFollow, headers } = useContext(AuthContext)
    const [showfollow, setShowFollow] = useState(null)
    const [initPicLoad, pics, hasMore, picsLoading, picsError, getPhotos] = usePhotos(userid, headers)

    useEffect(() => {
        axios.get(`/user/${userid}`, { headers })
            .then((res) => {
                setProfile(res.data.otherUser)
                setShowFollow(res.data.isFollowing)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const followUser = async () => {
        try {
            await axios.put('/user/follow', { followId: userid }, { headers })
            updateFollow(true)
            setProfile(prev => {
                return {
                    ...prev,
                    followersCount: prev.followersCount + 1
                }
            })
            setShowFollow(true)

        } catch (error) {
            console.log(error)
        }
    }

    const unfollowUser = async () => {
        try {
            await axios.put('/user/unfollow', { unfollowId: userid }, { headers })
            updateFollow(false)
            setProfile((prev) => {
                return {
                    ...prev,
                    followersCount: prev.followersCount - 1
                }
            })
            setShowFollow(false)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {
                userProfile ?
                    <div className="profile">
                        <p className="profile-username">{userProfile.userName}</p>

                        <div className="profile-main">
                            <div className="profile-img">
                                <img
                                    src={userProfile.img ? `/upload/${userProfile.img}` : user}
                                    alt="profile-img"
                                />

                                <p>{userProfile.fullName}</p>
                            </div>

                            <div className="profile-details">
                                <div className="profile-mini">
                                    <div>
                                        <p> {userProfile.totalPosts} </p>
                                        <p> posts </p>
                                    </div>
                                    <div>
                                        <p> {userProfile.followersCount} </p>
                                        <p> followers </p>
                                    </div>
                                    <div>
                                        <p> {userProfile.followingCount} </p>
                                        <p> following </p>
                                    </div>
                                </div>
                                {
                                    !showfollow ?
                                        <button onClick={followUser}> Follow </button> :
                                        <button onClick={unfollowUser}> UnFollow </button>
                                }
                            </div>
                        </div>

                        {
                            !showfollow && !userProfile.isPublic &&
                            <div className="public">
                                <img src={lock} alt="private" />
                                <div>
                                    <h5>This account is private</h5>
                                    <p>Follow this account to see their photos and videos</p>
                                </div>
                            </div>
                        }

                        {
                            userProfile.isPublic &&
                            <div>
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
                        }
                    </div>
                    : <div className="rel-pos"><Loading /></div>
            }
        </>
    )
}

export default UsersProfile