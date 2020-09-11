import React, { useEffect, useRef, useState, useContext } from 'react'
import { usePvalid, useCvalid } from '../Customs/useValidation'
import useInput from '../Customs/useInput'
import axios from 'axios'
import insta_logo from '../../Img/Insta_logo.png'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import { useHistory } from 'react-router-dom'

function NewPass() {
    const [ oldPass, oldPonChange, opmsg, operr ] = useInput('', usePvalid)
    const [ newPass, newPonChange, npmsg, nperr ] = useInput('', usePvalid)
    const [ conPass, conPonChange, cpmsg, cperr ] = useInput('', useCvalid, newPass)
    const [ fail, setFail ] = useState(false)
    const { headers } = useContext(AuthContext)
    const history = useHistory()

    let oldPassRef = useRef('')
    let newPassRef = useRef('')
    let conPassRef = useRef('')
    let SubRef = useRef('')

    useEffect(()=>{
        oldPassRef.current.focus() 
    }, [])

    function oldPassKeyDown(e) {
        if(e.key === "Enter") newPassRef.current.focus()
    }

    function newPassKeyDown(e) {
        if(e.key === "Enter") conPassRef.current.focus()
    }

    function conPassKeyDown(e) {
        if(e.key === "Enter") SubRef.current.focus()
    }

    const onSubmit = async (event) =>{
        event.preventDefault();
        try {
            if(operr === false && nperr === false && cperr === false){
                await axios.put("/user/update-password", { oldPass, newPass }, {headers})
                history.push('/profile')
            }
        } catch (error) {
            setFail(true)
            console.log(error)
        }
    }

return (
    <div className="form-box">
        <h2 className="text-center">
            <img src={insta_logo} alt="instagram logo" />
        </h2>
        <br />

        <label htmlFor="password"> Old Password </label>
        <input
            className="input-box"
            ref={oldPassRef}
            onKeyDown={oldPassKeyDown} 
            name="password"
            type="password"
            value={oldPass}
            onChange={oldPonChange}
        />
        { 
        operr && <div className="alert"> {opmsg} </div>                        
        }

        <label htmlFor="password"> New Password </label>
        <input
            className="input-box"
            ref={newPassRef}
            onKeyDown={newPassKeyDown} 
            name="password"
            type="password"
            value={newPass}
            onChange={newPonChange}
        />
        { 
        nperr && <div className="alert"> {npmsg} </div>                        
        }

        <label htmlFor="password"> Conform Password </label>
        <input
            className="input-box"
            ref={conPassRef}
            onKeyDown={conPassKeyDown} 
            name="password"
            type="password"
            value={conPass}
            onChange={conPonChange}
        />
        { 
        cperr && <div className="alert"> {cpmsg} </div>                        
        }

        <button
            ref={SubRef} 
            onClick={onSubmit}
        >Submit</button>

        {
        fail && <div className="alert"> Failed to Update. Try again.</div> 
        }
    </div>
)
}

export default NewPass