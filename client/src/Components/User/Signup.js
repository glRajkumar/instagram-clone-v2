import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { useHistory, Link } from 'react-router-dom'
import Loading from '../Common/Loading'
import { useNvalid, useEvalid, usePvalid } from '../Customs/useValidation'
import useInput from '../Customs/useInput'
import insta_logo from '../../Img/Insta_logo.png'

const Signup = () => {
    const [fullName, fnonChange, fnmsg, fnerr] = useInput('', useNvalid)
    const [userName, unonChange, unmsg, unerr] = useInput('', useNvalid)
    const [email, eonChange, emsg, eerr] = useInput('', useEvalid)
    const [password, ponChange, pmsg, perr] = useInput('', usePvalid)

    let fnameRef = useRef('')
    let unameRef = useRef('')
    let emailRef = useRef('')
    let passRef = useRef('')
    let SubRef = useRef('')

    const [logfail, setLogfail] = useState(false)
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    useEffect(() => {
        fnameRef.current.focus()
    }, [])

    function fnameKeyDown(e) {
        if (e.key === "Enter") unameRef.current.focus()
    }

    function unameKeyDown(e) {
        if (e.key === "Enter") emailRef.current.focus()
    }

    function emailKeyDown(e) {
        if (e.key === "Enter") passRef.current.focus()
    }

    function passKeyDown(e) {
        if (e.key === "Enter") SubRef.current.focus()
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            if (fnerr === false && unerr === false && eerr === false && perr === false && fullName !== "" && userName !== "" && email !== "" && password !== "") {
                setLoading(true)
                await axios.post("/user/register", { fullName, userName, email, password })
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

            <label htmlFor="name"> Full Name </label>
            <input
                className="input-box"
                ref={fnameRef}
                onKeyDown={fnameKeyDown}
                name="name"
                type="text"
                value={fullName}
                onChange={fnonChange}
            />
            {
                fnerr && <div className="alert"> {fnmsg} </div>
            }

            <label htmlFor="name"> User Name </label>
            <input
                className="input-box"
                ref={unameRef}
                onKeyDown={unameKeyDown}
                name="name"
                type="text"
                value={userName}
                onChange={unonChange}
            />
            {
                unerr && <div className="alert"> {unmsg} </div>
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

            <label htmlFor="password"> Password </label>
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
            >Sign Up</button>

            <h4><Link to="/resetpass">Forget password ?</Link></h4>
            <h4>Already have an account, <Link to="/login">Log In</Link></h4>

        </div>
    ) : (<Loading />)
}

export default Signup