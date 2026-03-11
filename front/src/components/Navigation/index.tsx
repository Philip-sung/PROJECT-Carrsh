import React from "react";
import { UserInfoView } from "../UserInfo/index";
import { userInfoStoreObj } from "../../store/userInfoStore";
import { screenStoreObj } from "../../store/screenStore";
import "./index.css";
import searchIcon from "../../assets/img/SearchIcon.png";
import reservationIcon from "../../assets/img/ReservationIcon.png";
import inProgressIcon from "../../assets/img/InProgressIcon.png";
import worksIcon from "../../assets/img/WorksIcon.png";
import backIcon from "../../assets/img/BackArrowIcon.png";

interface NavigationBarProps {
  className?: string;
}

function NavigationBar(props: NavigationBarProps): JSX.Element {
  return (
    <div className={props.className}>
      <UserInfoView store={userInfoStoreObj} />
      <button className="NavigationButton" onClick={() => { screenStoreObj.GetNewScreen("Search"); }}><img src={searchIcon} width="40px" alt="SearchIcon" /></button>
      <button className="NavigationButton" onClick={() => { screenStoreObj.GetNewScreen("Reservation"); }}><img src={reservationIcon} width="40px" alt="ReservationIcon" /></button>
      <button className="NavigationButton" onClick={() => { screenStoreObj.GetNewScreen("InProgress"); }}><img src={inProgressIcon} width="40px" alt="inProgressIcon" /></button>
      <button className="NavigationButton" onClick={() => { screenStoreObj.GetNewScreen("Works"); }}><img src={worksIcon} width="40px" alt="WorksIcon" /></button>
      <button className="NavigationButton" onClick={() => { screenStoreObj.GetPrevScreen(); }}><img src={backIcon} width="40px" alt="backIcon" /></button>
    </div>
  );
}

export { NavigationBar };
