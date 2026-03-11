//External Imports
import React from "react";
import MDEditor from "@uiw/react-md-editor"
import { useQuery, gql, DocumentNode } from '@apollo/client';
import { Link } from "react-router-dom";

//Local Imports
import { userInfoStoreObj } from "../../store/userInfoStore";

//Static Imports
import "./index.css";
import postIcon from "../../assets/img/PostIcon.png";

interface PostReadScreenProps {
    postID?: string;
}

interface PostbyIDProps {
    postID?: string;
}

interface ModifyPostButtonProps {
    postWriter: string | undefined;
    postID?: string;
}

function PostReadScreen(props: PostReadScreenProps): React.ReactElement {
    return (
        <PostbyID postID={props.postID} />
    )
}

function GetPostbyIDQuery(postIdString: string | undefined): DocumentNode {
    const postID: string | undefined = postIdString;

    return(
        gql`
        query GetPostbyID {
            getPostbyID(postID: "${postID}"){
                _id
                postTitle
                postContent
                postDate
                postWriter
                project
            }
        }
    `)
}

function PostbyID(props: PostbyIDProps): React.ReactElement {
    const {loading, error, data} = useQuery(GetPostbyIDQuery(props.postID),{
        fetchPolicy:"network-only"
    });
    if(loading){
    }
    if(error){
        console.log(error.message);
    }

    return(
        <div className="PostReadScreen">
            <div className="PostHeader">
                <div className="PostHeaderTitle">{data?.getPostbyID.postTitle}</div>
            </div>
            <div className="PostData">
                <div className="PostHeaderDate">{data?.getPostbyID.postDate}</div>
                <div className="PostHeaderWriter">{data?.getPostbyID.postWriter}</div>
            </div>
            <div className="PostReaderWindow" data-color-mode="dark">
                <MDEditor.Markdown className="mdReader" source={decodeURI(data?.getPostbyID.postContent)} />
            </div>
            <ModifyPostButton postWriter={data?.getPostbyID.postWriter} postID={props.postID} />
        </div>
    )
}
function ModifyPostButton(props: ModifyPostButtonProps): React.ReactElement {
    const postID: string | undefined = props.postID;

    let redirection: string = 'post';
    let onClickFunction: () => void = function(){};
    if(userInfoStoreObj.curUser.id !== props.postWriter){
        onClickFunction = function(){
            alert('Only Post Writer can modify post.')
        }
        redirection = '/'
    }
    else if(userInfoStoreObj.curUser.id === props.postWriter){
        onClickFunction = function(){
        }
        redirection = 'postModify'
    }
    return(<Link className={(props.postWriter === userInfoStoreObj.curUser.id)?"visible":"invisible"}
        to={redirection}
        state={{ postID : postID }}
        onClick={onClickFunction} >
            <img className="PostButton" alt="PostIcon" src={postIcon} />
        </Link>
    )
}

export { PostReadScreen };
