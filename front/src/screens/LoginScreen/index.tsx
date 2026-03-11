//External Imports
import React, { useState, useEffect } from "react";
import CryptoJS from 'crypto-js';
import { CSSTransition } from "react-transition-group";
import { useLazyQuery, gql, DocumentNode } from '@apollo/client';
import { useNavigate } from "react-router-dom";

//Local Imports
import { userInfoStoreObj } from "../../store/userInfoStore";

//Static Imports
import Logo from '../../logo.svg';
import './index.css';
import Info from "../../ServiceInformation";

interface LoginButtonProps {
    userID: string;
    userPW: string;
}

function LoginScreen(): React.ReactElement {

    const [userID, setID] = useState<string>('');
    const [userPW, setPW] = useState<string>('');
    const [loginButton, setLoginButton] = useState<boolean>(false);
    useEffect(() => {
        setLoginButton(true);
    },[])

    return(
        <div className="login">
            <CSSTransition in={loginButton} timeout={500} classNames="loginComponents" unmountOnExit>
                <div>
                    <div>
                        <img src={Logo} className="loginImg" alt="PhilipsLogo" />
                    </div>
                    <div className="loginBox">
                        M&nbsp;&nbsp;E&nbsp;&nbsp;M&nbsp;&nbsp;B&nbsp;&nbsp;E&nbsp;&nbsp;R&nbsp;&nbsp;S&nbsp;&nbsp;H&nbsp;&nbsp;I&nbsp;&nbsp;P<br/><br/>
                        <div>
                            <input className="loginInput" placeholder="Username"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setID(e.target.value)}}
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {if(e.keyCode === 13){document.getElementById('loginButton')?.click()}}}
                            />
                        </div>
                        <div>
                            <input className="loginInput" placeholder="Password"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setPW(e.target.value)}} type="password"
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {if(e.keyCode === 13){document.getElementById('loginButton')?.click()}}}
                            />
                        </div>
                        <LoginButton userID={userID} userPW={userPW} />
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
}

function EncryptModule(uPW: string): string {
    const userPW_E: string = CryptoJS.SHA512(uPW).toString().toUpperCase();
    return userPW_E;
}

function UserQuery(uID: string, uPW: string): DocumentNode {

    return (gql`
        query GetUsers{
            getUserInfo(userID:"${uID}", userPW:"${uPW}"){
                userID
                userPW
                userName
                credit
                privilege
            }
        }`
    )
}

function LoginButton(props: LoginButtonProps): React.ReactElement {
    const [IDPW, setIDPW] = useState<{ ID: string; PW: string }>({ID:'', PW:''});
    const navigate = useNavigate();
    const uPW_E: string = EncryptModule(props.userPW);
    const [login, {loading, error}] = useLazyQuery(UserQuery(IDPW.ID, IDPW.PW), {
        onCompleted: (data: any) => {
            if(props.userID === '' || props.userPW === ''){
                alert('Authentication Form Incompleted');
            }
            else{
                if(data?.getUserInfo === null){
                    alert('Invalid ID or Password');
                }
                else if(data?.getUserInfo.userID === IDPW.ID){
                    userInfoStoreObj.setStateLogin();
                    userInfoStoreObj.setUserID(data?.getUserInfo.userID);
                    userInfoStoreObj.setUserName(data?.getUserInfo.userName);
                    userInfoStoreObj.setPrivilege(data?.getUserInfo.privilege);
                    window.fetch(Info.setloginStateURI,{
                        method: "POST",
                        credentials: 'include',
                        headers: {
                            'Content-Type':'application/json; charset=utf-8'
                        },
                        body: JSON.stringify(userInfoStoreObj.GetUser())
                    }).then((res: Response) => {
                        //res.json().then((data)=>{console.log(data.body)});
                    })
                    navigate('/');
                }
            }
        },
        fetchPolicy: 'network-only',
    });

    if(loading){
    }
    if(error){
        console.log(error.message);
    }

    return (
        <div>
            <button id="loginButton" className="loginButton" onClick={() => {
                    setIDPW({ID:props.userID, PW:uPW_E});
                    setTimeout(()=>{login()},0);
                }
            }>Log In</button>
        </div>
    )
}

export { LoginScreen }
