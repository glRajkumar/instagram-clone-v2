import { useEffect, useReducer, useState } from 'react'
import ListsReducer from '../State/Lists/ListsReducer'
import axios from 'axios'

const initialState = {
    lists: [],
    skip: 0,
    listsLoading: false,
    hasMore: true,
    listsError: ""
}

function useLists(url, headers) {
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
            console.log(res.data.lists)
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
            dispatch({ type: "FOLLOW", payload: followId })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const unFollow = async (unfollowId) => {
        try {
            await axios.put('/user/unfollow', { unfollowId }, { headers })
            dispatch({ type: "UNFOLLOW", payload: unfollowId })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const requests = async (reqId) => {
        try {
            await axios.put('/user/requests', { reqId }, { headers })
            dispatch({ type: "REQ", payload: reqId })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const cancelReq = async (reqId) => {
        try {
            await axios.put('/user/cancel-req', { reqId }, { headers })
            dispatch({ type: "UNREQ", payload: reqId })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const acceptReq = async (reqId) => {
        try {
            await axios.put('/user/accept-req', { reqId }, { headers })
            dispatch({ type: "ACCEPT", payload: reqId })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const declineReq = async (reqId) => {
        try {
            await axios.put('/user/decline-req', { reqId }, { headers })
            dispatch({ type: "DECLINE", payload: reqId })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    return [
        initListLoad,
        lists,
        listsLoading,
        hasMore,
        listsError,
        getLists,
        follow,
        unFollow,
        requests,
        cancelReq,
        acceptReq,
        declineReq
    ]
}

export default useLists