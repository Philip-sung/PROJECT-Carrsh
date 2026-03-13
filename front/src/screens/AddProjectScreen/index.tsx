//External Imports
import React, { useState } from "react";
import { gql, useLazyQuery, useMutation, DocumentNode } from "@apollo/client";
import { useNavigate } from "react-router-dom";

//Local Imports
import { TransitionObject } from "../../components/TransitionObj";
import { userInfoStoreObj } from "../../store/userInfoStore";

//Static Imports
import "./index.css";

interface SubmitProps {
    title: string;
    description: string;
    member: string;
    reference: string;
}

function AddProjectScreen(): React.ReactElement {

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [member, setMember] = useState<string>("");
    const [reference, setReference] = useState<string>("");

    return(
        <div className="AddProjectScreen">
            <TransitionObject>
                <p style={{color:"#fff", fontSize:50, fontWeight:700, fontFamily:"Consolas", marginBottom: "5vh", marginLeft: "8vw", marginRight: "8vw"}}>New Ideas are always welcome.</p>
                <input id="title" className="AddProjectInput" type="text" placeholder="Project Title" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setTitle(e.target.value)}} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {if(e.keyCode === 13){document.getElementById("description")?.focus()}}} />
                <input id="description" className="AddProjectInput" type="text" placeholder="Brief Description" value={description} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setDescription(e.target.value)}}  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {if(e.keyCode === 13){document.getElementById("member")?.focus()}}} />
                <input id="member"className="AddProjectInput" type="text" placeholder="Member Recommendation(e.g. Kim, Lee, Choi)" value={member} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setMember(e.target.value)}}  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {if(e.keyCode === 13){document.getElementById("reference")?.focus()}}} />
                <input id="reference" className="AddProjectInput" type="text" placeholder="Reference" value={reference} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setReference(e.target.value)}}  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {if(e.keyCode === 13){document.getElementById("submit")?.click()}}} />
                <Submit title={title} description={description} member={member} reference={reference} />
            </TransitionObject>
        </div>
    )
}
const getProjectbyTitleQuery =
    gql`
        query getProjectbyTitle($title: String) {
            getProjectbyTitle(title: $title) {
                title
            }
        }
    `

const getUsers =
    gql`
        query getUsers($userID: [String]) {
            getUsers(userID: $userID) {
                userID
            }
        }
    `
function addProjectQuery(title: string, members: string[], description: string, reference: string): DocumentNode {
    const designer: string = userInfoStoreObj.getUserID();
    const curTime: Date = new Date();
    const curYear: string = curTime.getFullYear().toString();
    const curMonth: string = (curTime.getMonth() + 1).toString().padStart(2,'0');
    const curDate: string = curTime.getDate().toString().padStart(2,'0');
    const Days: string[] = ['Sn','Mn','Tu','Wd','Th','Fr','St'];
    const curDay: string = Days[curTime.getDay()].toString();
    const curHour: string = curTime.getHours().toString().padStart(2,'0');
    const curMinute: string = curTime.getMinutes().toString().padStart(2,'0');
    let memberString: string = "";
    for(let i = 0; i < members.length; i++){
        memberString = memberString + `"${members[i]}"`;
        if(i !== members.length - 1){
            memberString = memberString + ",";
        }
    }
    return(gql`
            mutation CreateProject{
                createProject(
                    title: "${title}",
                    designer: "${designer}",
                    status: "inProgress",
                    funding: 0,
                    started: "${curYear}.${curMonth}.${curDate} ${curDay} ${curHour}:${curMinute}",
                    completed: "",
                    progress: 0,
                    privilege: "Public",
                    link: "",
                    member: [${memberString}],
                    tech: [],
                    thumbnail: "Public",
                    description: "${description}",
                    reference: "${reference}",
                    location: "local"
                ) {
                    title
                    status
                    progress
                    member
                }
            }
        `
    )
}

function SplitMemberString( memberStr: string ): string[] {
    const memberArr: string[] = memberStr?.split(',');
    for(let i = 0; i < memberArr.length; i++){
        memberArr[i] = memberArr[i].trim();
    }

    return memberArr;
}

function Submit( props: SubmitProps ): React.ReactElement {
    const navigate = useNavigate();
    const [members, setMembers] = useState<string[]>([]);
    const [projectName, setProjectName] = useState<string>("");
    const [warningString, setWarningString] = useState<string>("");
    const [checkTitle] = useLazyQuery(getProjectbyTitleQuery, {
        variables: {
            title: projectName
        },
        fetchPolicy:'network-only',
        onCompleted: (data: any) => {
            setWarningString("");
            if(data.getProjectbyTitle !== null || projectName === "Public"){
                setWarningString(`Project "${projectName}" already exists.`)
            }
            else if(data.getProjectbyTitle === null){
                checkUsers();
            }
        }
    })
    const [checkUsers] = useLazyQuery(getUsers ,{
        variables: {
            userID: members
        },
        fetchPolicy:'network-only',
        onCompleted: (data: any) => {
            if(warningString === ""){
                console.log(members);
                const confirmedUser: string[] = [userInfoStoreObj.curUser.id];
                for(let i = 0; i < data?.getUsers.length; i++){
                    confirmedUser.push(data?.getUsers[i].userID)
                }
                let difference: string[] = members.filter((member: string) => !confirmedUser.includes(member));
                if(difference.length > 0){
                    let warning: string = "";
                    for(let i = 0; i < difference.length; i++){
                        warning = warning + difference[i];
                        if(i !== difference.length - 1){
                            warning = warning + ", ";
                        }
                    }
                    warning = warning + " is not member of PhilipSung";
                    setWarningString(warning);
                }
                else if(difference.length === 0){
                    addProject();
                    alert("Project Registered Successfully")
                    navigate('/');
                }
            }
        }
    });

    const [addProject] = useMutation(addProjectQuery(props.title, members, props.description, props.reference))

    return (
        <div className="ProjectProposalSubmit">
            <div className="Warning">{warningString}</div>
            <button id="submit" className="AddProjectButton"
                onClick={() => {
                    if(userInfoStoreObj.loginState === false){
                        alert("Only Member can propose Project")
                    }
                    else if (userInfoStoreObj.loginState === true){
                        let newMembers: string[];
                        if(props.member === ""){
                            newMembers = [userInfoStoreObj.curUser.id];
                        }
                        else{
                            newMembers = SplitMemberString(props.member);
                        }
                        setMembers(newMembers);
                        setProjectName(props.title);
                        checkTitle();
                    }
                }}>SUBMIT</button>
        </div>
    );
}

export { AddProjectScreen };
