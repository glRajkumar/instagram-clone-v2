import React, { useState, useContext } from 'react'
import ProgressBar from '../Common/ProgressBar'
import axios from 'axios'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import insta_logo from '../../Img/Insta_logo.png'
import { useHistory } from 'react-router-dom'

function UpdateImg() {
    const [ selectedFile, setFile ] = useState(null)
    const [ progress, setProgress ] = useState(0)
    const { headers, updatePic } = useContext(AuthContext)
    const history = useHistory()

    console.log(progress)

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

        axios.put("/user/update-img", formData, config)
        .then(res => {
            console.log(res.data)
            setProgress(0)
            updatePic(res.data.img)
            history.push('/profile')
        })
        .catch(err => {
            console.log(err)
            setProgress(0)
        })
    }

    return (
        <div className="form-box">
            <h2 className="text-center">
                <img src={insta_logo} alt="instagram logo" />
            </h2>
            <br />
        
            <div className="file-wrapper">
                <label htmlFor="file" className="file-label">
                    { selectedFile ? `${selectedFile.name}` : "Update pic" }  
                </label>
                <input
                    className="file-input" 
                    type="file" 
                    name="img" 
                    accept="image/*" 
                    onChange={ e => setFile(e.target.files[0]) } 
                />
            </div>

            <div>
                <button onClick={submit}>Submit</button>
            </div>
            
            { progress > 0 && <ProgressBar progress={progress} />}            
        </div>
    )
}

export default UpdateImg