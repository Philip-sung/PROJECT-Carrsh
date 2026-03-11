import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import { pServerRouter } from "./routes";
// @ts-ignore - ServiceInformation.js is git-ignored
import Info from "./ServiceInformation";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: Info.databaseURI,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ApolloProvider client={client}>
    <RouterProvider router={pServerRouter} />
  </ApolloProvider>
);

reportWebVitals();
