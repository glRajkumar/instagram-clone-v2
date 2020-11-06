import React from 'react'
import Loading from '../Common/Loading'
import user from '../../Img/user.svg'
import { Link } from 'react-router-dom'
import '../../CSS/suggest.css'
import useLists from '../Customs/useLists'

function Suggestions({ headers, isGrid }) {
    const {
        initListLoad,
        lists,
        listsLoading,
        hasMore,
        listsError,
        getLists,
        follow,
        unFollow,
        requests,
        cancelReq
    } = useLists('/other_user/suggestions', headers)

    const followAction = (isPublic, id) => {
        if (isPublic) {
            follow(id)
        } else {
            requests(id)
        }
    }

    return !initListLoad ? (
        <div className={isGrid ? "sug-grid-cont" : 'sug-flex-cont'}>
            {
                lists.length > 0 &&
                lists.map(list => {
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
                                <button className="grey-btn" onClick={() => cancelReq(list._id)}>Requested</button>
                            }
                        </div>
                    )
                })
            }

            {
                listsLoading &&
                <div className="rel-pos"><Loading /></div>
            }

            {
                hasMore && !listsLoading &&
                <div className="sug-center">
                    <button onClick={getLists}>load more</button>
                    {
                        !isGrid && <Link to="/suggest">View in FullScreen</Link>
                    }
                </div>
            }

            {
                listsError && <div>error</div>
            }
        </div>
    )
        : <div className="rel-pos"><Loading /></div>
}

export default Suggestions