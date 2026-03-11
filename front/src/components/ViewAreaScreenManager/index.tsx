import { observer } from "mobx-react-lite";
import { SearchScreen } from "../../screens/SearchScreen/index";
import { ReservationScreen } from "../../screens/ReservationScreen/index";
import { InProgressScreen } from "../../screens/InProgressScreen/index";
import { WorksScreen } from "../../screens/WorksScreen/index";
import { PostReadScreen } from "../../screens/PostReadScreen";
import { MyPageScreen } from "../../screens/MyPageScreen";
import { ProjectDescriptionScreen } from "../../screens/ProjectDescriptScreen";
import { Clock } from "../Clock";
import { MessengerBar } from "../NoticeMessenger";
import GithubIcon from "../../assets/img/GithubW.png";
import BlogIcon from "../../assets/img/BlogW.png";
import VelogIcon from "../../assets/img/VelogW.png";
import type { ScreenStore } from "../../store/screenStore";

interface ViewAreaScreenManagerProps {
  store: ScreenStore;
}

const ViewAreaScreenManager = observer(({ store }: ViewAreaScreenManagerProps) => {
  if (store.GetCurrentScreen().screenName === "") {
    return (
      <div style={{ width: "90%" }}>
        <Clock />
        This page will provide<br /><br />
        Our Hot Topics, Recent Tools, etc.<br /><br /><br />
        <div style={{ fontSize: 10 }}>[TEMPORARY]Guest ID / PW : guest / guest</div>
        <MessengerBar />
        <div style={{ fontSize: 10 }}>Copyright © 2023 Philip Sung. All right reserved.</div>
        <br /><br />
        <a href={"http://github.com/Philip-sung"}><img src={GithubIcon} width={30} alt="Github" /></a> &nbsp;
        <a href={"http://velog.io/@velog_sp"}><img src={VelogIcon} width={30} alt="Velog" /></a> &nbsp;
        <a href={"http://blog.naver.com/spinnavor"}><img src={BlogIcon} width={30} alt="NaverBlog" /></a>
      </div>
    );
  }
  if (store.currentScreen.screenName === "Search") { return <SearchScreen />; }
  else if (store.currentScreen.screenName === "Reservation") { return <ReservationScreen />; }
  else if (store.currentScreen.screenName === "InProgress") { return <InProgressScreen />; }
  else if (store.currentScreen.screenName === "Works") { return <WorksScreen />; }
  else if (store.currentScreen.screenName === "PostRead") { return <PostReadScreen postID={store.currentScreen.screenID} />; }
  else if (store.currentScreen.screenName === "MyPage") { return <MyPageScreen />; }
  else if (store.currentScreen.screenName === "ProjectDescription") { return <ProjectDescriptionScreen projectID={store.currentScreen.screenID} />; }
  return null;
});

export { ViewAreaScreenManager };
