import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { userInfoStoreObj } from "../../store/userInfoStore";
import { noticeStoreObj } from "../../store/noticeStore";
import "./index.css";
import closeButtonIcon from "../../assets/img/CloseButtonIcon.png";

interface NoticeMapperProps {
  setNoticeNumber: (num: number) => void;
}

interface NoticeBarProps {
  _id: string;
  project?: string;
  title?: string;
  from?: string;
  to?: string;
  content?: string;
  time?: string;
}

function NoticeOutline(): JSX.Element {
  const [noticeNumber, setNoticeNumber] = useState(0);

  return (
    <div className="NoticeContainer">
      <div className="NoticeHeader">Notice</div>
      <NoticeProvider>
        <NoticeMapper setNoticeNumber={setNoticeNumber} />
        {noticeNumber <= 0 ? <EmptyNotice /> : <></>}
        {noticeNumber <= 1 ? <EmptyNotice /> : <></>}
        {noticeNumber <= 2 ? <EmptyNotice /> : <></>}
        <TransparentNotice />
      </NoticeProvider>
    </div>
  );
}

function EmptyNotice(): JSX.Element {
  return (
    <div className="NoticeBar" style={{ opacity: 0.7 }}>
      <div className="NoticeThumbnail" style={{ borderStyle: "dashed" }}>Empty</div>
      <div className="NoticeContent">
        <div><strong>Empty Notice</strong></div>
        <div>Your received notice will be projected here.</div>
      </div>
      <img className="NoticeRemover" src={closeButtonIcon} style={{ opacity: 0 }} alt="NoticeRemover" />
    </div>
  );
}

function TransparentNotice(): JSX.Element {
  return (
    <div className="NoticeBarTransparent">
      <div className="NoticeThumbnail" style={{ borderStyle: "dashed" }}>Empty</div>
      <div className="NoticeContent">
        <div><strong>Empty Notice</strong></div>
        <div>Your received notice will be projected here.</div>
      </div>
      <img className="NoticeRemover" src={closeButtonIcon} style={{ opacity: 0 }} alt="NoticeRemover" />
    </div>
  );
}

const getUserNoticeQuery = gql`
  query GetUserNotice($userID: String) {
    getUserNotice(userID: $userID) {
      _id
      project
      title
      from
      to
      content
      time
    }
  }
`;

function NoticeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="NoticeProvider">{children}</div>;
}

function NoticeMapper(props: NoticeMapperProps): JSX.Element | null {
  const { data } = useQuery(getUserNoticeQuery, {
    variables: { userID: userInfoStoreObj.curUser.id },
    fetchPolicy: "network-only",
    onCompleted: (data: any) => {
      props.setNoticeNumber(data?.getUserNotice?.length);
    },
  });

  return (
    <>
      {data?.getUserNotice.map(({ _id, project, title, from, to, content, time }: any) => (
        <NoticeBar key={_id} _id={_id} project={project} title={title} from={from} to={to} content={content} time={time} />
      ))}
    </>
  );
}

const deleteNoticeQuery = gql`
  mutation deleteNotice($_id: ID) {
    deleteNotice(_id: $_id) {
      title
    }
  }
`;

function NoticeBar(props: NoticeBarProps): JSX.Element {
  const [exist, setExist] = useState(true);
  const [visible, setVisible] = useState(true);
  const [deleteNotice] = useMutation(deleteNoticeQuery, {
    variables: { _id: props._id },
    fetchPolicy: "network-only" as any,
  });

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = `/thumbnail/Public.png`;
  };

  return (
    <div className={exist ? (visible ? "NoticeBar" : "NoticeBarInvisible") : "NoticeBarDeleted"}>
      <div className="NoticeThumbnail">
        <img className="NoticeImg" src={`/thumbnail/${props.project}.png`} onError={handleImgError} alt="NoticeImg" />
      </div>
      <div className="NoticeContent">
        <div><strong>{`${props.title} - ${props.time}`}</strong></div>
        <div>{`${props.content}`}</div>
      </div>
      <img
        className="NoticeRemover"
        src={closeButtonIcon}
        onClick={() => {
          deleteNotice();
          setVisible(false);
          setTimeout(() => { setExist(false); }, 600);
          noticeStoreObj.setNoticeNumber(noticeStoreObj.getNoticeNumber() - 1);
        }}
        alt="NoticeRemover"
      />
    </div>
  );
}

export { NoticeOutline };
