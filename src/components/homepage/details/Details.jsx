import React, { useState } from "react";
import "./details.css";
import UserInfo from "../user/UserInfo";
import { fullCardList } from "../../../../lib/fullCardList.min.js";
import { useGlobalState } from "../../../lib/globalState";
import { useRemoveFromUserLists } from "../../../hooks/useRemoveFromUserLists";
import { auth } from "../../../lib/firebase";
import { useAddToUserLists } from "../../../hooks/useAddToUserLists";

const Details = (selectedCard) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredCards, setFilteredCards] = useState([]);
  const [cardCounts, setCardCounts] = useState([]);
  const {
    globalInventoryList,
    setGlobalInventoryList,
    globalWishlist,
    setGlobalWishlist,
    wishlistToggle,
    setWishlistToggle,
  } = useGlobalState();

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
  return (
    <>
      <div className="utilities">
        <div className="cardSearch">
          <input
            type="text"
            name="cardName"
            placeholder="Enter Card Name..."
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
        {selectedCard.name ? (
          <div className="infoSwitch">
            <h3>{selectedCard.name}</h3>
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
            {selectedCard.set.map((setName, index) => (
              <div className="resultSet" key={index}>
                <div className="setInfo">
                  <p>{setName}</p>
                  <p className="set">
                    {selectedCard.rarity[index]} ({selectedCard.code[index]})
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
                          selectedCard,
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
                          selectedCard,
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
