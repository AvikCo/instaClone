
import React, {useState, useEffect} from 'react'
import './App.css';
import Post from './components/Post';
import { db, auth } from './firebase';
import Avatar from '@material-ui/core/Avatar'
import InstagramEmbed from 'react-instagram-embed';

import ImageUpload from './components/ImageUpload';
import LoginModal from './components/Modal';

function App() {

const [posts, setPosts] = useState([]);
const [user, setUser] = useState(null);


useEffect(()=>{
  db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => 
    setPosts(snapshot.docs.map(doc => (
      {id: doc.id,
      post: doc.data()})))
    )
},
[]);

useEffect(()=> {
  const unsubscribe = auth.onAuthStateChanged((authUser) => {
    if(authUser){
      //user has logged in successfully
      //console.log(authUser);
      setUser(authUser)
    } else{
      //user has logged out
      setUser(null);
    }
  })
  return ()=> {
    unsubscribe();
  }
},[])

  return (
    <div className="app">
    <div className="app__header">
      <img
        className="app__headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt="instagram icon"
        />
        <Avatar className="app__avatar"
          className="post__avatar"
          src={user?.photoURL}
          alt={user?.displayName}
          key={user?.photoURL}
          />
        
        <LoginModal
        user={user}
        />
       
    </div>
  <div className="app__posts">
  <div className="app__postsLeft">
      {
        posts.map(({id, post}) => (
        <Post key={id} username={post.username} user={user} postId={id} 
        date={post.timestamp} caption={post.caption} imageUrl={post.imageUrl}
        prflPhotoUrl={post.prflPhotoUrl}
         />
          )
        )
      }
  </div>
  <div className="app__postsRight">
  </div>
  </div>
      {user ?
        (<ImageUpload username={user.displayName} prflPhotoUrl={user.photoURL}/>) :
        (<h3 className="app__imageMessage">Log in to Upload</h3>)
      }
      {
        user? console.log(user):null
      }
    </div>
  );
}
export default App;
