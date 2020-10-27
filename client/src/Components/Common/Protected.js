import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../State/Auth/AuthContextProvider'

const Protected = ({ component: Component, ...rest }) => {
    const { auth, headers } = useContext(AuthContext)

    return (
        <Route {...rest} render={
            props => {
                if (auth) {
                    return <Component {...rest} {...props} headers={headers} />
                } else {
                    return <Redirect to='/unauth' />
                }
            }
        } />
    )
}

export default Protected