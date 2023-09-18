import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import Home from "./components/Home/Home";
import City from "./components/City/City";

function App() {
    return (
        <div className={`app-container`}>
            <HashRouter>
                <Header />
                <Routes>
                    <Route
                        path={"/paris"}
                        element={<City city="paris" />}
                    ></Route>

                    <Route
                        path={"/montreal"}
                        element={<City city="montreal" />}
                    ></Route>

                    <Route path={"/"} element={<Home />}></Route>
                </Routes>
                <Footer />
            </HashRouter>
        </div>
    );
}

export default App;
