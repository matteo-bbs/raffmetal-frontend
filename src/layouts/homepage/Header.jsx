import logo from "../../assets/Raffmetal_logo.png";
import {TimeClock} from "../../components/TimeClock.jsx";
import React from "react";
import Search from "../../pages/Search.jsx";
import {Link} from "react-router-dom";

import cercaIcon from "../../assets/cerca.png";
export const Header = ({layout}) => {
    return(
        <div className={`${layout === "Verticale" ? "h-[5vh] bg-white" : "h-[15vh]"}  flex justify-between items-center align-middle px-10 `}>
            <div className="w-80 ">
                <div className="py-8 text-center h-30">
                    <img src={logo} alt="logo" />
                </div>
            </div>
            {JSON.parse(localStorage.getItem("totemType"))[0].layout === "Orizzontale" && (
            <div className="pt-3">
                <Link className={'text-white uppercase text-lg flex flex-wrap'} to={'/ricerca'}>RICERCA <img className={'flex ms-2 w-[18px] h-[18px] mt-1.5'} src={cercaIcon}/> </Link>
            </div>
            )}
        </div>
    )
}