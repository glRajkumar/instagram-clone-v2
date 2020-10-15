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
    const { updateFollow, following, headers } = useContext(AuthContext)
    const [showfollow, setShowFollow] = useState(following ? !following.includes(userid) : true)
    const [initPicLoad, pics, hasMore, picsLoading, picsError, getPhotos] = usePhotos(userid, headers)

    useEffect(() => {
        axios.get(`/user/${userid}`, { headers })
            .then((res) => {
                setProfile(res.data.user)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const followUser = () => {
        axios.put('/user/follow', { followId: userid }, { headers })
            .then(() => {
                updateFollow(true, userid)
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        followers: [...prevState.followers, userid]
                    }
                })
                setShowFollow(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const unfollowUser = () => {
        axios.put('/user/unfollow', { unfollowId: userid }, { headers })
            .then(() => {
                updateFollow(false, userid)
                setProfile((prevState) => {
                    const newFollower = prevState.followers.filter(item => item !== userid)
                    return {
                        ...prevState,
                        followers: newFollower
                    }
                })
                setShowFollow(true)
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
                                <h4>{userProfile.name}</h4>
                                <h5>{userProfile.email}</h5>

                                <div className="profile-mini">
                                    <h6>{pics.length} posts</h6>
                                    <h6>{userProfile.followers.length} followers</h6>
                                    <h6>{userProfile.following.length} following</h6>
                                </div>

                                {
                                    showfollow ?
                                        <button onClick={() => followUser()}>
                                            Follow
                        </button>
                                        :
                                        <button onClick={() => unfollowUser()}>
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