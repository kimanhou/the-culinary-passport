import React, { useEffect, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import Home from "./components/Home/Home";
import City from "./components/City/City";
import CityModel from "./model/City";
import "./App.scss";

function App() {
    const [cities, setCities] = useState<CityModel[]>([]);

    useEffect(() => {
        fetch("./cities.json")
            .then((response) => response.json())
            .then((json) => json.map((x: any) => CityModel.deserialize(x)))
            .then((t) => setCities(t));
    }, []);

    return (
        <div className={`app-container`}>
            <HashRouter>
                <Header cities={cities} />
                <Routes>
                    {cities.map((t) => (
                        <Route
                            path={`/${t.name.toLocaleLowerCase()}`}
                            element={<City city={t} />}
                            key={t.name}
                        ></Route>
                    ))}

                    {cities.map((t) => (
                        <Route
                            path={`/${t.name.toLocaleLowerCase()}/:foodPlaceId`}
                            element={<City city={t} />}
                            key={t.name}
                        ></Route>
                    ))}

                    <Route
                        path={"/"}
                        element={<Home cities={cities} />}
                    ></Route>
                </Routes>
                <Footer />
            </HashRouter>
        </div>
    );
}

export default App;
