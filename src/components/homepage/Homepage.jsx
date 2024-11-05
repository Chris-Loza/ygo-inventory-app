import React, { useEffect, useRef, useState } from "react";
import "./homepage.css";
import UserInfo from "./user/UserInfo";
import Inventory from "./inventory/Inventory";
import { fullCardList } from "../../lib/fullCardList.min.js";
import { useGlobalState } from "../../lib/globalState";
import { useAddToUserLists } from "../../hooks/useAddToUserLists";
import { auth, storage } from "../../lib/firebase";
import { useRemoveFromUserLists } from "../../hooks/useRemoveFromUserLists";
import { getDownloadURL, ref } from "firebase/storage";

const Homepage = () => {
  const [inventoryMode, setInventoryMode] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [cardCounts, setCardCounts] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const {
    globalInventoryList,
    setGlobalInventoryList,
    globalWishlist,
    setGlobalWishlist,
    wishlistToggle,
    setWishlistToggle,
  } = useGlobalState();
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

  const handleSwitch = () => {
    setInventoryMode(!inventoryMode);
  };

  const handleWishListSwitch = () => {
    setWishlistToggle(!wishlistToggle);
  };

  const basicForm = (e) => {
    e.preventDefault();
  };

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
    setCardCounts(Array(card.card_sets.length).fill(""));
  };

  useEffect(() => {
    if (selectedCard.set.length > 0) {
      setCardCounts(Array(selectedCard.set.length).fill(""));
    }
  }, [selectedCard.set]);

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

  const handleCardRemove = (selectedCard, cardCount, setName, index) => {
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
    <div className="homepage">
      {/* <div className="myLinks">Created and Developed by Christian Loza </div> */}
      <div className="toggleSwitch">
        <input type="checkbox" name="inventory" onClick={handleSwitch} />
      </div>
      {inventoryMode ? (
        <div className="inventoryMode">
          <Inventory />
        </div>
      ) : (
        <div className="cardDetails">
          <div className="cardImage">
            <div className="pictureContainer">
              <img
                src={
                  selectedCard.imageURL ||
                  "../../../images/MathmechCircular.png"
                }
                alt="card image"
              />
            </div>
          </div>
          <div className="cardDetailsExpanded">
            {selectedCard.name && (
              <div className="description">
                <div className="header">
                  <h3>
                    {selectedCard.name} -{" "}
                    {selectedCard.set.length > 1
                      ? selectedCard.set[0]
                      : selectedCard.set}{" "}
                    (
                    {selectedCard.code.length > 1
                      ? selectedCard.code[0]
                      : selectedCard.code}
                    )
                  </h3>
                  <p>
                    {selectedCard.set.length > 1
                      ? selectedCard.set[0]
                      : selectedCard.set}
                  </p>
                </div>
                <div className="cardDescription">
                  <h3>Card Details</h3>
                  <p className="effect">{selectedCard.description}</p>
                  <div className="cardAttributes">
                    <p>
                      <b>Number:</b>{" "}
                      {selectedCard.code.length > 1
                        ? selectedCard.code[0]
                        : selectedCard.code}
                    </p>
                    <p>
                      <b>Rarity:</b>{" "}
                      {selectedCard.rarity.length > 1
                        ? selectedCard.rarity[0]
                        : selectedCard.rarity}
                    </p>
                    <p>
                      <b>Attribute, Type, Card Type:</b>{" "}
                      {selectedCard.attribute
                        ? `${selectedCard.attribute},`
                        : ""}{" "}
                      {selectedCard.race}, {selectedCard.type}
                    </p>
                    <p>
                      {selectedCard.level ? (
                        <>
                          <b>
                            {selectedCard.frameType !== "xyz"
                              ? "Level:"
                              : "Rank:"}
                          </b>{" "}
                          {selectedCard.level}
                        </>
                      ) : (
                        ""
                      )}
                    </p>
                    <p>
                      {selectedCard.atk ? (
                        <>
                          <b>A/D:</b>{" "}
                          {selectedCard.def !== null &&
                          selectedCard.def !== undefined
                            ? `${selectedCard.atk}/${selectedCard.def}`
                            : `${selectedCard.atk}/Link-${selectedCard.linkval}`}
                        </>
                      ) : (
                        ""
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="mainSeparator"></div>
      <div className="details">
        <div className="utilities">
          <div className="cardSearch">
            <input
              type="text"
              name="cardname"
              placeholder="Enter Card Name..."
              onChange={(e) => {
                const newSearchInput = e.target.value;
                setSearchInput(newSearchInput);

                if (newSearchInput === "") {
                  setFilteredCards([]);
                } else if (newSearchInput.length > 2) {
                  setFilteredCards(
                    fullCardList.data.filter((c) =>
                      c.name
                        .toLowerCase()
                        .includes(newSearchInput.toLowerCase())
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
                          {card.atk &&
                          card.def !== null &&
                          card.def !== undefined
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
              <div className="wishListSwitch">
                <input
                  type="checkbox"
                  name="inventory"
                  onClick={handleWishListSwitch}
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
                    {/* <div className="set"></div> */}
                  </div>
                  <div className="setModifying">
                    <form onSubmit={basicForm}>
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
                            setName,
                            index
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
      </div>
    </div>
  );
};

export default Homepage;
