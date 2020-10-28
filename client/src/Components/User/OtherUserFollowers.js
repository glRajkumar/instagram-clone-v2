import React from 'react'
import { useParams } from 'react-router-dom'
import Lists from '../Common/Lists'

function OtherUserFollowers({ headers }) {
    const { userId } = useParams()

    return (
        <Lists url={`/other_user/followers/${userId}`} headers={headers} />
    )
}

export default OtherUserFollowers