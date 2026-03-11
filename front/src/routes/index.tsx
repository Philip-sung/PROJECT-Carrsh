import { createBrowserRouter } from "react-router-dom";
import { LoginScreen } from "../screens/LoginScreen";
import { PostWriteScreen } from "../screens/PostWriteScreen";
import { PostModifyScreen } from "../screens/PostModifyScreen";
import { AddProjectScreen } from "../screens/AddProjectScreen";
import App from "../App";

const pServerRouter = createBrowserRouter([
  {
    path: "",
    element: <App />,
  },
  {
    path: "/",
    element: <App />,
  },
  {
    path: "login",
    element: <LoginScreen />,
  },
  {
    path: "post",
    element: <PostWriteScreen />,
  },
  {
    path: "postModify",
    element: <PostModifyScreen />,
  },
  {
    path: "addProject",
    element: <AddProjectScreen />,
  },
]);

export { pServerRouter };
