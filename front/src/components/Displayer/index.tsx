import React from "react";
import { Link } from "react-router-dom";
import { TransitionObject } from "../TransitionObj";
import "./index.css";

interface DisplayerProps {
  img?: string;
  name?: string;
  imgTxt?: string;
  LinkTo?: string;
  action?: string;
  function?: (param: string) => void;
  parameter?: string;
}

interface DisplayerContainerProps {
  children?: React.ReactNode;
}

function Displayer(props: DisplayerProps): JSX.Element {
  const projectImg = props.img;
  const projectName = props.name || "";
  const onImgText = props.imgTxt;
  const link = props.LinkTo;
  const action = props.action;
  let userFunction: (param: string) => void = () => { alert("Action Not defined"); };
  const parameter = props.parameter;

  if (action === "Link") {
    return (
      <TransitionObject>
        <Link className="Displayer" to={"/" + link}>
          <img className="DisplayerImg" src={`/thumbnail/${projectImg}.png`} alt="DisplayerImg" />
          <div className="onImgText">{onImgText}</div>
          <div className="DisplayDescription">
            {projectName.split("\n").map((text: string, index: number) => (
              <React.Fragment key={index}>{text}<br /></React.Fragment>
            ))}
          </div>
        </Link>
      </TransitionObject>
    );
  } else if (action === "ExternalLink") {
    return (
      <TransitionObject>
        <div className="Displayer" onClick={() => { window.location.href = "https://" + link; }}>
          <img className="DisplayerImg" src={`/thumbnail/${projectImg}.png`} alt="DisplayerImg" />
          <div className="onImgText">{onImgText}</div>
          <div className="DisplayDescription">
            {projectName.split("\n").map((text: string, index: number) => (
              <React.Fragment key={index}>{text}<br /></React.Fragment>
            ))}
          </div>
        </div>
      </TransitionObject>
    );
  } else if (action === "GetProjectName") {
    userFunction = () => { alert(`${projectName} in Processing`); };
  } else if (action === "UseFunction") {
    userFunction = props.function || userFunction;
  }

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = `/thumbnail/Public.png`;
  };

  return (
    <TransitionObject>
      <div className="Displayer" onClick={() => { userFunction(parameter ?? ""); }}>
        <img className="DisplayerImg" src={`/thumbnail/${projectImg}.png`} onError={handleImgError} alt="DisplayerImg" />
        <div className="onImgText">{onImgText}</div>
        <div className="DisplayDescription">
          {projectName.split("\n").map((text: string, index: number) => (
            <React.Fragment key={index}>{text}<br /></React.Fragment>
          ))}
        </div>
      </div>
    </TransitionObject>
  );
}

function DisplayerContainer({ children }: DisplayerContainerProps): JSX.Element {
  return <div className="DisplayerContainer">{children}</div>;
}

export { Displayer, DisplayerContainer };
