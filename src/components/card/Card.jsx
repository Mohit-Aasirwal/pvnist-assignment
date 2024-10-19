import React from "react";
import { useCardContext } from "../../context/CardContext";

const Card = ({ title }) => {
  const { cardData } = useCardContext();
  return (
    <div className="rounded-md hover:scale-105 transition-all duration-200 ease-in-out w-96 h-fit p-3 bg-white flex justify-center items-center shadow-lg text-blue-600">
      {title}
      this is your current selections:{" "}
      {Object.entries(cardData)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ")}
    </div>
  );
};

export default Card;
