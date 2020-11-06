import { useContext, useEffect, useReducer, useState } from 'react'
import ListsReducer from '../State/Lists/ListsReducer'
import axios from 'axios'
import { AuthContext } from '../State/Auth/AuthContextProvider'

const initialState = {
    lists: [],
    skip: 0,
    listsLoading: false,
    hasMore: true,
    listsError: ""
}

function useLists(url, headers) {
    const { _id, followingCount, authDispatch } = useContext(AuthContext)
    const [initListLoad, setInit] = useState(true)
    const [{ lists, skip, listsLoading, hasMore, listsError }, dispatch] = useReducer(ListsReducer, initialState)

    useEffect(() => {
        getLists()
        setInit(false)
    }, [])

    const getLists = async () => {
        try {
            dispatch({ type: 'LOADING' })
            let res = await axios.get(`${url}/?skip=${skip}`, { headers })
            const payload = {
                lists: res.data.lists
            }
            dispatch({ type: 'GET', payload })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const follow = async (followId) => {
        try {
            await axios.put('/user/follow', { followId }, { headers })
            authDispatch({ type: "ACTION", payload: { followingCount: followingCount + 1 } })
            const payload = {
                id: followId,
                info: {
                    isFollowing: true
                }
            }
            dispatch({ type: 'ACTION', payload })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const unFollow = async (unfollowId) => {
        try {
            await axios.put('/user/unfollow', { unfollowId }, { headers })
            authDispatch({ type: "ACTION", payload: { followingCount: followingCount - 1 } })
            const payload = {
                id: unfollowId,
                info: {
                    isFollowing: false
                }
            }
            dispatch({ type: 'ACTION', payload })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const requests = async (reqId) => {
        try {
            await axios.put('/user/requests', { reqId }, { headers })
            const payload = {
                id: reqId,
                info: {
                    isRequested: true
                }
            }
            dispatch({ type: 'ACTION', payload })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const cancelReq = async (reqId) => {
        try {
            await axios.put('/user/cancel-req', { reqId }, { headers })
            const payload = {
                id: reqId,
                info: {
                    isRequested: false
                }
            }
            dispatch({ type: 'ACTION', payload })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    return {
        _id,
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
    }
}

export default useLists