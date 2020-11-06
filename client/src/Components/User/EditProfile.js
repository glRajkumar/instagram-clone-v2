import React, { useContext, useState } from 'react'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import user from '../../Img/user.svg'
import { useHistory } from 'react-router-dom'
import close from '../../Img/close.png'
import '../../CSS/edit.css'

function EditProfile() {
    const { fullName, userName, img, isPublic, authDispatch, deleteAcc } = useContext(AuthContext)
    const [fName, setFull] = useState(fullName)
    const [uName, setUser] = useState(userName)
    const [delModel, setDelModel] = useState(false)
    const history = useHistory()

    return (
        <div className="edit">
            {
                delModel &&
                <div id="del-model">
                    <div id="indel-model">
                        <img
                            onClick={() => setDelModel(false)}
                            className="icons"
                            src={close}
                            alt="close"
                        />
                        <p>
                            Are you sure! Do you want to delete your account
                        </p>
                        <button className="alert" onClick={deleteAcc}>Delete My Account</button>
                    </div>
                </div>
            }

            <div className="edit-profile">
                <img
                    onClick={() => history.push('/updateimg')}
                    src={img ? `upload/${img}` : user}
                    alt="userprofile"
                />

                <p onClick={() => history.push('/updateimg')}>Change profile photo</p>
            </div>

            <label htmlFor="name"> Full Name </label>
            <input
                className="input-box"
                name="name"
                type="text"
                value={fName}
                onChange={e => setFull(e.target.value)}
            />

            <label htmlFor="name"> User Name </label>
            <input
                className="input-box"
                name="name"
                type="text"
                value={uName}
                onChange={e => setUser(e.target.value)}
            />

            <div className="edit-detail">
                Update your account visibility : &nbsp;
                <button onClick={() => { authDispatch({ type: "ACTION", payload: { isPublic: !isPublic } }) }}>
                    {isPublic ? 'Make private my account' : 'Change to public'}
                </button>
            </div>

            <div className="edit-detail">
                Change your old password : &nbsp;
                <button onClick={() => history.push('/updatepass')}>
                    Update Password
                </button>
            </div>

            <div className="edit-detail">
                Forget your password : &nbsp;
                <button onClick={() => history.push('/resetpass')}>
                    Reset Password
                </button>
            </div>

            <div className="edit-detail">
                <button className="alert" onClick={() => setDelModel(true)}>
                    Delete My Account
                </button>
            </div>
        </div>
    )
}

export default EditProfile