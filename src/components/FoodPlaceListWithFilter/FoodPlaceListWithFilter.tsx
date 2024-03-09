import { LatLngExpression } from "leaflet";
import React, { useState } from "react";
import { useEffect } from "react";
import FoodPlace from "model/FoodPlace";
import MapMarker from "model/MapMarker";
import { getValueOrDefault } from "utils";
import Filter from "components/Filter/Filter";
import FoodPlaceList from "components/FoodPlaceList/FoodPlaceList";
import Map from "components/Map/Map";
import ramen from "assets/ramen.png";
import coin from "assets/coin.png";
import map from "assets/map.png";
import "./FoodPlaceListWithFilter.scss";

interface IFoodPlaceListWithFilterProps {
    foodPlaces: FoodPlace[];
    mapCenter: LatLngExpression;
    mapZoom: number;
}

const FoodPlaceListWithFilter: React.FC<IFoodPlaceListWithFilterProps> = (
    props
) => {
    const typeOfCuisineOptions = Array.from(
        new Set<string>(
            props.foodPlaces
                .flatMap((v) => v.typeOfCuisine)
                .filter((t) => t !== "")
        )
    );
    const [selectedCuisine, setSelectedCuisine] = useState<string>("");

    const priceOptions = Array.from(
        new Set<string>(
            props.foodPlaces.map((v) => v.price).filter((t) => t !== "")
        )
    );
    const [selectedPrice, setSelectedPrice] = useState<string>("");

    const neighborhoodOptions = Array.from(
        new Set<string>(
            props.foodPlaces
                .map((v) => getValueOrDefault(v.neighborhood))
                .filter((t) => t !== "")
        )
    );
    const [selectedNeighborhood, setSelectedNeighborhood] =
        useState<string>("");

    const [displayedFoodPlaces, setDisplayedFoodPlaces] = useState<FoodPlace[]>(
        props.foodPlaces
    );

    useEffect(() => {
        if (
            selectedCuisine === "all" &&
            selectedNeighborhood === "all" &&
            selectedPrice === "all"
        ) {
            setDisplayedFoodPlaces(props.foodPlaces);
        } else {
            let filteredFoodPlaces = props.foodPlaces;
            if (
                selectedCuisine !== "" &&
                selectedCuisine.toLocaleLowerCase() !== "all"
            ) {
                filteredFoodPlaces = filteredFoodPlaces.filter((t) =>
                    t.typeOfCuisine.includes(selectedCuisine)
                );
            }
            if (
                selectedNeighborhood !== "" &&
                selectedNeighborhood.toLocaleLowerCase() !== "all"
            ) {
                filteredFoodPlaces = filteredFoodPlaces.filter(
                    (t) =>
                        getValueOrDefault(t.neighborhood) ===
                        selectedNeighborhood
                );
            }
            if (
                selectedPrice !== "" &&
                selectedPrice.toLocaleLowerCase() !== "all"
            ) {
                filteredFoodPlaces = filteredFoodPlaces.filter(
                    (t) => t.price === selectedPrice
                );
            }

            setDisplayedFoodPlaces(filteredFoodPlaces);
        }
    }, [
        selectedCuisine,
        selectedNeighborhood,
        selectedPrice,
        props.foodPlaces,
    ]);

    const mapMarkers: MapMarker[] = props.foodPlaces
        .filter((t) => t.coordinates !== undefined)
        .map((t) => {
            return {
                coordinates: t.coordinates!,
                popUpText: t.name,
            };
        });
    return (
        <section id="food-place-list-with-filter">
            <Map
                center={props.mapCenter}
                zoom={props.mapZoom}
                markers={mapMarkers}
            />
            <div id="food-place-list-with-filter-filters" className="flex-row">
                {typeOfCuisineOptions.length > 0 && (
                    <Filter
                        filterName="Cuisine"
                        icon={<img src={ramen} alt={"Cuisine filter icon"} />}
                        options={typeOfCuisineOptions}
                        selectedOption={selectedCuisine}
                        setSelectedOption={setSelectedCuisine}
                    />
                )}
                {priceOptions.length > 0 && (
                    <Filter
                        filterName="Price"
                        icon={<img src={coin} alt={"Price filter icon"} />}
                        options={priceOptions}
                        selectedOption={selectedPrice}
                        setSelectedOption={setSelectedPrice}
                    />
                )}
                {neighborhoodOptions.length > 0 && (
                    <Filter
                        filterName="Neighborhood"
                        icon={
                            <img src={map} alt={"Neighborhood filter icon"} />
                        }
                        options={neighborhoodOptions}
                        selectedOption={selectedNeighborhood}
                        setSelectedOption={setSelectedNeighborhood}
                    />
                )}
            </div>

            {displayedFoodPlaces.length > 0 && (
                <FoodPlaceList foodPlaceList={displayedFoodPlaces} />
            )}
            {displayedFoodPlaces.length === 0 && (
                <p>Sorry, nothing matches your selection.</p>
            )}
        </section>
    );
};

export default FoodPlaceListWithFilter;
