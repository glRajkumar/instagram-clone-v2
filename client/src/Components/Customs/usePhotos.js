import { useReducer, useEffect, useState } from 'react'
import PicsReducer from '../State/Pics/PicsReducer'
import axios from 'axios'

const initialState = {
    pics: [],
    skip: 0,
    hasMore: true,
    picsLoading: false,
    picsError: ""
}

function usePhotos(id, headers) {
    const [initPicLoad, setInit] = useState(true)
    const [{ pics, skip, hasMore, picsLoading, picsError }, dispatch] = useReducer(PicsReducer, initialState)

    useEffect(() => {
        getPhotos()
        setInit(false)
    }, [])

    const getPhotos = async () => {
        try {
            dispatch({ type: 'LOADING' })
            let res = await axios.get(`/post/onlyphotos/${id}/?skip=${skip}`, { headers })
            const payload = {
                pics: res.data.files
            }
            dispatch({ type: 'GET', payload })

        } catch (error) {
            dispatch({ type: "ERROR" })
            console.log(error)
        }
    }

    return { initPicLoad, pics, hasMore, picsLoading, picsError, getPhotos }
}

export default usePhotos