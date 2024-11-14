import React, { useEffect, useState } from "react";
import "./details.css";
import UserInfo from "../user/UserInfo";
import { useGlobalState } from "../../../lib/globalState";
import { useRemoveFromUserLists } from "../../../hooks/useRemoveFromUserLists";
import { auth } from "../../../lib/firebase";
import { useAddToUserLists } from "../../../hooks/useAddToUserLists";
import { fullCardList } from "../../../lib/fullCardList.min.js";

const Details = () => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredCards, setFilteredCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState({
    name: "",
    set: [],
    rarity: [],
    code: [],
    imageURL: "",
    description: "",
    attribute: "",
    type: "",
    level: "",
    atk: "",
    def: "",
    linkval: "",
    frameType: "",
  });
  const [cardCounts, setCardCounts] = useState([]);
  const {
    globalInventoryList,
    setGlobalInventoryList,
    globalWishlist,
    setGlobalWishlist,
    wishlistToggle,
    setWishlistToggle,
    globalSelectedCard,
    setGlobalSelectedCard,
  } = useGlobalState();

  const handleSets = (card) => {
    const newCard = {
      name: card.name,
      set: card.card_sets.map((set) => set.set_name),
      rarity: card.card_sets.map((set) => set.set_rarity),
      code: card.card_sets.map((set) => set.set_code),
      imageURL: card.card_images[0].image_url,
      description: card.desc,
      attribute: card.attribute,
      race: card.race,
      type: card.humanReadableCardType,
      level: card.level,
      atk: card.atk,
      def: card.def,
      linkval: card.linkval,
      frameType: card.frameType,
    };

    setSelectedCard(newCard);
    setGlobalSelectedCard(newCard);
    setCardCounts(Array(card.card_sets.length).fill(""));
  };

  useEffect(() => {
    if (selectedCard.set.length > 0) {
      setCardCounts(Array(selectedCard.set.length).fill(""));
    }
  }, [selectedCard.set]);

  const handleWishlistSwitch = () => {
    setWishlistToggle(!wishlistToggle);
  };

  const handleInputChange = (e, index) => {
    const newCounts = [...cardCounts];
    newCounts[index] = e.target.value;
    setCardCounts(newCounts);
  };

  const handleCardAdd = (selectedCard, cardCount, setName, index) => {
    const newCard = {
      name: selectedCard.name,
      set: setName,
      rarity: selectedCard.rarity[index],
      code: selectedCard.code[index],
      imageURL: selectedCard.imageURL,
      description: selectedCard.description,
      attribute: selectedCard.attribute || null,
      race: selectedCard.race,
      type: selectedCard.type,
      level: selectedCard.level || null,
      atk: selectedCard.atk || null,
      def: selectedCard.def || null,
      linkval: selectedCard.linkval || 0,
      frameType: selectedCard.frameType,
      count: Number(cardCount),
    };

    const existingInvCardIndex = globalInventoryList.findIndex(
      (card) => card.name === selectedCard.name && card.set === setName
    );
    const existingWishCardIndex = globalWishlist.findIndex(
      (card) => card.name === selectedCard.name && card.set === setName
    );

    if (!wishlistToggle) {
      if (existingInvCardIndex !== -1) {
        const updatedInvCards = [...globalInventoryList];
        updatedInvCards[existingInvCardIndex].count += Number(cardCount);
        setGlobalInventoryList(updatedInvCards);
        useAddToUserLists(auth.currentUser.uid, newCard, wishlistToggle);
      } else {
        setGlobalInventoryList((prev) => [...prev, newCard]);
        useAddToUserLists(auth.currentUser.uid, newCard, wishlistToggle);
      }
    } else {
      if (existingWishCardIndex !== -1) {
        const updatedWishCards = [...globalWishlist];
        updatedWishCards[existingWishCardIndex].count += Number(cardCount);
        setGlobalWishlist(updatedWishCards);
        useAddToUserLists(auth.currentUser.uid, newCard, wishlistToggle);
      } else {
        setGlobalWishlist((prev) => [...prev, newCard]);
        useAddToUserLists(auth.currentUser.uid, newCard, wishlistToggle);
      }
    }
  };

  const handleCardRemove = (selectedCard, cardCount, setName) => {
    const existingInvCardIndex = globalInventoryList.findIndex(
      (card) => card.name === selectedCard.name && card.set === setName
    );

    const existingWishCardIndex = globalWishlist.findIndex(
      (card) => card.name === selectedCard.name && card.set === setName
    );

    if (!wishlistToggle) {
      if (existingInvCardIndex !== -1) {
        const updatedInvCards = [...globalInventoryList];
        updatedInvCards[existingInvCardIndex].count -= Number(cardCount);

        if (updatedInvCards[existingInvCardIndex].count < 1) {
          updatedInvCards.splice(existingInvCardIndex, 1);
        }
        setGlobalInventoryList(updatedInvCards);
      }
      useRemoveFromUserLists(
        auth.currentUser.uid,
        selectedCard,
        wishlistToggle,
        cardCount,
        setName
      );
    } else {
      if (existingWishCardIndex !== -1) {
        const updatedWishCards = [...globalWishlist];
        updatedWishCards[existingWishCardIndex].count -= Number(cardCount);

        if (updatedWishCards[existingWishCardIndex].count < 1) {
          updatedWishCards.splice(existingWishCardIndex, 1);
        }

        setGlobalWishlist(updatedWishCards);
      }
      useRemoveFromUserLists(
        auth.currentUser.uid,
        selectedCard,
        wishlistToggle,
        cardCount,
        setName
      );
    }
  };

  const handleFocus = () => {
    document.body.style.overflow = "hidden";
  };

  const handleBlur = () => {
    document.body.style.overflow = "auto";
  };
  return (
    <>
      <div className="utilities">
        <div className="cardSearch">
          <input
            type="text"
            name="cardName"
            placeholder="Enter Card Name..."
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => {
              const newSearchInput = e.target.value;
              setSearchInput(newSearchInput);

              if (newSearchInput === "") {
                setFilteredCards([]);
              } else if (newSearchInput.length > 2) {
                setFilteredCards(
                  fullCardList.data.filter((c) =>
                    c.name.toLowerCase().includes(newSearchInput.toLowerCase())
                  )
                );
              }
            }}
          />
          <div className="searchResults">
            {filteredCards.map((card) => (
              <div
                className="result"
                key={card.id}
                onClick={() => handleSets(card)}
              >
                <img
                  src={card.card_images[0].image_url_small}
                  alt="result image"
                />
                <div className="cardInfo">
                  <span>{card.name}</span>
                  {card.atk ? (
                    <>
                      <p>
                        {card.attribute ? `${card.attribute}/` : ""}
                        {card.race}{" "}
                        {card.level
                          ? card.frameType !== "xyz"
                            ? `Level ${card.level}`
                            : `Rank ${card.level}`
                          : ""}
                      </p>
                      <p>
                        {card.atk && card.def !== null && card.def !== undefined
                          ? `${card.atk}/${card.def}`
                          : `${card.atk}/Link-${card.linkval}`}
                      </p>
                    </>
                  ) : (
                    <>
                      <p>{card.humanReadableCardType}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="separator"></div>
        {globalSelectedCard.name ? (
          <div className="infoSwitch">
            <h3>{globalSelectedCard.name}</h3>
            <div className="wishlistSwitch">
              <input
                type="checkbox"
                name="inventory"
                onClick={handleWishlistSwitch}
              />
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="inventory">
          <div className="sets">
            {globalSelectedCard.set.map((setName, index) => (
              <div className="resultSet" key={index}>
                <div className="setInfo">
                  <p>{setName}</p>
                  <p className="set">
                    {globalSelectedCard.rarity[index]} (
                    {globalSelectedCard.code[index]})
                  </p>
                </div>
                <div className="setModifying">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      name="cardCount"
                      placeholder="0"
                      value={cardCounts[index]}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                    <button
                      type="submit"
                      className="removeButton"
                      onClick={() =>
                        handleCardRemove(
                          globalSelectedCard,
                          cardCounts[index],
                          setName
                        )
                      }
                    >
                      -
                    </button>
                    <button
                      className="setListAddButton"
                      type="submit"
                      onClick={() =>
                        handleCardAdd(
                          globalSelectedCard,
                          cardCounts[index],
                          setName,
                          index
                        )
                      }
                    >
                      +
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="userDetails">
        <UserInfo />
      </div>
    </>
  );
};

export default Details;
