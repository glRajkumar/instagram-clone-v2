import React, { useContext, useState } from 'react'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import user from '../../Img/user.svg'
import { useHistory } from 'react-router-dom'
import close from '../../Img/close.png'
import '../../CSS/edit.css'

function EditProfile() {
    const { fullName, userName, img, isPublic, updatePublic, deleteAcc } = useContext(AuthContext)
    const [fName, setFull] = useState(fullName)
    const [uName, setUser] = useState(userName)
    const [delModel, setDelModel] = useState(false)
    const history = useHistory()

    return (
        <div className="edit">
            {
                delModel &&
                <div>
                    <img
                        onClick={() => setDelModel(false)}
                        className="icons"
                        src={close}
                        alt="close"
                    />
                    <p>Are you sure! Do you want to delete your account</p>
                    <button className="alert" onClick={deleteAcc}>Delete My Account</button>
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

            <button onClick={updatePublic}>
                {isPublic ? 'Make private my account' : 'Change to public'}
            </button>

            <button onClick={() => history.push('/followers')}>
                Followers List
            </button>

            <button onClick={() => history.push('/following')}>
                Following List
            </button>

            <button onClick={() => history.push('/requests')}>
                Requests List
            </button>

            <button onClick={() => history.push('/requested')}>
                Requested List
            </button>

            <button onClick={() => history.push('/updatepass')}>
                Update Password
            </button>

            <button onClick={() => history.push('/resetpass')}>
                Reset Password
            </button>

            <button className="alert" onClick={() => setDelModel(true)}>
                Delete My Account
            </button>
        </div>
    )
}

export default EditProfile