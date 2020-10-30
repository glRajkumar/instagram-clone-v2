import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotFound, Protected, UnAuthor } from './Components/Common'
import {
  Signup, Login, NavBar, Profile, UsersProfile, NewPass,
  ResetPass, NewPassGen, UpdateImg, EditProfile, Followers,
  Following, Requests, Requested, OtherUserFollowers, OtherUserFollowing
} from './Components/User'
import { CreatePost, AllPosts, FollowingPosts, MyPosts, Comments, OtherUserPost } from './Components/Posts'

const App = () => {
  return (
    <>
      <NavBar />

      <Switch>
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/login' component={Login} />

        <Protected exact path='/' component={FollowingPosts} />
        <Protected exact path="/myposts" component={MyPosts} />
        <Protected exact path="/createpost" component={CreatePost} />
        <Protected path="/allposts" component={AllPosts} />
        <Protected path="/othersposts/:userid" component={OtherUserPost} />
        <Protected path="/Comments/:postid" component={Comments} />

        <Protected exact path='/profile' component={Profile} />
        <Protected exact path='/profile/:userid' component={UsersProfile} />
        <Protected exact path='/editprofile' component={EditProfile} />
        <Protected exact path='/followers' component={Followers} />
        <Protected exact path='/following' component={Following} />
        <Protected exact path='/requests' component={Requests} />
        <Protected exact path='/requested' component={Requested} />
        <Protected exact path='/othersfollowers/:userId' component={OtherUserFollowers} />
        <Protected exact path='/othersfollowing/:userId' component={OtherUserFollowing} />

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