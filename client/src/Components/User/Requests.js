import React, { useEffect, useContext, useReducer, useState } from 'react'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import Loading from '../Common/Loading'
import user from '../../Img/user.svg'
import '../../CSS/lists.css'
import axios from 'axios'

const initialState = {
    lists: [],
    skip: 0,
    listsLoading: false,
    hasMore: true,
    listsError: ""
}

const reqReducer = (state, { type, payload }) => {
    switch (type) {
        case "LOADING":
            return {
                ...state,
                listsLoading: true
            }

        case "GET":
            if (payload.lists.length < 10) {
                return {
                    ...state,
                    skip: state.skip + 10,
                    listsLoading: false,
                    lists: [
                        ...state.lists,
                        ...payload.lists
                    ],
                    hasMore: false
                }
            } else {
                return {
                    ...state,
                    skip: state.skip + 10,
                    listsLoading: false,
                    lists: [
                        ...state.lists,
                        ...payload.lists
                    ]
                }
            }

        case 'REQ':
            const newData = state.lists.filter(item => item._id !== payload)
            return {
                ...state,
                lists: newData
            }

        case "ERROR":
            return {
                ...state,
                listsLoading: false,
                listsError: "Something went wrong..."
            }

        default: return state
    }
}

function Requests({ headers }) {
    const { updateFollowers } = useContext(AuthContext)
    const [initListLoad, setInit] = useState(true)
    const [{ lists, skip, listsLoading, hasMore, listsError }, dispatch] = useReducer(reqReducer, initialState)

    useEffect(() => {
        getLists()
        setInit(false)
    }, [])

    const getLists = async () => {
        try {
            dispatch({ type: 'LOADING' })
            let res = await axios.get(`/user/requests/?skip=${skip}`, { headers })
            const payload = {
                lists: res.data.requests
            }
            dispatch({ type: 'GET', payload })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const acceptReq = async (reqId) => {
        try {
            await axios.put('/user/accept-req', { reqId }, { headers })
            updateFollowers()
            dispatch({ type: "REQ", payload: reqId })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const declineReq = async (reqId) => {
        try {
            await axios.put('/user/decline-req', { reqId }, { headers })
            dispatch({ type: "REQ", payload: reqId })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    return !initListLoad ? (
        <div className="lists-container">
            <p>Action cannot be reversed. So Think before taking the action.</p>
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

                            <div>
                                <button onClick={() => acceptReq(list._id)}>Accept</button>
                                <button onClick={() => declineReq(list._id)}>Decline</button>
                            </div>
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

export default Requests