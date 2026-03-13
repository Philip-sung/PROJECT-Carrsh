import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import "./index.css";

interface TransitionObjectProps {
  children: React.ReactNode;
}

function TransitionObject({ children }: TransitionObjectProps): JSX.Element {
  const [transitionObjMounted, setTransitionObjMounted] = useState(false);
  useEffect(() => {
    setTransitionObjMounted(true);
  }, []);

  return (
    <CSSTransition in={transitionObjMounted} timeout={500} classNames="TransitionObjMount" unmountOnExit>
      <React.Fragment>{children}</React.Fragment>
    </CSSTransition>
  );
}

export { TransitionObject };
