import React, { useEffect, useState } from "react";
import "./Nav.css";
import { useNavigate } from "react-router-dom";
import NetFlixLogo from './assets/netflixlogo.png';
import NetflixAvatar from './assets/Netflix-avatar.png';

function Nav() {
  const[show,handleShow] = useState(false);
  const navigate = useNavigate();

  const transitionNavBar = () =>{
    if(window.scrollY>100){
      handleShow(true);
    }
    else{
      handleShow(false);
    }
  }
  useEffect(()=>{
    window.addEventListener("scroll",transitionNavBar);
    return () => window.removeEventListener("scroll",transitionNavBar);
  },[])
  return (
    <div className={`nav ${show && "nav__black"}`}>
      <div className="nav__contents">
      <img onClick={()=>navigate("/")}
        className="nav__logo"
        src={NetFlixLogo}
        alt=""
      ></img>
      <img onClick={()=>navigate("/profile")}
        src={NetflixAvatar}
        alt="avatar"
        className="nav__avatar"
      />
      </div>
    </div>
  );
}

export default Nav;
