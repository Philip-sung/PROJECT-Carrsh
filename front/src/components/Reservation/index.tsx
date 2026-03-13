//External Imports
import React from "react";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";

//Local Imports
import { TimeBar } from "../TimeBar";
import { Displayer, DisplayerContainer } from "../../components/Displayer";
import { timeStoreObj } from "../../store/timeStore";
import { userInfoStoreObj } from "../../store/userInfoStore";
import { screenStoreObj } from "../../store/screenStore";

//Static Imports
import './index.css';

interface CreateScheduleButtonProps {
  project: string;
  description: string;
  member: string;
}

interface DisplayerWorkMapProps {
  function: (param?: string) => void;
}

const Reservation = observer(({ store }: { store: typeof timeStoreObj }) => {

    const [projectName, SetProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [member, setMember] = useState("");

    if(store.isDateSelected === true && store.isEndTimeSelected === true && projectName !== ""){
        return(
            <div>
                <TimeBar />
                <div className="RScreen">
                    <br />
                    <small> SELECTED : {store.selectedStartTime.getFullYear()} . {store.selectedStartTime.getMonth() + 1} . {store.selectedStartTime.getDate()} &nbsp;&nbsp;
                    <strong>&#91; {store.selectedStartTime.getHours()}:00 ~ {store.selectedEndTime.getHours()}:00 &#93;</strong></small>
                    <br />
                    <br />
                    <DisplayerContainer>
                        <DisplayerWorkMap function={SetProjectName} />
                    </DisplayerContainer>
                    <input id="description" className="ReservationInput" type="text" placeholder="Content Brief" value={description} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setDescription(e.target.value)}}  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {if(e.keyCode === 13){document.getElementById("member")?.focus()}}} />
                    <input id="member"className="ReservationInput" type="text" placeholder="Receiving Member(ID)" value={member} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{setMember(e.target.value)}}  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {if(e.keyCode === 13){document.getElementById("submit")?.focus()}}} />
                    <CreateScheduleButton project={projectName} description={description} member={member} />
                </div>
            </div>
        )
    }
    else if(store.isDateSelected === true && store.isEndTimeSelected === true && projectName === ""){
        return(
            <div>
                <TimeBar />
                <div className="RScreen">
                    <br />
                    <small> SELECTED : {store.selectedStartTime.getFullYear()} . {store.selectedStartTime.getMonth() + 1} . {store.selectedStartTime.getDate()} &nbsp;&nbsp;
                    <strong>&#91; {store.selectedStartTime.getHours()}:00 ~ {store.selectedEndTime.getHours()}:00 &#93;</strong></small>
                    <br />
                    <br />
                    <DisplayerContainer>
                        <DisplayerWorkMap function={SetProjectName} />
                    </DisplayerContainer>
                </div>
            </div>
        )
    }
    else if(store.isDateSelected === true && store.isEndTimeSelected === false){

        return(
            <div onClick={() => {SetProjectName("");}}>
                <TimeBar />
            </div>
        )
    }
    else if(store.isDateSelected === false){
        return(<div></div>)
    }

    return null;
});

const createScheduleQuery = gql`
    mutation CreateSchedule($project: String, $createdTime:String, $startTime: String, $endTime: String, $proposer: String, $content: String, $member: [String]){
        createSchedule(
            project: $project,
            createdTime: $createdTime
            startTime: $startTime,
            endTime: $endTime
            proposer: $proposer,
            content: $content,
            member: $member
        ){
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


function SplitMemberString(memberStr: string): string[] {
    const memberArr = memberStr?.split(',');
    for(let i = 0; i < memberArr.length; i++){
        memberArr[i] = memberArr[i].trim();
    }

    return memberArr;
}

const getProjectMemberQuery = gql`
    query GetProjectMember($title: String) {
        getProjectbyTitle(title: $title) {
            member
        }
    }
`

function CreateScheduleButton(props: CreateScheduleButtonProps): JSX.Element {

    const [members, setMembers] = useState<string[]>([]);
    const [memberCheck, setMemberCheck] = useState("");
    const scheduleStart = timeStoreObj.selectedStartTime;
    const scheduleEnd = timeStoreObj.selectedEndTime;

    const startDateString = `${scheduleStart.getFullYear().toString().padStart(2,'0')}.${(scheduleStart.getMonth() + 1).toString().padStart(2,'0')}.${scheduleStart.getDate().toString().padStart(2,'0')}`;
    const startTimeString = `${scheduleStart.getHours().toString().padStart(2,'0')}:${scheduleStart.getMinutes().toString().padStart(2,'0')}`;
    const endDateString = `${scheduleEnd.getFullYear().toString().padStart(2,'0')}.${(scheduleEnd.getMonth() + 1).toString().padStart(2,'0')}.${scheduleEnd.getDate().toString().padStart(2,'0')}`;
    const endTimeString = `${scheduleEnd.getHours().toString().padStart(2,'0')}:${scheduleEnd.getMinutes().toString().padStart(2,'0')}`;

    const [CreateSchedule] = useMutation(createScheduleQuery,{
        variables: {
            project: props.project,
            createdTime: timeStoreObj.GetCurrentTimeString(),
            startTime: `${startDateString} ${startTimeString}`,
            endTime: `${endDateString} ${endTimeString}`,
            proposer: userInfoStoreObj.curUser.id,
            content: props.description,
            member: SplitMemberString(props.member)
        }
    })

    const [checkUsers] = useLazyQuery(getProjectMemberQuery ,{
        variables: {
            title: props.project
        },
        fetchPolicy:'network-only',
        onCompleted: (data: any) => {
            const confirmedUser = data?.getProjectbyTitle?.member;
            let difference = members.filter((member: string) => !confirmedUser?.includes(member));
            if(difference.length > 0){
                let warning = "";
                for(let i = 0; i < difference.length; i++){
                    warning = warning + difference[i];
                    if(i !== difference.length - 1){
                        warning = warning + ", ";
                    }
                }
                warning = warning + ` is not member of ${props.project}`;
                setMemberCheck(warning)
            }
            else if(difference.length === 0){
                setMemberCheck("");
                CreateSchedule();
                alert("Reservation Successfully Submitted")
                timeStoreObj.Initialize();
                screenStoreObj.GetNewScreen("");
            }
        }
    });


    return(
        <div className="ReservationSubmit">
            <div className="Warning">{memberCheck}</div>
            <button id="submit" className="Submit" onClick={() => {
                const newMembers = SplitMemberString(props.member)
                setMembers(newMembers);
                checkUsers();
            }}>Make Appointment</button>
        </div>
    )
}

const GetInProgressProjects = gql`
    query GetProjectsbyStatus($status: String) {
        getProjectsbyStatus(status: $status) {
            _id
            title
            status
            thumbnail
            description
            link
        }
    }
`

function DisplayerWorkMap(props: DisplayerWorkMapProps): JSX.Element | null {
    const {data} = useQuery(GetInProgressProjects,{
        variables: {
            status: "inProgress"
        },
        fetchPolicy: 'network-only'
    })
    return(
        <>
        {data?.getProjectsbyStatus.map(({_id, title, thumbnail, description, link}: any) => (
            <Displayer
                key={_id}
                name={`[${title}]${description}`}
                img={thumbnail}
                action={"UseFunction"}
                function={props.function}
                parameter={`${title}`} />
        ))}
        </>
    )
}

export { Reservation };
