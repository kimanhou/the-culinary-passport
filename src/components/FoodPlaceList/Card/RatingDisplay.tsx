import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "./RatingDisplay.scss";

interface IRatingDisplayProps {
    rating: number | null;
    reviewCount: number | null;
}

function formatReviewCount(count: number): string {
    if (count === 1) {
        return "1 review";
    }
    if (count >= 1000) {
        const k = count / 1000;
        const formatted = k % 1 === 0 ? k.toFixed(0) : k.toFixed(1);
        return `${formatted}k reviews`;
    }
    return `${count} reviews`;
}

const RatingDisplay: React.FC<IRatingDisplayProps> = ({ rating, reviewCount }) => {
    if (rating === null) {
        return null;
    }

    return (
        <div className="rating-display">
            <FontAwesomeIcon icon={faStar} className="rating-display-star" />
            <span className="rating-display-value">{rating.toFixed(1)}</span>
            {reviewCount !== null && (
                <span className="rating-display-count">
                    ({formatReviewCount(reviewCount)})
                </span>
            )}
        </div>
    );
};

export { formatReviewCount };
export default RatingDisplay;
