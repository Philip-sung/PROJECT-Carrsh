import React from "react";
import "./index.css";
import { screenStoreObj } from "../../store/screenStore";
import { ViewAreaScreenManager } from "../ViewAreaScreenManager";

interface ViewAreaProps {
  className?: string;
}

function ViewArea(props: ViewAreaProps): JSX.Element {
  return (
    <div className={props.className}>
      <ViewAreaScreenManager store={screenStoreObj} />
    </div>
  );
}

export { ViewArea };
