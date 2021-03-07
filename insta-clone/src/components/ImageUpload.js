import { Button } from '@material-ui/core';
import React,{ useState, useEffect } from 'react'
import firebase from 'firebase';
import {db, storage, auth} from '../firebase';

import '../imageUpload.css';

function ImageUpload({username, prflPhotoUrl}) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [inputFile, setInputFile] = useState(2);
    const [user, setUser] = useState(null);
    const handleChange = (event) => {
        if(event.target.files[0]){
            setImage(event.target.files[0]);
        }
    };
    
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
          

    const handleUpload = (event) => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) =>{
                //writing the progress function
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100 );
                setProgress(progress);
            },
            (error) => {
                //logging the error in case
                console.log(error);
                alert(error.message);
            },
            ()=>{
                //when upload complete
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    //post image inside 
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        username: user.displayName,
                        imageUrl: url,
                        prflPhotoUrl: user.photoURL
                    })
                })
                .catch(error => console.log(error.message))
                setProgress(0);
                setCaption('');
                setImage(null);
            }
        )
        setInputFile(Math.random()) //it clears the  type file input field after uploading a picture
    }

    return (
            <div  className="imageUpload">
            <h4>{username}</h4>
                <progress className="imageUpload__progress" value={progress} max="100"/>
                <input type = "text" placeholder="Enter a caption..." value={caption} 
                onChange={(e)=>setCaption(e.target.value)}/>
                <input type="file" accept= 'image/*' onChange={handleChange} key={inputFile || ''}/>
                <Button onClick={handleUpload}>Upload</Button>
            </div>
    )
}

export default ImageUpload
