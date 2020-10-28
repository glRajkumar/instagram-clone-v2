import React from 'react'
import Lists from '../Common/Lists'

function Following({ headers }) {
    return (
        <Lists url='/user/following' headers={headers} />
    )
}

export default Following