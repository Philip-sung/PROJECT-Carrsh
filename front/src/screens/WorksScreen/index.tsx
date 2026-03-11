//External Imports
import React from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";

//Local Imports
import { Displayer, DisplayerContainer } from "../../components/Displayer";
import { TransitionObject } from "../../components/TransitionObj";
import { screenStoreObj } from "../../store/screenStore";

//Static Imports
import "./index.css";

function WorksScreen(): React.ReactElement {


    return (
        <div className="WorkScreen">
            <TransitionObject>
                <div style={{margin: 10, fontWeight: 700}}>COMPLETED</div>
            </TransitionObject>
            <DisplayerContainer>
                <DisplayerWorkMap />
            </DisplayerContainer>
        </div>
    )
}

const GetCompletedProjects = gql`
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
    const {data} = useQuery(GetCompletedProjects,{
        variables: {
            status: "Completed"
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
                action={(link === "") ? "GetProjectName" : ((location === "local")?"UseFunction" : "ExternalLink")}
                function={
                    async () => {
                        screenStoreObj.GetNewScreen("ProjectDescription",_id)
                    }
                }
                LinkTo={link} />
        ))}
        </>
    )
    }



export { WorksScreen }
