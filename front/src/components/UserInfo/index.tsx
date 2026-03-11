import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { userInfoStoreObj, UserInfoStore } from "../../store/userInfoStore";
import { screenStoreObj } from "../../store/screenStore";
import "./index.css";
import Info from "../../ServiceInformation";
import mypageIcon from "../../assets/img/MyPage.png";
import { noticeStoreObj } from "../../store/noticeStore";

interface UserInfoViewProps {
  store: UserInfoStore;
}

const UserInfoView = observer(({ store }: UserInfoViewProps) => {
  const [userName, setUserName] = useState("NONAME");
  const [userPrivilege, setUserPrivilege] = useState("GUEST");
  const navigate = useNavigate();

  // eslint-disable-next-line
  useEffect(() => { setUserName(store.getUserName()); }, [store.curUser.name]);
  // eslint-disable-next-line
  useEffect(() => { setUserPrivilege(store.getPrivilege()); }, [store.curUser.privilege]);

  return (
    <div className="UIContainer">
      {store.loginState === true ? (
        <>
          <button className="LoginButton" onClick={() => { LogOut(); navigate("/"); }}>LogOut</button>
          <button className="MyPageButton" onClick={() => { screenStoreObj.GetNewScreen("MyPage"); }}>
            <img className="MyPageIcon" src={mypageIcon} alt={"MyPageIcon"} />
            <NoticeAlarm store={noticeStoreObj} />
          </button>
        </>
      ) : (
        <Link className="LoginButton" to="login">Log In</Link>
      )}
      <div><small style={{ fontSize: 10 }}><strong>{userName}</strong></small></div>
      <div><small style={{ fontSize: 10 }}>{userPrivilege}</small></div>
    </div>
  );
});

function LogOut(): void {
  window.fetch(Info.logoutURI, { credentials: "include" });
  userInfoStoreObj.setStateLogout();
  userInfoStoreObj.setUserName("NONAME");
  userInfoStoreObj.setPrivilege("GUEST");
  screenStoreObj.GetNewScreen("");
  window.location.reload();
}

const getUserNoticeQuery = gql`
  query GetUserNotice($userID: String) {
    getUserNotice(userID: $userID) {
      _id
      title
      from
      to
      content
      time
    }
  }
`;

const NoticeAlarm = observer(({ store }: { store: any }) => {
  const [noticeNum, setNoticeNum] = useState(0);

  const { data } = useQuery(getUserNoticeQuery, {
    variables: { userID: userInfoStoreObj.curUser.id },
    onCompleted: (data: any) => {
      store.setNoticeNumber(data?.getUserNotice?.length);
      setNoticeNum(store.noticeNumber);
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => { setNoticeNum(store.noticeNumber); }, [store.noticeNumber]);

  return (
    <div
      className={noticeNum === 0 ? "NoticeAlarmOff" : "NoticeAlarm"}
      onClick={() => { console.log(data?.getUserNotice?.length); }}
    >
      {noticeNum}
    </div>
  );
});

export { UserInfoView };
