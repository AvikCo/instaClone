import React, {useState, useEffect} from 'react'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import TurnedInNotRoundedIcon from '@material-ui/icons/TurnedInNotRounded';
import TurnedInRoundedIcon from '@material-ui/icons/TurnedInRounded';
import '../Post.css';
import firebase from 'firebase'

import { db } from '../firebase'
import { Button } from '@material-ui/core';

function Post({postId, username, user, caption, imageUrl}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [like, setLike] = useState(false);
    const [bookmark, setBookmark] = useState(false);

useEffect(()=> {
    let unsubscribe;
    if(postId) {
        unsubscribe =db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot( snapshot => {
            setComments(snapshot.docs.map(doc => doc.data()))
        })
    }
    return ()=>{
        unsubscribe()
    }
},[postId])
const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add(
        {
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp() 
         
        }
    )
setComment('');
}
    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                alt={username}
                className="post__avatar"
                src="static/images/avatar/1.jpg"
                />
                <h4>{username}</h4>
            </div>
            <img className="post__image" src={imageUrl}/>
            <div className="post__likeSection">
            <IconButton className="post_actions" color="primary" aria-label="upload picture" onClick={()=> setLike(!like)} component="span">
                    {like ? <FavoriteIcon style={{fill:"red", fontSize: "30px"}}/>
                    :  <FavoriteBorderIcon  style={{fill: "black", fontSize: "30px"}} />
                    }
                </IconButton>
               <IconButton className="post_actions" color="primary" aria-label="upload picture"  component="span">
                    <ShareIcon style={{fill: "black"}}/>
                </IconButton>
                
                <IconButton className="post_actions_bookmark" color="primary" aria-label="upload picture" onClick={()=> setBookmark(!bookmark)} component="span">
                   {bookmark ? <TurnedInRoundedIcon className ="post_bookmarkButton" style={{fill: "black", fontSize: "30px" }}/>
                    : <TurnedInNotRoundedIcon className ="post_bookmarkButton" style={{fill: "black", fontSize: "30px" }}/>
                   }
                </IconButton>
            </div>
            <h4 className="post__likes">23 Likes</h4>
            <h4 className="post__text"><strong>{username}</strong>: {caption}</h4>

            <div className="posts__comments">
                {
                    comments.map(comment => (
                        <p>
                        <strong>{comment.username}: </strong>{comment.text}
                        </p>
                    ))
                }
            </div>
                {user && (
                    <form className="post__commentBox">
                    <input
                    className="post__input"
                    type="text"
                    placeholder="Add a comment..."
                    value = {comment}
                    onChange={e => setComment(e.target.value)}
                    />
                    <button
                    className="post__button"
                    disabled={!comment}
                    type="submit"
                    onClick={postComment}
                    >Post</button>
                </form>

                )}
           
        </div>
    )
}

export default Post
