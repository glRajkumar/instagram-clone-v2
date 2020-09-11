import React, {useState, useRef, useEffect} from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import Loading from '../Common/Loading'
import { usePvalid } from '../Customs/useValidation'
import useInput from '../Customs/useInput'
import insta_logo from '../../Img/Insta_logo.png'

const NewPassGen = () =>{
    const [ password, ponChange, pmsg, perr ] = useInput('', usePvalid)
    const [token, setToken] = useState('') 
   
    let tokenRef = useRef('')
    let passRef = useRef('')
    let SubRef = useRef('')

    const [ logfail, setLogfail ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const history = useHistory()
    
    useEffect(()=>{
        tokenRef.current.focus() 
    }, [])

    function tokenKeyDown(e) {
        if(e.key === "Enter") passRef.current.focus()
    }

    function passKeyDown(e) {
        if(e.key === "Enter") SubRef.current.focus()
    }

    const onSubmit = async (event) =>{
        event.preventDefault();
        try {
            if(perr === false){
                setLoading(true)
                await axios.post("/user/new-password",{ password, token })
                history.push("/login")
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

        <p>Check your email for the token</p>

        <label htmlFor="password"> Paste the token </label>
        <input
            className="input-box"
            ref={tokenRef}
            onKeyDown={tokenKeyDown} 
            name="token"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
        />

        <label htmlFor="password">New Password </label>
        <input
            className="input-box"
            ref={passRef}
            onKeyDown={passKeyDown} 
            name="password"
            type="password"
            value={password}
            onChange={ponChange}
        />
        { 
        perr && <div className="alert"> {pmsg} </div>                        
        }

        <button
            ref={SubRef} 
            onClick={onSubmit}
        >Update Password</button>        
        
    </div>
    ) : (<Loading />)
}

export default NewPassGen