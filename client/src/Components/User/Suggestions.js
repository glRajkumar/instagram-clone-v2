import React from 'react'
import Loading from '../Common/Loading'
import user from '../../Img/user.svg'
import { Link } from 'react-router-dom'
import '../../CSS/suggest.css'
import useSuggestions from '../Customs/useSuggestions'

function Suggestions({ headers, isGrid }) {
    const {
        initSugLoad,
        suggestions,
        sugLoading,
        hasMore,
        sugError,
        getSug,
        follow,
        unFollow,
        requests,
        cancelReq
    } = useSuggestions(headers)

    const followAction = (isPublic, id) => {
        if (isPublic) {
            follow(id)
        } else {
            requests(id)
        }
    }

    return !initSugLoad ? (
        <div className={isGrid ? "sug-grid-cont" : 'sug-flex-cont'}>
            {
                suggestions.length > 0 &&
                suggestions.map(list => {
                    return (
                        <div className="sug" key={list._id}>
                            <Link to={`/profile/${list._id}`}>
                                <img
                                    className="sug-img"
                                    src={list.img ? `/upload/${list.img}` : user}
                                    alt="userprofile"
                                />
                                <p>
                                    {list.userName}
                                </p>
                            </Link>

                            {
                                !list.isFollowing && !list.isRequested &&
                                <button className="sug-follow" onClick={() => followAction(list.isPublic, list._id)}>Follow</button>
                            }

                            {
                                list.isFollowing &&
                                <button onClick={() => unFollow(list._id)}>UnFollow</button>
                            }

                            {
                                list.isRequested &&
                                <button onClick={() => cancelReq(list._id)}>Requested</button>
                            }
                        </div>
                    )
                })
            }

            {
                sugLoading &&
                <div className="rel-pos"><Loading /></div>
            }

            {
                hasMore && !sugLoading &&
                <div className="sug-center">
                    <button onClick={getSug}>load more</button>
                    {
                        !isGrid && <Link to="/suggest">View in FullScreen</Link>
                    }
                </div>
            }

            {
                sugError && <div>error</div>
            }
        </div>
    )
        : <div className="rel-pos"><Loading /></div>
}

export default Suggestions