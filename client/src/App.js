import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthContext } from './Components/State/Auth/AuthContextProvider'
import { NotFound, Protected, UnAuthor } from './Components/Common'
import { Signup, Login, NavBar, Profile, UsersProfile, NewPass, ResetPass, NewPassGen, UpdateImg } from './Components/User'
import { CreatePost, AllPosts, FollowingPosts, MyPosts } from './Components/Posts'

const App = () => {
  const { auth } = useContext(AuthContext)
  
  return (
    <>
    <NavBar auth={auth} />

      <Switch>
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/login' component={Login} />

        <Protected exact path='/profile' auth={auth} component={Profile} />
        <Protected exact path='/profile/:userid' auth={auth} component={UsersProfile} />

        <Protected exact path='/' auth={auth} component={AllPosts} />
        <Protected exact path="/myposts" auth={auth} component={MyPosts} />
        <Protected exact path="/createpost" auth={auth} component={CreatePost} />
        <Protected path="/followingposts" auth={auth} component={FollowingPosts} />
        
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