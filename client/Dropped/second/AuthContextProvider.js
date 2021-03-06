import React, { createContext, useReducer, useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import AuthReducer from './AuthReducer'

export const AuthContext = createContext()

const AuthContextProvider = (props) => {
  const [firstRender, setFirstRender] = useState(true)

  const inialState = {
    _id: "",
    fullName: "",
    userName: "",
    email: "",
    img: null,
    followersCount: 0,
    followingCount: 0,
    totalPosts: 0,
    token: "",
    auth: false,
    loading: true,
    error: ""
  }

  const [state, dispatch] = useReducer(AuthReducer, inialState)
  const history = useHistory()

  console.log(state)
  let headers = {
    Authorization: "Bearer " + state.token
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

          let {
            _id,
            fullName,
            userName,
            email,
            img,
            followersCount,
            followingCount,
            totalPosts
          } = res.data

          console.log({ _id, fullName, userName, email, img, followersCount, followingCount, totalPosts })
          let b = { ...res.data }
          console.log(b)

          const payload = {
            _id,
            fullName,
            userName,
            email,
            img,
            followersCount,
            followingCount,
            totalPosts,
            auth: true,
            token: existed
          }

          console.log(payload)
          dispatch({ type: "LOGIN", payload })
          history.push("/")

        } else {
          history.push("/login")
          localStorage.removeItem("insta_token")
          localStorage.removeItem("insta_token_exp")
        }
      } else {
        history.push("/signup")
      }

    } catch (error) {
      console.log(error)
      dispatch({ type: "ERROR" })
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
      const { token, _id, fullName, userName, img, followersCount, followingCount, totalPosts } = await res.data

      console.log({ token, _id, fullName, userName, img, followersCount, followingCount, totalPosts })
      const payload = {
        _id,
        fullName,
        userName,
        email: formData.email,
        img,
        followersCount,
        followingCount,
        totalPosts,
        auth: true,
        token
      }
      console.log('payload')
      console.log(payload)

      localStorage.setItem("insta_token", token)
      localStorage.setItem("insta_token_exp", Date.now())
      dispatch({ type: "LOGIN", payload })
      history.push("/")
    } catch (error) {
      console.log(error)
      dispatch({ type: "ERROR" })
      throw new Error(error)
    }
  }

  const updatePic = async (imgName) => {
    try {
      dispatch({ type: "IMG", payload: { imgName } })
    } catch (error) {
      console.log(error)
      dispatch({ type: "ERROR" })
      throw new Error(error)
    }
  }

  const updateFollow = (follow) => {
    try {
      let payload
      if (follow) {
        payload = {
          followingCount: 1
        }
      } else {
        payload = {
          followingCount: -1
        }
      }

      dispatch({ type: "FOLLOW", payload })
    } catch (error) {
      console.log(error)
      dispatch({ type: "ERROR" })
      throw new Error(error)
    }
  }

  const updateTotalPosts = (post) => {
    try {
      let payload
      if (post) {
        payload = {
          totalPosts: 1
        }
      } else {
        payload = {
          totalPosts: -1
        }
      }

      dispatch({ type: "TOTALPOSTS", payload })
    } catch (error) {
      console.log(error)
      dispatch({ type: "ERROR" })
      throw new Error(error)
    }
  }

  const logout = async () => {
    try {
      await axios.post("/user/logout", {}, { headers })
      localStorage.removeItem("insta_token")
      localStorage.removeItem("insta_token_exp")
      dispatch({ type: "LOGOUT" })
      history.push("/login")
    } catch (error) {
      console.log(error)
      dispatch({ type: "ERROR" })
    }
  }

  const deleteAcc = async () => {
    try {
      await axios.delete("/user", { headers })
      await axios.delete("/post", { headers })
      localStorage.removeItem("insta_token")
      localStorage.removeItem("insta_token_exp")
      dispatch({ type: "LOGOUT" })
      history.push("/signup")
    } catch (error) {
      console.log(error)
      dispatch({ type: "ERROR" })
    }
  }

  return (
    <AuthContext.Provider value={{
      _id: state._id,
      fullName: state.fullName,
      userName: state.userName,
      email: state.email,
      img: state.img,
      followersCount: state.followersCount,
      followingCount: state.followingCount,
      totalPosts: state.totalPosts,
      token: state.token,
      auth: state.auth,
      headers,
      login,
      updatePic,
      updateFollow,
      updateTotalPosts,
      logout,
      deleteAcc
    }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider