
import React, {useState, useEffect} from 'react'
import './App.css';
import Post from './components/Post';
import { db, auth } from './firebase';
import InstagramEmbed from 'react-instagram-embed';

import ImageUpload from './components/ImageUpload';
import LoginModal from './components/Modal';

function App() {

const [posts, setPosts] = useState([]);
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [username, setUsername] = useState('');
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
        <LoginModal
        email={email}
        setEmail ={setEmail}
        password = {password}
        setPassword = {setPassword}
        username = {username}
        setUsername= {setUsername}
        user={user}
        auth={auth}
        />
    </div>
  <div className="app__posts">
  <div className="app__postsLeft">
      {
        posts.map(({id, post}) => (
        <Post key={id} username={post.username} user={user} postId={id} caption={post.caption} imageUrl={post.imageUrl} />
          )
        )
      }
  </div>
  <div className="app__postsRight">
  <InstagramEmbed
  url='https://www.instagram.com/p/B49go7aAcE8wqeXeQm6LGiKxCsgTXyG2nbk7xM0/'
  clientAccessToken='123|456'
  maxWidth={320}
  hideCaption={false}
  containerTagName='div'
  protocol=''
  injectScript
  onLoading={() => {}}
  onSuccess={() => {}}
  onAfterRender={() => {}}
  onFailure={() => {}}
  />
  </div>
  </div>
  
      {
        user?.displayName ? (
       <ImageUpload username={user.displayName}/>
       ): (<h3>Login to Upload</h3>)
     }

    </div>
  );
}

export default App;
