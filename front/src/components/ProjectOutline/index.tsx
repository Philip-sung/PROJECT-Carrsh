//External Imports
import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";

//Local Imports
import { userInfoStoreObj } from "../../store/userInfoStore";
import { TransitionObject } from "../TransitionObj";

//Static Imports
import "./index.css";

interface ProjectMapperProps {
  selected: string;
  setSelected: (val: string) => void;
  setProjectNumber: (num: number) => void;
}

interface ProjectSelectBoxProps {
  project: string;
  selected: string;
  setSelected: (val: string) => void;
}

interface ProjectTabProps {
  tab: string;
  project: string;
}

interface ProjectInfoProps {
  project: string;
}

interface ProjectScheduleProps {
  project: string;
}

interface ScheduleRowProps {
  project?: string;
  createdTime?: string;
  startTime: string;
  endTime: string;
  proposer?: string;
  content?: string;
  member?: string[];
}

function ProjectOutline(): JSX.Element {
    const [selected, setSelected] = useState("");
    const [currentTab, setCurrentTab] = useState("Info");
    const [projectNumber, setProjectNumber] = useState(0);

    return(
        <div className="ProjectContainer">
            <div className="ProjectSelectContainer">
                <div className="ProjectOutlineHeader">My Projects</div>
                <ProjectProvider>
                    <ProjectMapper selected={selected} setSelected={setSelected} setProjectNumber={setProjectNumber} />
                    {(projectNumber <= 0) ? ( <EmptyProject />) : <></>}
                    {(projectNumber <= 1) ? ( <EmptyProject />) : <></>}
                    {(projectNumber <= 2) ? ( <EmptyProject />) : <></>}
                </ProjectProvider>
            </div>
            <div className="ProjectInfoContainer">
                <div className="ProjectInfoTab">
                    <div className={(currentTab === "Info")?"ProjectInfoTabboxSelected" : "ProjectInfoTabbox"} onClick={() => {setCurrentTab("Info")}}>Info</div>
                    <div className={(currentTab === "Schedule")?"ProjectInfoTabboxSelected" : "ProjectInfoTabbox"} onClick={() => {setCurrentTab("Schedule")}}>Schedule</div>
                </div>
                <ProjectTab tab={currentTab} project={selected} />
            </div>
        </div>
    )

}

function EmptyProject(): JSX.Element {
    return(
    <div className={"ProjectSelectBox"} style={{borderStyle:"dashed", opacity:0.7}} >
        <img className="ProjectImg" src={`/thumbnail/AddDark.png`} alt="ProjectImg" />
        Empty Project
    </div>
    )
}

const getUserProjectQuery = gql`
    query GetUserProject($userID: String){
        getUser(userID: $userID){
            userID
            project
        }
    }
`

function ProjectProvider({children}: {children: React.ReactNode}): JSX.Element {
    return(
        <div className="ProjectProvider">
            {children}
        </div>
    )
}

function ProjectMapper(props: ProjectMapperProps): JSX.Element | null {
    const {data} = useQuery(getUserProjectQuery, {
        variables: {
            userID: userInfoStoreObj.curUser.id
        },
        fetchPolicy: 'network-only',
        onCompleted: (data: any) => {
            data?.getUser.project.reverse();
            props.setProjectNumber(data?.getUser?.project?.length);
        }
    })
    return(
        <>
        {data?.getUser.project.map((projectName: string) =>(
            <ProjectSelectBox key={projectName} project={projectName} selected={props.selected} setSelected={props.setSelected} />
        ))}
        </>
    )
}

function ProjectSelectBox(props: ProjectSelectBoxProps): JSX.Element {

    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = `/thumbnail/Public.png`;
    }

    return(
        <div className={(props.selected === props.project)? "SelectedProjectSelectBox" : "ProjectSelectBox" }>
            <img className="ProjectImg" src={`/thumbnail/${props.project}.png`} onClick={() => {props.setSelected(props.project);}} onError={handleImgError} alt="ProjectImg" />
            <div className="ProjectName" onClick={() => {props.setSelected(props.project);}}>{props.project}</div>
        </div>
    )
}

const getProjectbyTitleQuery = gql`
    query GetProjectbyTitle($title: String){
        getProjectbyTitle(title: $title){
            title
            designer
            status
            funding
            started
            completed
            progress
            privilege
            link
            member
            tech
            description
            reference
        }
    }
`

function ProjectTab(props: ProjectTabProps): JSX.Element | null {
    if(props.tab === "Info"){
        return(<ProjectInfo project={props.project} />)
    }
    else if(props.tab === "Schedule"){
        return(
            <div className="ProjectScheduleMapper">
                <ProjectSchedule project={props.project} />
            </div>
        )
    }
    return null;
}

function ProjectInfo(props: ProjectInfoProps): JSX.Element {
    const {data} = useQuery(getProjectbyTitleQuery, {
        variables: {
            title: props.project
        },
        fetchPolicy: 'network-only'
    })
    let memberList = "";
    for(let i = 0; i < data?.getProjectbyTitle?.member.length; i++){
        memberList = memberList + data.getProjectbyTitle.member[i];
        if(i < data.getProjectbyTitle.member.length - 1){
            memberList = memberList + ", ";
        }
    }

    let techList = "";
    for(let i = 0; i < data?.getProjectbyTitle?.tech.length; i++){
        techList = techList + data.getProjectbyTitle.tech[i];
        if(i < data.getProjectbyTitle.tech.length - 1){
            techList = techList + ", ";
        }
    }

    if(data !== null && data !== undefined && data?.getProjectbyTitle?.title !== undefined){
    return(
            <div className="ProjectInfo">
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Title</div><TransitionObject><div className="ProjectInfoContent">{data?.getProjectbyTitle?.title}</div></TransitionObject></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Description</div><TransitionObject><div className="ProjectInfoContent">{data?.getProjectbyTitle?.description}</div></TransitionObject></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Designer</div><TransitionObject><div className="ProjectInfoContent">{data?.getProjectbyTitle?.designer}</div></TransitionObject></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Status</div><TransitionObject><div className="ProjectInfoContent">&lt;{data?.getProjectbyTitle?.status}&gt;</div></TransitionObject></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Funding</div><TransitionObject><div className="ProjectInfoContent">&#8361; {data?.getProjectbyTitle?.funding}</div></TransitionObject></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Started</div><TransitionObject><div className="ProjectInfoContent">{data?.getProjectbyTitle?.started}</div></TransitionObject></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Complete</div><TransitionObject><div className="ProjectInfoContent">{data?.getProjectbyTitle?.completed}</div></TransitionObject></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Progress</div><TransitionObject><div className="ProjectInfoContent">{data?.getProjectbyTitle?.progress} %</div></TransitionObject></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Member</div><TransitionObject><div className="ProjectInfoContent">{memberList}</div></TransitionObject></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Tech</div><TransitionObject><div className="ProjectInfoContent">{techList}</div></TransitionObject></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Reference</div><TransitionObject><div className="ProjectInfoContent">{data?.getProjectbyTitle?.reference}</div></TransitionObject></div>
            </div>
    )}
    else{
        return(
            <div className="ProjectInfo">
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Title</div></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Description</div></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Designer</div></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Status</div></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Funding</div></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Started</div></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Complete</div></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Progress</div></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Member</div></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Tech</div></div>
                <div className="ProjectInfoRow"><div className="ProjectInfoClass">Reference</div></div>
            </div>

        )
    }
}

const getSchedulebyProjectAndMemberQuery = gql`
query GetSchdule($project: String, $member: String){
    getSchedulebyProjectAndMember(project: $project, member: $member){
        _id
        project
        createdTime
        startTime
        endTime
        proposer
        content
        member
    }
  }
`
function ProjectSchedule(props: ProjectScheduleProps): JSX.Element {
    const [scheduleNum, setScheduleNum] = useState(0);
    const {data} = useQuery(getSchedulebyProjectAndMemberQuery, {
        variables : {project: props.project, member: userInfoStoreObj.curUser.id},
        fetchPolicy: 'network-only',
        onCompleted: (data: any) => {
            setScheduleNum(data?.getSchedulebyProjectAndMember?.length);
        }
    })

    return(
        <>
        {(scheduleNum > 0)?
        data?.getSchedulebyProjectAndMember?.map(({_id, project, createdTime, startTime, endTime, proposer, content, member}: any) => (
            <ScheduleRow key={_id} project={project} createdTime={createdTime} startTime={startTime} endTime={endTime} proposer={proposer} content={content} member={member} />
        )) : <TransitionObject><div style={{fontSize:15}}><br/><br/>No Schedule on this Project.</div></TransitionObject>}
        </>
    )
}

function ScheduleRow(props: ScheduleRowProps): JSX.Element {
    return(
        <TransitionObject>
            <div className="ProjectScheduleRow">
                <div style={{fontSize:"115%"}}><strong>{` \u00b7 [${props.startTime.substr(6,10)}-${props.endTime.substr(6,10)}], ${props.proposer} : `}</strong></div>
                <div><div className="ScheduleRowHeader">Content</div>{`    ${props.content}`}</div>
                <div><div className="ScheduleRowHeader">Member</div>{`     ${props.member}`}</div>
                <div><div className="ScheduleRowHeader">Arranged</div>{`   ${props.createdTime}`}</div>
            </div>
        </TransitionObject>
    )

}


export { ProjectOutline }
