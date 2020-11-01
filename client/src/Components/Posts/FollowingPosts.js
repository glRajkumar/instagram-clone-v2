import React, { useContext } from 'react'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import Suggestions from '../User/Suggestions'
import Posts from './Posts'

function FollowingPosts() {
  const { followingCount, headers } = useContext(AuthContext)

  return (
    <>
      {
        followingCount === 0
          ? <Suggestions headers={headers} isGrid={false} /> :
          <Posts url="followingpost" text="follow someone to view here" />
      }
    </>
  )
}

export default FollowingPosts