//External Imports
import React, { useState, useEffect } from "react"
import MDEditor from "@uiw/react-md-editor"
import { Link, useNavigate, useLocation } from "react-router-dom";
import { gql, useLazyQuery, useQuery, DocumentNode } from "@apollo/client";

//Local Imports
import { userInfoStoreObj } from "../../store/userInfoStore";

//Static Imports
import "./index.css"
import backIcon from "../../assets/img/BackArrowIcon.png"
import postIcon from "../../assets/img/PostIcon.png"

interface PostButtonProps {
    postID: string;
    title: string;
    content: string;
    project: string;
}

interface SelectProjectProps {
    curProject: string;
    setFunction: (value: string) => void;
}

function GetPostbyIDQuery(postIdString: string): DocumentNode {
    const postID: string = postIdString;

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

function PostModifyScreen(): React.ReactElement {
    const location = useLocation() as { state: { postID: string } };
    const [mdText, SetMDTest] = useState<string>("");
    const [title, SetTitle] = useState<string>("");
    const [selectedProject, setSelectedProject] = useState<string>("");

    useQuery(GetPostbyIDQuery(location.state.postID),
    {
        onCompleted: (data: any) => {
            SetMDTest(decodeURI(data?.getPostbyID.postContent))
            const originalTitle: string = (data?.getPostbyID?.postTitle?.split(']'))[1]?.substring(1) || data?.getPostbyID.postTitle;
            SetTitle(originalTitle)
            setSelectedProject(data?.getPostbyID.project)
        }
    });
    const navigate = useNavigate();
     useEffect(() => {
         if(userInfoStoreObj.getLoginState() === false){
             navigate('/');
             alert('Only Authorized Memebers can write posts.');
         }
     })



    return (
        <div className="PostModifyScreen">
            <div className="Header">
                <div className="ButtonContainer"><Link to={"/"}><img className="Icon" src={backIcon} alt="Back"/></Link></div>
                <input className="Title" type="text" placeholder="(POST TITLE)" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{SetTitle(e.target.value)}}></input>
                <PostButton postID={location.state.postID} title={title} content={encodeURI(mdText)} project={selectedProject} />
            </div>
            <div className="SelectProjectContainer">
                <div key="Public" className={selectedProject === "Public" ? "SelectProjectClicked" : "SelectProject" }
                    onClick={() => {setSelectedProject(`Public`)}}>Public</div>
                <SelectProject curProject={selectedProject} setFunction={setSelectedProject} />
            </div>
            <div className="Board" data-color-mode="dark">
                <MDEditor className="Editor" enableScroll={false} height="100%" value={mdText} onChange={(val?: string) => SetMDTest(val || "")} />
            </div>
        </div>
    )
}



const modifyPostbyIDQuery = gql`
    query ModifyPostbyID($postID : String, $postTitle : String, $postContent : String, $project: String) {
        modifyPostbyID(postID: $postID, postTitle: $postTitle, postContent: $postContent, project : $project){
            _id
            postTitle
        }
    }
`

function PostButton(props: PostButtonProps): React.ReactElement {
    let content: string = props.content;
    let title: string = props.title;
    let project: string = props.project;

    const navigate = useNavigate();
    const [modifyPost] = useLazyQuery(modifyPostbyIDQuery,{
        variables: {
            postID: props.postID,
            postContent: content,
            postTitle: `[${project}] ${title}`,
            project: project
        }
    });

    return (
        <button className="ButtonContainer">
            <img className="Icon" src={postIcon} alt="Post" onClick={() => {
                if(props.title === ''){
                    alert("Please Enter Post Title");
                }
                else if(props.content === ''){
                    alert("Please Enter Post Content");
                }
                else if(props.project === ''){
                    alert("Please Select Related Project");
                }
                else{
                    content = props.content;
                    title = props.title;
                    project = props.project;
                    modifyPost();
                    alert('Modified Successfully');
                    navigate('/');
                }
                }} />
        </button>
        )
}

const GetAllProjectsTitle = gql`
    query GetAllProjectsTitle {
        getAllProjects {
            _id
            title
        }
    }
`

function SelectProject(props: SelectProjectProps): React.ReactElement | null {

    const {data} = useQuery(GetAllProjectsTitle);

    return(
        <>
        {data?.getAllProjects.map(({_id, title}: { _id: string; title: string }) => (
            <div key={_id} className={props.curProject === title ? "SelectProjectClicked" : "SelectProject" }
                onClick={() => {
                    props.setFunction(`${title}`)
                }}>{title}</div>
        ))}
        </>
    )
}

export { PostModifyScreen }
