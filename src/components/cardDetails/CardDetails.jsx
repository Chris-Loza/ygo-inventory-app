import React from "react";
import "./cardDetails.css";
import { useGlobalState } from "../../lib/globalState";

const CardDetails = () => {
  const { globalSelectedCard } = useGlobalState();
  return (
    <div className="cardDetails">
      <div className="cardImage">
        <div className="pictureContainer">
          <img
            src={
              globalSelectedCard.imageURL ||
              "../../../images/MathmechCircular.png"
            }
            alt="card image"
          />
        </div>
      </div>
      <div className="cardDetailsExpanded">
        {globalSelectedCard.name && (
          <div className="description">
            <div className="header">
              <h3>
                {globalSelectedCard.name} -{" "}
                {globalSelectedCard.set.length > 1
                  ? globalSelectedCard.set[0]
                  : globalSelectedCard.set}{" "}
                (
                {globalSelectedCard.code.length > 1
                  ? globalSelectedCard.code[0]
                  : globalSelectedCard.code}
                )
              </h3>
              <p>
                {globalSelectedCard.set.length > 1
                  ? globalSelectedCard.set[0]
                  : globalSelectedCard.set}
              </p>
            </div>
            <div className="cardDescription">
              <h3>Card Details</h3>
              <p className="effect">{globalSelectedCard.description}</p>
              <div className="cardAttributes">
                <p>
                  <b>Number:</b>{" "}
                  {globalSelectedCard.code.length > 1
                    ? globalSelectedCard.code[0]
                    : globalSelectedCard.code}
                </p>
                <p>
                  <b>Rarity:</b>{" "}
                  {globalSelectedCard.rarity.length > 1
                    ? globalSelectedCard.rarity[0]
                    : globalSelectedCard.rarity}
                </p>
                <p>
                  <b>Attribute, Type, Card Type:</b>{" "}
                  {globalSelectedCard.attribute
                    ? `${globalSelectedCard.attribute},`
                    : ""}{" "}
                  {globalSelectedCard.race}, {globalSelectedCard.type}
                </p>
                <p>
                  {globalSelectedCard.level ? (
                    <>
                      <b>
                        {globalSelectedCard.frameType !== "xyz"
                          ? "Level:"
                          : "Rank:"}
                      </b>{" "}
                      {globalSelectedCard.level}
                    </>
                  ) : (
                    ""
                  )}
                </p>
                <p>
                  {globalSelectedCard.atk ? (
                    <>
                      <b>A/D:</b>{" "}
                      {globalSelectedCard.def !== null &&
                      globalSelectedCard.def !== undefined
                        ? `${globalSelectedCard.atk}/${globalSelectedCard.def}`
                        : `${globalSelectedCard.atk}/Link-${globalSelectedCard.linkval}`}
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

export default CardDetails;
