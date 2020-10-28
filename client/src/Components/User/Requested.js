import React from 'react'
import Lists from '../Common/Lists'

function Requested({ headers }) {
    return (
        <Lists url='/user/requested' headers={headers} />
    )
}

export default Requested