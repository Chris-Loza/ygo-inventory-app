import React from "react";
import "./cardDetails.css"

const cardDetails = () => {
  return (
    <div className="cardDetails">
      <div className="cardImage">
        <div className="pictureContainer">
          <img
            src={
              selectedCard.imageURL || "../../../images/MathmechCircular.png"
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
                  {selectedCard.attribute ? `${selectedCard.attribute},` : ""}{" "}
                  {selectedCard.race}, {selectedCard.type}
                </p>
                <p>
                  {selectedCard.level ? (
                    <>
                      <b>
                        {selectedCard.frameType !== "xyz" ? "Level:" : "Rank:"}
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
  );
};

export default cardDetails;
