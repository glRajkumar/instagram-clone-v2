import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthContext } from './Components/State/Auth/AuthContextProvider'
import { NotFound, Protected, UnAuthor } from './Components/Common'
import { Home, Signup, Login, NavBar, Profile, NewPass } from './Components/User'
import CreatePost from './Components/User/CreatePost';
import UserProfile from './Components/User/UserProfile';
import FollowingProfile from './Components/User/FollowingProfile';
import ResetPass from './Components/User/ResetPass';
import NewPassGen from './Components/User/NewPassGen';
import UpdateImg from './Components/User/UpdateImg';

const App = () => {
  const { auth } = useContext(AuthContext)
  
  return (
    <>
    <NavBar auth={auth} />

      <Switch>
        <Protected exact path='/' auth={auth} component={Home} />
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/login' component={Login} />
        <Protected exact path='/profile' auth={auth} component={Profile} />
        <Protected exact path='/profile/:userid' auth={auth} component={UserProfile} />
        <Protected exact path="/createpost" auth={auth} component={CreatePost} />
        <Protected path="/myfollowingpost" auth={auth} component={FollowingProfile} />
        <Protected exact path="/updatepass" auth={auth} component={NewPass} />
        <Protected exact path="/updateimg" auth={auth} component={UpdateImg} />
        <Route exact path="/resetpass" component={ResetPass} />
        <Route path="/token" component={NewPassGen} />
        <Route exact path="/unauth" component={UnAuthor} />
        <Route path="*" component={NotFound} />
      </Switch>
    </>
  );
}

export default App