import React, { useEffect, useState, useRef } from "react";

interface IFoodPlaceImageProps {
    src: string;
    index: number;
    foodPlaceName: string;
    setSelectedIndex: (selectedIndex: number) => void;
}

const FoodPlaceImage: React.FC<IFoodPlaceImageProps> = (props) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { rootMargin: "0px", threshold: 0.9 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        if (isVisible) {
            props.setSelectedIndex(props.index);
        }
        // eslint-disable-next-line
    }, [isVisible]);

    return (
        <img
            ref={ref}
            src={props.src}
            alt={`${props.index} - ${props.foodPlaceName}`}
        />
    );
};

export default FoodPlaceImage;
