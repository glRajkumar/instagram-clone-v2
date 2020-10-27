import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { NotFound, Protected, UnAuthor } from './Components/Common'
import { Signup, Login, NavBar, Profile, UsersProfile, NewPass, ResetPass, NewPassGen, UpdateImg, EditProfile } from './Components/User'
import { CreatePost, AllPosts, FollowingPosts, MyPosts, Comments } from './Components/Posts'
import Followers from './Components/User/Followers';
import Following from './Components/User/Following';
import OtherUserFollowers from './Components/User/OtherUserFollowers';
import OtherUserFollowing from './Components/User/OtherUserFollowing';
import Requests from './Components/User/Requests';
import Requested from './Components/User/Requested';

const App = () => {
  return (
    <>
      <NavBar />

      <Link to="/followers">F1</Link>
      <Link to="/following">F2</Link>

      <Switch>
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/login' component={Login} />

        <Protected exact path='/followers' component={Followers} />
        <Protected exact path='/following' component={Following} />
        <Protected exact path='/requests' component={Requests} />
        <Protected exact path='/requested' component={Requested} />
        <Protected exact path='/othersfollowers/:userId' component={OtherUserFollowers} />
        <Protected exact path='/othersfollowing/:userId' component={OtherUserFollowing} />


        <Protected exact path='/profile' component={Profile} />
        <Protected exact path='/profile/:userid' component={UsersProfile} />
        <Protected exact path='/editprofile' component={EditProfile} />

        <Protected exact path='/' component={FollowingPosts} />
        <Protected exact path="/myposts" component={MyPosts} />
        <Protected exact path="/createpost" component={CreatePost} />
        <Protected path="/allposts" component={AllPosts} />
        <Protected path="/Comments/:postid" component={Comments} />

        <Protected exact path="/updatepass" component={NewPass} />
        <Protected exact path="/updateimg" component={UpdateImg} />
        <Route exact path="/resetpass" component={ResetPass} />
        <Route path="/token" component={NewPassGen} />

        <Route exact path="/unauth" component={UnAuthor} />
        <Route path="*" component={NotFound} />
      </Switch>
    </>
  );
}

export default App