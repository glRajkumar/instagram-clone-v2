import { useState, useEffect } from 'react'
import axios from 'axios'

const useFetch = (url, headers) => {
    const [ loading, setLoading ] = useState(true)
    const [ data, setData ] = useState([])

    useEffect(()=>{
        // let mounted = true
        let source = axios.CancelToken.source()

        const loadData = async () => {
            // const res = await axios.get(url)
            // if(mounted) setData(res.data)
            try {
                const res = await axios.get( url, { headers },{ cancelToken: source.token })
                setData(res.data)                    
                setLoading(false)
            } catch (error) {
                if(axios.isCancel(error)){
                    console.log(`axios cancel at ${url}`)
                }else{
                    throw error
                } 
            }
        }
        loadData()

        // return ()=> mounted = false
        return ()=> source.cancel()
    }, [url])

    return { loading, data }
}

export default useFetch
