import { useState, useReducer, useEffect, useContext } from 'react'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import SuggestionReducer from '../State/Suggestion/SuggestionReducer'
import axios from 'axios'

const initialState = {
    suggestions: [],
    skip: 0,
    sugLoading: false,
    hasMore: true,
    sugError: ""
}

function useSuggestions(headers) {
    const { updateFollow } = useContext(AuthContext)
    const [initSugLoad, setInit] = useState(true)
    const [{ suggestions, skip, sugLoading, hasMore, sugError }, dispatch] = useReducer(SuggestionReducer, initialState)

    useEffect(() => {
        getSug()
        setInit(false)
    }, [])

    const getSug = async () => {
        try {
            dispatch({ type: 'LOADING' })
            let res = await axios.get(`/other_user/suggestions/?skip=${skip}`, { headers })
            let m = res.data.ids.map((id) => {
                return {
                    ...id,
                    isFollowing: false,
                    isRequested: false
                }
            })

            const payload = {
                suggestions: m
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
            updateFollow(true)
            dispatch({ type: "FOLLOW", payload: followId })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    const unFollow = async (unfollowId) => {
        try {
            await axios.put('/user/unfollow', { unfollowId }, { headers })
            updateFollow(false)
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

    return {
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
    }
}

export default useSuggestions