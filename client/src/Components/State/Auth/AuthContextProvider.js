import React, { createContext, useReducer, useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import AuthReducer from './AuthReducer'

export const AuthContext = createContext()

const AuthContextProvider = (props) => {
  const [firstRender, setFirstRender] = useState(true)
  const history = useHistory()
  const inialState = {
    _id: "",
    fullName: "",
    userName: "",
    email: "",
    token: "",
    img: null,
    isPublic: true,
    auth: false,
    loading: true,
    followersCount: 0,
    followingCount: 0,
    totalPosts: 0,
    error: ""
  }

  const [{
    _id, fullName, userName, email, img, isPublic, auth,
    followersCount, followingCount, totalPosts, token
  }, authDispatch] = useReducer(AuthReducer, inialState)

  let headers = {
    Authorization: "Bearer " + token
  }

  const LOGOUT = async (url = '/login') => {
    localStorage.removeItem("insta_token")
    localStorage.removeItem("insta_token_exp")
    authDispatch({ type: "ACTION", payload: inialState })
    history.push(url)
  }

  const logged = async () => {
    try {
      const existed = localStorage.getItem("insta_token")
      const exp = localStorage.getItem("insta_token_exp")
      const valid = 64800000 - (Date.now() - exp)

      if (existed) {
        if (valid > 0) {
          const res = await axios.get("/user/me", {
            headers: {
              Authorization: "Bearer " + existed
            }
          })

          const payload = {
            ...res.data,
            auth: true,
            token: existed,
            loading: false
          }

          authDispatch({ type: "ACTION", payload })
          history.push("/")
          return

        } else {
          LOGOUT()
          return
        }
      } else {
        history.push("/signup")
        return
      }

    } catch (error) {
      LOGOUT()
      console.log(error)
      authDispatch({ type: "ERROR" })
    }
  }

  const oneTimeRender = () => {
    logged()
    setFirstRender(false)
  }

  if (firstRender) {
    oneTimeRender()
  }

  const login = async (formData) => {
    try {
      const res = await axios.post("/user/login", formData)

      const payload = {
        ...res.data,
        email: formData.email,
        auth: true,
        loading: false
      }

      localStorage.setItem("insta_token", res.data.token)
      localStorage.setItem("insta_token_exp", Date.now())
      authDispatch({ type: "ACTION", payload })
      history.push("/")
      return true

    } catch (error) {
      console.log(error)
      authDispatch({ type: "ERROR" })
      return false
    }
  }

  const logout = async () => {
    try {
      await axios.post("/user/logout", {}, { headers })
      LOGOUT()
    } catch (error) {
      console.log(error)
      authDispatch({ type: "ERROR" })
    }
  }

  const deleteAcc = async () => {
    try {
      await axios.delete("/delete", { headers })
      LOGOUT('/signup')
    } catch (error) {
      console.log(error)
      authDispatch({ type: "ERROR" })
    }
  }

  return (
    <AuthContext.Provider value={{
      _id,
      fullName,
      userName,
      email,
      img,
      isPublic,
      followersCount,
      followingCount,
      totalPosts,
      auth,
      headers,
      login,
      authDispatch,
      logout,
      deleteAcc
    }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider