import React, { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { TransitionObject } from "../TransitionObj";
import { postStoreObj } from "../../store/postStore";
import { searchStoreObj } from "../../store/SearchStore";
import "./index.css";
import searchIcon from "../../assets/img/SearchIcon.png";

const GetPostsbyTitleQuery = gql`
  query GetPostsbyTitlePaginated($postTitle: String!, $offset: Int!, $limit: Int!) {
    getPostsbyTitlePaginated(postTitle: $postTitle, offset: $offset, limit: $limit) {
      _id
      postTitle
      postDate
      postWriter
      project
    }
  }
`;

interface GetPostsbyTitleButtonProps {
  keyword: string;
}

function SearchBar(): JSX.Element {
  const [keyword, setKeyword] = useState("");

  return (
    <TransitionObject>
      <div className="SearchBarForm">
        <input
          className="SearchBar"
          placeholder="Search"
          value={keyword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setKeyword(e.target.value); }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.keyCode === 13) { document.getElementById("SearchButton")?.click(); }
          }}
        />
        <GetPostsbyTitleButton keyword={keyword} />
      </div>
    </TransitionObject>
  );
}

function GetPostsbyTitleButton(props: GetPostsbyTitleButtonProps): JSX.Element {
  const [getPostsbyTitle, { loading, error }] = useLazyQuery(GetPostsbyTitleQuery, {
    variables: {
      postTitle: searchStoreObj.curKeyword,
      offset: searchStoreObj.offset,
      limit: searchStoreObj.limit,
    },
    onCompleted: (data: any) => {
      postStoreObj.ClearPostStack();
      postStoreObj.PushPostStack(data?.getPostsbyTitlePaginated);
    },
    fetchPolicy: "network-only",
  });
  if (loading) { /* loading */ }
  if (error) { console.log(error.message); }

  return (
    <button
      id="SearchButton"
      className="Search"
      onClick={() => {
        searchStoreObj.SetKeyword(props.keyword);
        getPostsbyTitle();
        searchStoreObj.InitializeOffsetLimit();
      }}
    >
      <img className="SearchImg" src={searchIcon} alt="SearchImg" />
    </button>
  );
}

export { SearchBar };
