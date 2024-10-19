import { useContext, createContext, useState } from "react";

const CardContext = createContext(null);

export const useCardContext = () => {
  return useContext(CardContext);
};

export const CardProvider = ({ children }) => {
  const [cardData, setCardData] = useState("");

  return (
    <CardContext.Provider
      value={{
        cardData,
        setCardData,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};
