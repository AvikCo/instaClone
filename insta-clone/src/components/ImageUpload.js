import { Button } from '@material-ui/core';
import React,{ useState } from 'react'
import firebase from 'firebase';
import {db, storage} from '../firebase';

import '../imageUpload.css';

function ImageUpload({username}) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [inputFile, setInputFile] = useState(2);
    
    const handleChange = (event) => {
        if(event.target.files[0]){
            setImage(event.target.files[0]);
        }
    };
    console.log(username);
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
                    console.log(url)
                    //post image inside 
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        username:username,
                        imageUrl: url
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
            <div className="imageUpload">
                <progress className="imageUpload__progress" value={progress} max="100"/>
                <input type = "text" placeholder="Enter a caption..." value={caption} 
                onChange={(e)=>setCaption(e.target.value)}/>
                <input type="file" accept= 'image/*' onChange={handleChange} key={inputFile || ''}/>
                <Button onClick={handleUpload}>Upload</Button>
            </div>
    )
}

export default ImageUpload
