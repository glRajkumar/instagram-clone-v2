import React from 'react'
import Suggestions from './Suggestions'

function FullSuggestion({ headers }) {
    return (
        <>
            <Suggestions headers={headers} isGrid={true} />
        </>
    )
}

export default FullSuggestion