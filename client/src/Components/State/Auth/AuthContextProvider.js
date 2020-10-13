import React, { createContext, useReducer, useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import AuthReducer from './AuthReducer'

export const AuthContext = createContext()

const AuthContextProvider = (props) =>{
  const [ firstRender, setFirstRender ] = useState(true)

  const inialState = {
    _id : "",
    name : "",
    email : "",
    img : null,
    token : "",
    auth : false,
    followers: [],
    following: [],
    loading : true,
    error : ""
  }

  const [state, dispatch] = useReducer(AuthReducer, inialState)
  const history = useHistory()

  let headers = {
    Authorization: "Bearer " + state.token
  }

  const logged = async () => {
    try {
      const existed = localStorage.getItem("insta_token")
      const exp = localStorage.getItem("insta_token_exp")
      const valid = 64800000 - (Date.now() - exp)

      if(existed){
        if (valid > 0) {
          const res = await axios.get("/user/me",{ 
            headers : { 
              Authorization: "Bearer " + existed 
            }
          })
  
          let { _id, name, email, img, followers, following } = res.data.user
  
          const payload = {
            _id,
            name ,
            email ,
            img , 
            followers, 
            following,
            auth : true,
            token : existed
          }
  
          dispatch({ type : "LOGIN", payload })
          history.push("/")

        }else{
          history.push("/login")
          localStorage.removeItem("insta_token")
          localStorage.removeItem("insta_token_exp")
        }
      }else{
        history.push("/signup")
      }

    } catch (error) {
      console.log(error)
      dispatch({ type : "ERROR" })
    }
  }
   
  const oneTimeRender = () =>{
    logged()
    setFirstRender(false)
  }

  if (firstRender) {
    oneTimeRender()
  }
  
  const login = async (formData) => {
    try {
      const res = await axios.post("/user/login", formData)
      const {token, user} = await res.data

      const payload = {
        _id: user._id,
        name : user.name ,
        email : user.email ,
        img : user.img ,
        followers : user.followers, 
        following : user.following,
        auth : true,
        token 
      }

      localStorage.setItem("insta_token", token)
      localStorage.setItem("insta_token_exp", Date.now())
      dispatch({ type : "LOGIN", payload })
      history.push("/")                    
    } catch (error) {
      console.log(error)
      dispatch({ type : "ERROR" })
      throw new Error(error)
    }
  }

  const updatePic = async (imgName) => {
    try {
      dispatch({ type : "IMG", payload : {imgName} })
    } catch (error) {
      console.log(error)
      dispatch({ type : "ERROR" })
      throw new Error(error)
    }
  }

  const updateFollow = (follow, id) => {
    try {
      let payload
      if (follow) {
        let newList = [...state.following, id]
        payload = {
          following : newList
        }  
      }else{
        let newList = state.following.filter(item => item !== id )
        payload = {
          following : newList
        }
      }

      dispatch({ type : "FOLLOW", payload })
    } catch (error) {
      console.log(error)
      dispatch({ type : "ERROR" })
      throw new Error(error)
    }
  }

  const logout = async () =>{
    try {
      await axios.post("/user/logout",{},{headers})
      localStorage.removeItem("insta_token")
      localStorage.removeItem("insta_token_exp")
      dispatch({ type : "LOGOUT" })
      history.push("/login")
    } catch (error) {
      console.log(error)
      dispatch({ type : "ERROR" })
    }
  }

  const deleteAcc = async () =>{
    try {
      await axios.delete("/user", {headers})
      localStorage.removeItem("insta_token")
      localStorage.removeItem("insta_token_exp")
      dispatch({ type : "LOGOUT" })
      history.push("/signup")
    } catch (error) {
      console.log(error)
      dispatch({ type : "ERROR" })
    }
  }

  return(
      <AuthContext.Provider value={{
        _id : state._id,
        name : state.name, 
        email : state.email, 
        img : state.img, 
        token : state.token,
        auth : state.auth, 
        headers, 
        followers : state.followers, 
        following : state.following,
        login,
        updatePic, 
        updateFollow,
        logout,
        deleteAcc
      }}>
          {props.children}
      </AuthContext.Provider>
  );
}

export default AuthContextProvider