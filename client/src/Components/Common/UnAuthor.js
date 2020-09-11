import React from 'react'
import { Link } from 'react-router-dom'

export default () => (
    <div className="modalBox">
        <h3>
            You should login first or if you new to our web, Please signup.
            Please go back to home from here <Link to="/">Home</Link>
        </h3>
    </div>
)