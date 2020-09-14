import React, { useContext, useState, useRef } from 'react'
import { AuthContext } from '../State/Auth/AuthContextProvider'
import { Link } from 'react-router-dom'
import '../../CSS/nav.css'
import insta_logo from '../../Img/Insta_logo.png'
import search from '../../Img/search.png'
import axios from 'axios'
import close from '../../Img/close.png'
import user from '../../Img/user.png'
import add from '../../Img/add.png'
import followers from '../../Img/followers.png'

const NavBar = ({auth}) =>{
    const searchModal = useRef(null)
    const { _id, logout } = useContext(AuthContext)
    const [ modal, setModal ] = useState(false)
    const [ searchQ, setSearchQ ] = useState('')
    const [ userDetails, setUserDetails ] = useState([])
    
    const fetchUsers = (query)=>{
        setSearchQ(query)
        if(query !== ''){
            axios.post('/user/search-users', {query})
            .then((res)=>{
                setUserDetails(res.data.user)
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    }
    
    const renderList = (auth)=> {
        if(auth){
            return [
             <li key="1">
                <img 
                 src={search} 
                 alt="search-icon" 
                 className="icons"
                 onClick={()=> setModal(true)} 
                />
            </li>,
             <li key="2"><Link to="/profile">Profile</Link></li>,
             <li key="3"><Link to="/myposts">Myposts</Link></li>,
             <li key="4"><Link to="/createpost">Create Post</Link></li>,
             <li key="5"><Link to="/followingposts">My following Posts</Link></li>,
             <li key="6">
                <button onClick={logout}>
                    Logout
                </button>
             </li>
            ]
        }else{
          return [
           <li key="7"><Link to="/login">Login</Link></li>,
           <li key="8"><Link to="/signup">Signup</Link></li>
          ]
        }
    }
 
    const renderListOpen = (auth)=> {
        if(auth){
            return [
            <li key="1">
                <img 
                 src={search} 
                 alt="search-icon" 
                 className="icons"
                 onClick={()=> setModal(true)} 
                />
            </li>,
            <li key="2">
                <Link to="/profile">
                    <img 
                    src={user} 
                    alt="search-icon" 
                    className="icons" 
                    />
                </Link>
            </li>,
            <li key="3">
                <Link to="/createpost">
                    <img 
                    src={add} 
                    alt="search-icon" 
                    className="icons" 
                    />
                </Link>
            </li>,
            <li key="4">
                <Link to="/followingposts">
                    <img 
                    src={followers} 
                    alt="search-icon" 
                    className="icons" 
                    />
                </Link>
            </li>,
            <li key="5">
                <button onClick={logout}>
                    Logout
                </button>
            </li>
            ]
        }else{
          return [
            <li key="6"><Link to="/login">Login</Link></li>,
            <li key="7"><Link to="/signup">Signup</Link></li>
          ]
        }
    }
    
    return(
    <>  
    {
        !modal ?
        <nav>
            <Link to={auth ? '/' : '/signup'} className="logo">
                <img src={insta_logo} alt="instagram logo" />
            </Link>

            <ul className="list">
                { renderList(auth) }
            </ul>

            <ul className="open">
                { renderListOpen(auth) }
            </ul>
        </nav>
        :
        <div id="modal">
            <div id="inMod" className="form-box">
                <div>
                    <p>Search</p>
                    <img src={close} alt="close-icon" className="icons" onClick={()=>setModal(false)} />
                </div>
                <input
                    type="text" 
                    className="input-box" 
                    placeholder="search..."
                    ref={searchModal} 
                    value={searchQ}
                    onChange={(e)=>fetchUsers(e.target.value)}
                />
                <ul>
                {
                    userDetails.map(item=>{
                    return(
                        <div key={item._id}>
                        <Link 
                            to={ item._id !== _id ? `/profile/${item._id}` : '/profile' } 
                            onClick={()=> {setSearchQ(''); setModal(false)}}
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
    }
    </>
)
}

export default NavBar