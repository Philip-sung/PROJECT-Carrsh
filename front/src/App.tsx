// Local Imports
import { NavigationBar } from "./components/Navigation";
import { ViewArea } from "./components/ViewArea";
// @ts-ignore - ServiceInformation.js is git-ignored
import Info from "./ServiceInformation";
import { userInfoStoreObj } from "./store/userInfoStore";

// Static Imports
import "./App.css";

function App(): JSX.Element {
  window
    .fetch(Info.getloginStateURI, {
      credentials: "include",
    })
    .then((res: Response) => {
      res.json().then((data: any) => {
        if (Object.keys(data).length !== 0) {
          userInfoStoreObj.setUserID(data.body?.id);
          userInfoStoreObj.setUserName(data.body?.name);
          userInfoStoreObj.setPrivilege(data.body?.privilege);
          userInfoStoreObj.setStateLogin();
        }
      });
    });

  return (
    <div className="App">
      <header className="App-header">
        <ViewArea className="ViewArea" />
        <NavigationBar className="NavigationBar" />
      </header>
    </div>
  );
}

export default App;
