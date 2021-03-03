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

function Post({postId, date, username, user, caption, imageUrl, prflPhotoUrl}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [like, setLike] = useState(false);
    const [bookmark, setBookmark] = useState(false);
    const [allLikes, setAllLikes] = useState([]);

useEffect(()=> {
    let unsubscribe;
    if(postId) {
        unsubscribe =db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'asc')
        .onSnapshot( snapshot => {
            setComments(snapshot.docs.map(doc => ({
                id: doc.id,
                data:doc.data()})))
        })
    }
    return ()=> unsubscribe()
},[postId])

useEffect(()=> {
    if(user){
const exists = allLikes.filter(like=> like.data.username === user.displayName)

if(exists.length !== 0)
    setLike(true);
else 
    setLike(false);
    
    }
    else
        setLike(false);
},[user,allLikes])

useEffect(()=> {
    let unsubscribe;
     unsubscribe = db.collection("posts").doc(postId).collection("likes").onSnapshot(snapShot => setAllLikes(
         snapShot.docs.map(doc => (
             {
             id: doc.id,
             data: doc.data()
             }
         )))
     )
        return ()=> unsubscribe();
        
        },[])


        
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

const postLike = (event) => {
    if(user){
    event.preventDefault();
    if(like){
        db.collection("posts").doc(postId).collection("likes").where("username",'==',user.displayName).get()
        .then((querySnapshot) =>{
            querySnapshot.forEach(doc=> doc.ref.delete())
        })
    }else{
        db.collection("posts").doc(postId).collection("likes").add(
            {
               username: user.displayName,
               timestamp : firebase.firestore.FieldValue.serverTimestamp()
            }
        )
    }
    setLike(!like)
}
else{
    alert("Please login to like or comment")
    
}
}

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                className="post__avatar"
                src={prflPhotoUrl}
                ></Avatar>
                <h4>{username}</h4>
            </div>
            <img className="post__image" src={imageUrl}/>
            <div className="post__likeSection">
                 <IconButton className="post_actions" color="primary" aria-label="upload picture" onClick={postLike} component="span">
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
            <h4 className="post__likes">{allLikes.length > 0 ? allLikes.length > 1 ? 
            (`Liked by ${allLikes[1].data.username} and ${allLikes.length-1} others`)
            :`${allLikes.length} like`: null}</h4>
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
            <h2 className="post__date">{date?.toDate().toDateString()}</h2>

            <div className="posts__comments">
                {
                    comments.map(({id,data}) => (
                        <p key={id}>
                        <strong>{data.username} </strong>{data.text}
                        </p>
                    ))
                }
            </div>
            <div className="posts__lastCommentDate">
            {comments.length > 0 ? (<p>{comments[comments.length - 1].data.timestamp?.toDate().toDateString()}</p>): null}
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
