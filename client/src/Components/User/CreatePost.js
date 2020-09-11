import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import ProgressBar from '../Common/ProgressBar'
import insta_logo from '../../Img/Insta_logo.png'

function CreatePost() {
    const [ title, setTitle ] = useState('')
    const [ body, setBody ] = useState('')
    const [ selectedFile, setFile ] = useState(null)
    const [ progress, setProgress ] = useState(0)
    const [ picUrl, setPicUrl ] = useState("")
    const history = useHistory()
    const { headers } = useContext(AuthContext)

    useEffect(()=>{
        if (picUrl) {
            axios.post('/post/createpost', {title, body, picUrl}, {headers})
            .then((res)=>{
                history.push('/')
            })
            .catch(err => {
                console.log(err)
            })  
        }
    },[picUrl])
    
    const submit = (e) =>{
        e.preventDefault();                
        const formData = new FormData()
        formData.append("img", selectedFile)

        const config = {
            headers,
            header: { 'content-type': 'multipart/form-data' },
            onUploadProgress : progEvent => {   
                let percent = Math.floor((progEvent.loaded * 100) / progEvent.total)
                if (percent < 100) setProgress(percent)
                if(percent === 100) setProgress(99) 
            } 
        }

        axios.post("/upload", formData, config)
        .then(res => {
            setProgress(0)
            setPicUrl(res.data.img)
        })
        .catch(err => {
            console.log(err)
            setProgress(0)
        })
    }

    return (
        <div className="form-box">
            <div className="text-center">
                <img src={insta_logo} alt="instagram logo" />
            </div>
            <br />
            
            <input
             className="input-box"
             type="text" 
             placeholder="title"
             value={title}
             onChange={(e)=> setTitle(e.target.value)}
            />

            <input
             className="input-box"
             type="text" 
             placeholder="body" 
             value={body}
             onChange={(e)=> setBody(e.target.value)}
            />

            <div className="file-wrapper">
                <label htmlFor="file" className="file-label">
                    { selectedFile ? `${selectedFile.name}` : "Upload picture" }  
                </label>
                <input
                    className="file-input" 
                    type="file" 
                    name="img" 
                    accept="image/*" 
                    onChange={ e => setFile(e.target.files[0]) } 
                />
            </div>
            
            <div className="text-center">
                <button type="submit" onClick={submit}>
                    Submit Post
                </button>
            </div>

            { progress > 0 && <ProgressBar progress={progress} />}
        </div>
    )
}

export default CreatePost