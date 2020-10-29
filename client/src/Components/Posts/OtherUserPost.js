import React from 'react'
import { useParams } from 'react-router-dom'
import Posts from './Posts'

function OtherUserPost() {
    const { userid } = useParams()

    return (
        <Posts url={`otherspost/${userid}`} text="not yet posted anything" />
    )
}

export default OtherUserPost