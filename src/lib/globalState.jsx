import { createContext, useContext, useState } from "react";

const GlobalStateContext = createContext();
export const GlobalStateProvider = ({ children }) => {
  const [globalManualEntryCardImage, setGlobalManualEntryCardImage] = useState({
    file: null,
    url: "",
  });
  const [globalManualEntryCard, setGlobalManualEntryCard] = useState({
    name: "",
    set: "",
    rarity: "",
    code: "",
    imageURL: "",
    description: "",
    attribute: "",
    race: "",
    type: "",
    level: "",
    atk: "",
    def: "",
    linkval: "",
    count: 0,
  });

  const [globalInventoryList, setGlobalInventoryList] = useState([]);
  const [globalWishlist, setGlobalWishlist] = useState([]);
  const [wishlistToggle, setWishlistToggle] = useState(false);

  return (
    <GlobalStateContext.Provider
      value={{
        globalInventoryList,
        setGlobalInventoryList,
        globalWishlist,
        setGlobalWishlist,
        globalManualEntryCard,
        setGlobalManualEntryCard,
        wishlistToggle,
        setWishlistToggle,
        globalManualEntryCardImage,
        setGlobalManualEntryCardImage,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
