import React from "react";

//Local Imports
import { TransitionObject } from "../../components/TransitionObj";
import { NoticeOutline } from "../../components/Notice";
import { ProjectOutline } from "../../components/ProjectOutline";

//Static Imports
import "./index.css";

function MyPageScreen(): React.ReactElement {
    return(
        <TransitionObject>
            <div className="MyPageLayout">
                <div className="MyPageUser">
                    Philip Sung
                </div>
                <div className="MyPageInfo">
                    <div className="MyPageNotice">
                        <NoticeOutline />
                    </div>
                    <div className="MyPageProject">
                        <ProjectOutline />
                    </div>
                </div>
            </div>
        </TransitionObject>
    )
}


export {MyPageScreen};
