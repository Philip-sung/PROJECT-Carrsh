//External Imports
import React, { useState, useEffect } from "react"
import MDEditor from "@uiw/react-md-editor"
import { Link, useNavigate } from "react-router-dom";
import { gql, useMutation, useQuery, DocumentNode } from "@apollo/client";

//Local Imports
import { userInfoStoreObj } from "../../store/userInfoStore";

//Static Imports
import "./index.css"
import backIcon from "../../assets/img/BackArrowIcon.png"
import postIcon from "../../assets/img/PostIcon.png"

interface PostButtonProps {
    title: string;
    content: string;
    project: string;
}

interface SelectProjectProps {
    curProject: string;
    setFunction: (value: string) => void;
}

function PostWriteScreen(): React.ReactElement {
    const navigate = useNavigate();
     useEffect(() => {
         if(userInfoStoreObj.getLoginState() === false){
             navigate('/');
             alert('Only Authorized Memebers can write posts.');
         }
     })

    const [mdText, SetMDTest] = useState<string>("");
    const [title, SetTitle] = useState<string>("");
    const [selectedProject, setSelectedProject] = useState<string>("");


    return (
        <div className="PostWriteScreen">
            <div className="Header">
                <div className="ButtonContainer"><Link to={"/"}><img className="Icon" src={backIcon} alt="Back"/></Link></div>
                <input className="Title" type="text" placeholder="(POST TITLE)" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{SetTitle(e.target.value)}}></input>
                <PostButton title={title} content={mdText} project={selectedProject} />
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

function PostQuery(title: string, content: string, project: string): DocumentNode {
    const writer: string = userInfoStoreObj.getUserID();
    const contentString: string = encodeURI(content);
    const curTime: Date = new Date();
    const curYear: string = curTime.getFullYear().toString();
    const curMonth: string = (curTime.getMonth() + 1).toString().padStart(2,'0');
    const curDate: string = curTime.getDate().toString().padStart(2,'0');
    const Days: string[] = ['Sn','Mn','Tu','Wd','Th','Fr','St'];
    const curDay: string = Days[curTime.getDay()].toString();
    const curHour: string = curTime.getHours().toString().padStart(2,'0');
    const curMinute: string = curTime.getMinutes().toString().padStart(2,'0');
    return(gql`
            mutation CreatePost{
                createPost(
                    postTitle: "[${project}] ${title}",
                    postContent: "${contentString}"
                    postDate: "${curYear}.${curMonth}.${curDate} ${curDay} ${curHour}:${curMinute}",
                    postWriter: "${writer}",
                    project: "${project}"
                ) {
                    postTitle
                    postContent
                    postDate
                    postWriter
                    project
                }
            }
        `
    )
}

function PostButton(props: PostButtonProps): React.ReactElement {
    const navigate = useNavigate();
    const [addPost, {loading, error}] = useMutation(PostQuery(props.title, props.content, props.project));

    if(loading){
    }
    if(error){
        console.log(error.message);
    }

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
                    addPost();
                    alert('Posted Successfully');
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

export { PostWriteScreen }
