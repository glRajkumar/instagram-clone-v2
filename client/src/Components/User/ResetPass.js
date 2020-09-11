import React, {useState, useRef, useEffect} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import Loading from '../Common/Loading'
import { useEvalid } from '../Customs/useValidation'
import useInput from '../Customs/useInput'
import insta_logo from '../../Img/Insta_logo.png'

const ResetPass = () =>{
    const [ email, eonChange, emsg, eerr ] = useInput('', useEvalid)
    
    let emailRef = useRef('')
    let SubRef = useRef('')

    const [ logfail, setLogfail ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const history = useHistory()
    
    useEffect(()=>{
        emailRef.current.focus() 
    }, [])

    function emailKeyDown(e) {
        if(e.key === "Enter") SubRef.current.focus()
    }

    const onSubmit = async (event) =>{
        event.preventDefault();
        try {
            if(eerr === false){
                setLoading(true)
                await axios.post("/user/reset-password",{ email })
                history.push("/token")
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
            setLogfail(true)
        }
    }

    return !loading ? (
    <div className="form-box">
        <h2 className="text-center">
            <img src={insta_logo} alt="instagram logo" />
        </h2>
        <br />
        
        { logfail &&
            <div className="alert">
                Invalid Sign Up credentials
            </div>
        }

        <label htmlFor="email"> Email </label>
        <input
            className="input-box"
            ref={emailRef}
            onKeyDown={emailKeyDown} 
            name="email"
            type="email"
            value={email}
            onChange={eonChange}
        />
        { 
        eerr && <div className="alert"> {emsg} </div>                        
        }

        <button
            ref={SubRef} 
            onClick={onSubmit}
        >Reset Password</button>        

    </div>
    ) : (<Loading />)
}

export default ResetPass