//External Imports
import React from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";

//Local Imports
import { Displayer, DisplayerContainer } from "../../components/Displayer";
import { TransitionObject } from "../../components/TransitionObj";

//Static Imports
import "./index.css"

function InProgressScreen(): React.ReactElement {

    return (
        <div className="InProgressScreen">
            <TransitionObject>
                <div style={{margin: 10, fontWeight: 700}}>IN PROGRESS</div>
            </TransitionObject>
            <DisplayerContainer>
                <Displayer name={"PROPOSE NEW PROJECT"} img={"ADD"} action={"Link"} LinkTo={"addProject"} />
                <DisplayerWorkMap />
            </DisplayerContainer>
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
            location
        }
    }
`

function DisplayerWorkMap(): React.ReactElement | null {
    const {data} = useQuery(GetInProgressProjects,{
        variables: {
            status: "inProgress"
        },
        fetchPolicy: 'network-only'
    })
    return(
        <>
        {data?.getProjectsbyStatus.map(({_id, title, thumbnail, description, link, location}: { _id: string; title: string; thumbnail: string; description: string; link: string; location: string }) => (
            <Displayer
                key={_id}
                name={`[${title}]${description}`}
                img={thumbnail}
                action={(link === "") ? "GetProjectName" : ((location === "local")?"Link" : "ExternalLink")}
                LinkTo={link} />
        ))}
        </>
    )
}

export { InProgressScreen }
