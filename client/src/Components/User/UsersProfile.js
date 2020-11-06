import React, { useEffect, useState, useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import '../../CSS/profile.css'
import user from '../../Img/user.svg'
import lock from '../../Img/locked.png'
import Loading from '../Common/Loading'
import Photos from '../Common/Photos'

const UsersProfile = () => {
    const [userProfile, setProfile] = useState(null)
    const [showPosts, setShow] = useState(null)
    const { userid } = useParams()
    const history = useHistory()
    const { followingCount, authDispatch, headers } = useContext(AuthContext)

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
            authDispatch({ type: "ACTION", payload: { followingCount: followingCount + 1 } })
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
            authDispatch({ type: "ACTION", payload: { followingCount: followingCount - 1 } })
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
                                    <div onClick={() => {
                                        if (showPosts) history.push(`/othersfollowers/${userProfile._id}`)
                                    }}>
                                        <p> {userProfile.followersCount} </p>
                                        <p> followers </p>
                                    </div>
                                    <div onClick={() => {
                                        if (showPosts) history.push(`/othersfollowing/${userProfile._id}`)
                                    }
                                    }>
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
                                    <button className="grey-btn" onClick={cancelReqUser}>Requested</button>
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
                            showPosts && <Photos id={userid} headers={headers} />
                        }
                    </div>
                    : <div className="rel-pos"><Loading /></div>
            }
        </>
    )
}

export default UsersProfile