import { useReducer, useEffect } from 'react'
import PicsReducer from '../State/PIcs/PicsReducer'
import axios from 'axios'

const initialState = {
    pics : [],
    skip : 0,
    hasMore : true,
    loading : false,
    error : ""
}

function usePhotos(id, headers){
    const [ { pics, skip, loading, hasMore, error } , dispatch ] = useReducer(PicsReducer, initialState)
    
    useEffect(()=>{
        getPhotos()
    }, [])

    const getPhotos = async () => {
        try {
            let res = await axios.get(`/post/onlyphotos/${id}/?skip=${skip}`, {headers})
            const payload = {
                pics : res.data.pics
            }            
            dispatch({ type : 'GET', payload })
       
        } catch (error) {
            dispatch({ type : "ERROR" })
            console.log(error)               
        }
    }

    return [ pics, hasMore, getPhotos ]
}

export default usePhotos