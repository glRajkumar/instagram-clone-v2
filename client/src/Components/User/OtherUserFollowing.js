import React from 'react'
import { useParams } from 'react-router-dom'
import Lists from '../Common/Lists'

function OtherUserFollowing({ headers }) {
    const { userId } = useParams()

    return (
        <Lists url={`/other_user/following/${userId}`} headers={headers} />
    )
}

export default OtherUserFollowing