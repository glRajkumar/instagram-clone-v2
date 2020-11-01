import React, { useContext, useState } from 'react'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import { Link } from 'react-router-dom'
import '../../CSS/nav.css'
import insta_logo from '../../Img/Insta_logo.png'
import search from '../../Img/search.png'
import axios from 'axios'
import close from '../../Img/close.png'
import user from '../../Img/user.svg'
import add from '../../Img/add.png'
import home from '../../Img/home.png'
import explore from '../../Img/explore.png'

const NavBar = () => {
    const { _id, auth, img, logout } = useContext(AuthContext)
    const [modal, setModal] = useState(false)
    const [searchQ, setSearchQ] = useState('')
    const [userDetails, setUserDetails] = useState([])
    const [open, setOpen] = useState(false)

    const fetchUsers = (query) => {
        setSearchQ(query)
        if (query !== '') {
            axios.post('/user/search-users', { query })
                .then((res) => {
                    setUserDetails(res.data.user)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    const LogOut = () => {
        logout()
        setOpen(prev => !prev)
    }

    const MiniProfile = () => (
        <div className="miniProfile">
            <ul>
                <li>
                    <Link to="/profile" onClick={() => setOpen(prev => !prev)}>
                        Profile
                    </Link>
                </li>
                <li>
                    <Link to="/myposts" onClick={() => setOpen(prev => !prev)}>
                        My posts
                    </Link>
                </li>
                <li>
                    <Link to="/followers" onClick={() => setOpen(prev => !prev)}>
                        Followers
                    </Link>
                </li>
                <li>
                    <Link to="/following" onClick={() => setOpen(prev => !prev)}>
                        Following
                    </Link>
                </li>
                <li>
                    <Link to="/requests" onClick={() => setOpen(prev => !prev)}>
                        Requests
                    </Link>
                </li>
                <li>
                    <Link to="/requested" onClick={() => setOpen(prev => !prev)}>
                        Requested
                    </Link>
                </li>
                <li>
                    <Link to="/hearted" onClick={() => setOpen(prev => !prev)}>
                        Hearted
                    </Link>
                </li>
                <li>
                    <Link to="/suggest" onClick={() => setOpen(prev => !prev)}>
                        Suggestions
                    </Link>
                </li>
                <li>
                    <button onClick={LogOut} >
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    )

    const Nav = () => (
        <nav>
            <Link to={auth ? '/' : '/signup'} className="logo">
                <img src={insta_logo} alt="instagram logo" />
            </Link>

            <ul className="list">
                {auth ?
                    (
                        <>
                            <li>
                                <img
                                    src={search}
                                    alt="icon"
                                    className="nav-icons"
                                    onClick={() => setModal(true)}
                                />
                            </li>
                            <li>
                                <Link to="/">
                                    <img
                                        src={home}
                                        alt="icon"
                                        className="nav-icons"
                                    />
                                </Link>
                            </li>
                            <li>
                                <Link to="/allposts">
                                    <img
                                        src={explore}
                                        alt="icon"
                                        className="nav-icons"
                                    />
                                </Link>
                            </li>
                            <li>
                                <Link to="/createpost">
                                    <img
                                        src={add}
                                        alt="icon"
                                        className="nav-icons"
                                    />
                                </Link>
                            </li>
                            <li style={{ position: 'relative' }}>
                                <img
                                    src={img ? `/upload/${img}` : user}
                                    id="profile"
                                    alt="icon"
                                    className="nav-icons"
                                    onClick={() => setOpen(prev => !prev)}
                                />
                                {
                                    open && <MiniProfile />
                                }
                            </li>
                        </>
                    )
                    :
                    (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/signup">Signup</Link></li>
                        </>
                    )
                }
            </ul>
        </nav>
    )

    const SearchModel = () => (
        <div id="modal">
            <div id="inMod" className="form-box">
                <div>
                    <p>Search</p>
                    <img src={close} alt="close-icon" className="icons" onClick={() => setModal(false)} />
                </div>
                <input
                    type="text"
                    className="input-box"
                    placeholder="search..."
                    value={searchQ}
                    onChange={(e) => fetchUsers(e.target.value)}
                />
                <ul>
                    {
                        userDetails.map(item => {
                            return (
                                <div key={item._id}>
                                    <Link
                                        to={item._id !== _id ? `/profile/${item._id}` : '/profile'}
                                        onClick={() => { setSearchQ(''); setModal(false) }}
                                    >
                                        <li>{item.email}</li>
                                    </Link>
                                </div>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )

    return (
        <div id="nav-bar">
            {
                modal && <SearchModel />
            }
            <Nav />
        </div>
    )
}

export default NavBar