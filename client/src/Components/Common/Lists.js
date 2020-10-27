import React from 'react'
import Loading from '../Common/Loading'
import useLists from '../Customs/useLists'
import user from '../../Img/user.svg'
import '../../CSS/lists.css'

function Lists({ url, headers }) {
    const [
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
    ] = useLists(url, headers)

    const followAction = (isPublic, id) => {
        if (isPublic) {
            follow(id)
        } else {
            requests(id)
        }
    }

    return !initListLoad ? (
        <div className="lists-container">
            {
                lists.length > 0 &&
                lists.map(list => {
                    return (
                        <div className="lists" key={list._id}>
                            <div className="lists-profile">
                                <img
                                    className="list-img"
                                    src={list.img ? `/upload/${list.img}` : user}
                                    alt="userprofile"
                                />
                                <p> {list.userName} </p>
                            </div>
                            {
                                !list.isFollowing && !list.isRequested &&
                                <button onClick={() => followAction(list.isPublic, list._id)}>Follow</button>
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
                listsLoading &&
                <div className="rel-pos"><Loading /></div>
            }

            {
                hasMore && !listsLoading &&
                <div className="loadbtn">
                    <button onClick={getLists}>load more</button>
                </div>
            }

            {
                listsError && <div>error</div>
            }
        </div>
    )
        : <div className="rel-pos"><Loading /></div>
}

export default Lists