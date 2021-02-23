import React, { useState } from 'react';
import Modal  from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import { auth } from '../firebase';

import '../modal.css'




function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));  
  
  const LoginModal = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const classes = useStyles();

    const handleSignup = (event) => {
      event.preventDefault();
       if(!username){

          alert("Please enter username to Sign Up");

       } else {
        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
          return authUser.user.updateProfile(
            {
              displayName: username
            }
          )
        })
        .catch(error => alert(error.message))
        setEmail('');
        setPassword('');
        setUsername('');
        setIsOpen(false);

       }
     
      }

    const handleSignIn = (event) => {
      event.preventDefault();

      auth.signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message));
      setOpenSignIn(false);
      setEmail('');
      setPassword('');
      
    }
    const SignUpBody = (
        <div style={getModalStyle()} className={classes.paper}>
            <center>
                <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram icon"
                />
            </center>
            <form className="modal__signup">
            <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}/>

            <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}/>

            <Input
            placeholder="username"
            type="text"
            value={username}
            onChange={(e)=> setUsername(e.target.value)}/>
           
            <Button onClick={handleSignup}>Sign Up</Button>
        
            </form>
        </div>
      );



      const LogInBody = (
        <div style={getModalStyle()} className={classes.paper}>
            <center>
                <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram icon"
                />
            </center>
            <form className="modal__signup">
            <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}/>

            <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}/>
            <Button onClick={handleSignIn}>Log In</Button>
            </form>
        </div>
      );


    return (
        <React.Fragment>
        { user ? (
            <Button onClick={()=> auth.signOut()}>
            Log Out</Button> ) :
           (    <div className="app__logInContainer">
                  <Button onClick={()=> setOpenSignIn(true)}>Sign In</Button>
                  <Button onClick={()=> setIsOpen(true)}>Sign Up</Button>
               </div>
               )  
         }
        <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {SignUpBody}
      </Modal>

      <Modal
      open={openSignIn}
      onClose={() => setOpenSignIn(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {LogInBody}
    </Modal>
      </React.Fragment>
    )
}

export default LoginModal;