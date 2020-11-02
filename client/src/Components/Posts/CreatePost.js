import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import ProgressBar from '../Common/ProgressBar'
import insta_logo from '../../Img/Insta_logo.png'

function CreatePost() {
    const fileNnames = []
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [selectedFiles, setFile] = useState(null)
    const [progress, setProgress] = useState(0)
    const [files, setFiles] = useState("")
    const history = useHistory()
    const { headers, updateTotalPosts } = useContext(AuthContext)

    const handleChange = async () => {
        if (selectedFiles) {
            for (const key of Object.keys(selectedFiles)) {
                fileNnames.push(selectedFiles[key].name)
            }
        }
    }
    handleChange()

    useEffect(() => {
        if (files) {
            axios.post('/post/createpost', { title, body, files }, { headers })
                .then(() => {
                    updateTotalPosts(true)
                    history.push('/myposts')
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [files])

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData()

        for (const key of Object.keys(selectedFiles)) {
            formData.append("files", selectedFiles[key])
        }

        const config = {
            headers,
            header: { 'content-type': 'multipart/form-data' },
            onUploadProgress: progEvent => {
                let percent = Math.floor((progEvent.loaded * 100) / progEvent.total)
                if (percent < 100) setProgress(percent)
                if (percent === 100) setProgress(99)
            }
        }

        axios.post("/upload", formData, config)
            .then(res => {
                setProgress(0)
                setFiles(res.data.names)
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
                onChange={(e) => setTitle(e.target.value)}
            />

            <input
                className="input-box"
                type="text"
                placeholder="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />

            <div className="file-wrapper">
                <label htmlFor="file" className="file-label">
                    {fileNnames.length > 0 ? fileNnames.join(", ") : "Upload picture"}
                </label>
                <input
                    className="file-input"
                    type="file"
                    name="files"
                    accept="image/*,video/*"
                    multiple
                    onChange={e => setFile(e.target.files)}
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