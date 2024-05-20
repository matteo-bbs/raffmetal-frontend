import "./App.css";
import { Header } from "./layouts/homepage/Header.jsx";
import {Link, Route, Routes} from "react-router-dom";
import { FrontPage } from "./pages/FrontPage.jsx";
import { SnodoPage } from "./pages/SnodoPage.jsx";
import Menu from "./components/general/Menu.jsx";
import axios from "./components/general/api.jsx";
import React, { useEffect, useState } from "react";

import "./fonts/fonts.css";
import { ArchivePage } from "./pages/ArchivePage.jsx";
import LinkUtili from "./components/general/LinkUtili.jsx";
import Search from "./pages/Search.jsx";
import {ModalPage} from "./pages/ModalPage.jsx";
import {TimeClock} from "./components/TimeClock.jsx";
import cercaIcon from "./assets/cerca.png";
function App() {
  document.body.addEventListener(
    "touchmove",
    (ev) => {
      if (ev.touches.length > 1) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
      }
    },
    true
  );

  //prendo il parametro idTotem dall'url e lo salvo cosí da salvarmi in che tipologia di totem siamo
  const urlParams = new URLSearchParams(window.location.search);
  const totemId = urlParams.get("idTotem");
  if (totemId) {
    localStorage.setItem("idTotem", totemId);
  }
  if (totemId) {
    const urlWithoutTotemId = window.location.href.replace(
      `?idTotem=${totemId}`,
      ""
    );
    window.history.replaceState({}, document.title, urlWithoutTotemId);
  }
  const savedTotemId = localStorage.getItem("idTotem");

  const [totemType, setTotemType] = useState(null);

  const username = import.meta.env.VITE_REACT_APP_UTENTE_API;
  const password = import.meta.env.VITE_REACT_APP_PASSWORD_API;

  const config = {
    headers: {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    const fetchData = () => {
      axios
          .get(`/configuratore-totem`, config)
          .then((response) => {
            const filteredData = response.data.filter((item) => item.idtotem === savedTotemId);
            setTotemType(filteredData);
            localStorage.setItem("totemType", JSON.stringify(filteredData));
          })
          .catch((error) => console.log(error));
    };

    // Fetch data immediately when the component mounts
    fetchData();

    // Set up the interval for periodic updates
    const intervalId = setInterval(() => {
      fetchData();
    }, 120000); // Update every 120 seconds 2 minutes

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);


  console.log(totemType);

  return (
    <>
      {totemType && totemType[0]?.layout === "Orizzontale" && (
          <div className="App h-screen overflow-hidden bg-lGrayLight flex text-lTekneLDO">
            <div className={"w-10/12 px-10"}>
              <Header />
              <div className="flex h-[75vh]">
                <div className="w-full ">
                  <Routes>
                    <Route path="/" element={<FrontPage id_sezione="" />} />
                    <Route path="/modalpage" element={<ModalPage/>} />
                    <Route path="/snodopage/:id_sezione" element={<SnodoPage />} />
                    <Route path="/archivio/:id_sezione" element={<ArchivePage />} />
                    <Route path="/ricerca" element={<Search />} />
                  </Routes>
                </div>
              </div>
            </div>
            <div className={"w-2/12 bg-lGrayDark px-6 flex"}>
              <div className="menu h-auto inline-block flex justify-center items-center mb-10 w-full">
                <div className="flex justify-end w-full">
                  <div className="w-full p-4">
                    <p className={"text-white font-bold mb-3 text-xl"}>Menu</p>
                    {totemType && <Menu idTotem={totemType} />}
                    {totemType && (
                        <>

                          <LinkUtili idTotem={totemType} />
                        </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}

      {totemType && totemType[0]?.layout === "Verticale" && (
          <div className="App h-[1920px] w-[1080px] m-auto overflow-hidden bg-lGrayLight flex flex-wrap text-lTekneLDO">
            <div className={"w-full bg-rSecondary"}>
              <div className={'shadow-lg bg-white mb-5'}>
                <Header layout={totemType[0]?.layout}/>
              </div>
              <div className={"flex relative w-full bg-rSecondary px-10 mb-5"}>
                {/*<div className={"flex relative w-full pb-6 -top-5 left-0 -mt-8"}>*/}
                <div
                    className={
                      "w-full text-rPrimary top-0 text-3xl text-left flex justify-start pe-14 font-bold pe-40 me-8"
                    }
                >
                  {localStorage.getItem("totemType") &&
                      JSON.parse(localStorage.getItem("totemType"))[0].sito}
                  <TimeClock/>
                </div>
              </div>
              <div className="flex h-[91vh] bg-rSecondary ps-10 h-auto">
                {/*<div className="menu h-auto inline-block flex justify-center items-center mb-10 w-full">*/}
                <div className="flex justify-end w-full">
                  <div className="flex w-full">
                    <div className={"w-[65%]"}>

                      <Routes>
                        <Route path="/" element={<FrontPage layout={totemType[0]?.layout} id_sezione=""/>}/>
                        <Route path="/modalpage" element={<ModalPage/>}/>
                        <Route path="/snodopage/:id_sezione" element={<SnodoPage/>}/>
                        <Route path="/archivio/:id_sezione" element={<ArchivePage/>}/>
                        <Route path="/ricerca" element={<Search/>}/>
                      </Routes>
                    </div>
                    <div className={"w-[5%]"}></div>
                    {totemType && (
                        <div className={"w-[30%]"}>
                          {totemType && <Menu idTotem={totemType}/>}

                            <LinkUtili idTotem={totemType}/>
                        </div>
                    )}
                  </div>
                </div>
                {/*</div>*/}
              </div>
            </div>

          </div>
      )}
    </>
  );
}

export default App;
