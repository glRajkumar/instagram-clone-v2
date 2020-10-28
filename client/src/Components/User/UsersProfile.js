import React, { useEffect, useState, useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import '../../CSS/profile.css'
import user from '../../Img/user.svg'
import lock from '../../Img/locked.png'
import Loading from '../Common/Loading'
import usePhotos from '../Customs/usePhotos'

const UsersProfile = () => {
    const [userProfile, setProfile] = useState(null)
    const [showPosts, setShow] = useState(null)
    const { userid } = useParams()
    const history = useHistory()
    const { updateFollow, headers } = useContext(AuthContext)
    const [initPicLoad, pics, hasMore, picsLoading, picsError, getPhotos] = usePhotos(userid, headers)

    useEffect(() => {
        async function getUser() {
            try {
                let { data } = await axios.get(`/other_user/${userid}`, { headers })
                setProfile(data)
                if (data.isPublic) {
                    setShow(true)
                } else {
                    if (data.isFollowing) return setShow(true)
                    setShow(false)
                }

            } catch (error) {
                console.log(error)
            }
        }
        getUser()
    }, [])

    const followUser = async () => {
        try {
            await axios.put('/user/follow', { followId: userid }, { headers })
            updateFollow(true)
            setProfile(prev => {
                return {
                    ...prev,
                    followersCount: prev.followersCount + 1,
                    isFollowing: true
                }
            })

        } catch (error) {
            console.log(error)
        }
    }

    const reqUser = async () => {
        try {
            await axios.put('/user/requests', { reqId: userid }, { headers })
            setProfile(prev => {
                return {
                    ...prev,
                    isRequested: true
                }
            })

        } catch (error) {
            console.log(error)
        }
    }

    const cancelReqUser = async () => {
        try {
            await axios.put('/user/cancel-req', { reqId: userid }, { headers })
            setProfile(prev => {
                return {
                    ...prev,
                    isRequested: false
                }
            })

        } catch (error) {
            console.log(error)
        }
    }

    const unfollowUser = async () => {
        try {
            await axios.put('/user/unfollow', { unfollowId: userid }, { headers })
            updateFollow(false)
            setProfile(prev => {
                return {
                    ...prev,
                    followersCount: prev.followersCount - 1,
                    isFollowing: false
                }
            })

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
                                    <div onClick={() => history.push(`/othersfollowers/${userProfile._id}`)}>
                                        <p> {userProfile.followersCount} </p>
                                        <p> followers </p>
                                    </div>
                                    <div onClick={() => history.push(`/othersfollowing/${userProfile._id}`)}>
                                        <p> {userProfile.followingCount} </p>
                                        <p> following </p>
                                    </div>
                                </div>
                                {
                                    !userProfile.isFollowing && !userProfile.isRequested &&
                                    <button onClick={userProfile.isPublic ? followUser : reqUser}>
                                        Follow
                                    </button>
                                }

                                {
                                    userProfile.isFollowing &&
                                    <button onClick={unfollowUser}> UnFollow </button>
                                }

                                {
                                    userProfile.isRequested &&
                                    <button onClick={cancelReqUser}>Requested</button>
                                }
                            </div>
                        </div>

                        {
                            !userProfile.isFollowing && !userProfile.isPublic &&
                            <div className="public">
                                <img src={lock} alt="private" />
                                <div>
                                    <h5>This account is private</h5>
                                    <p>Follow this account to see their photos and videos</p>
                                </div>
                            </div>
                        }

                        {
                            showPosts &&
                            <div>
                                {
                                    !initPicLoad ? <>
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
                                            hasMore && !picsLoading &&
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