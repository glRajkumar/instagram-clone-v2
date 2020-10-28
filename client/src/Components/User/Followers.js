import React from 'react'
import Lists from '../Common/Lists'

function Followers({ headers }) {
    return (
        <Lists url='/user/followers' headers={headers} />
    )
}

export default Followers