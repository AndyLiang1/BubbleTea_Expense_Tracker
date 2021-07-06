import React from "react";
import "./Card.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
/**
 * This is the card component for the card style format that is 
 * displayed instead of a table when device width is small. 
 * 
 * Props:
 *  flavour: flavour of a purchase
 *  quantity: quantity of a purchase
 *  price: price of a purchase
 *  location: location of a purchase
 *  date: date of a purchase
 *  purchaseId: purchaseId of a purchase
 *  showEditPopUp: a function that makes the edit pop up appear
 *  showDeletePopUp: a function that makes the delete pop up appear
 * 
 */
function Card({ flavour, quantity, price, location, date, purchaseId, showEditPopUp, showDeletePopUp }) {
  return (
    <div className="card">
      <div className="card-attribute">
        <h1>Flavour:</h1>
        <h1>{flavour}</h1>
      </div>
      <div className="card-attribute">
        <h1>Quantity:</h1>
        <h1>{quantity}</h1>
      </div>
      <div className="card-attribute">
        <h1>Price:</h1>
        <h1>{price}</h1>
      </div>
      <div className="card-attribute">
        <h1>Location:</h1>
        <h1>{location}</h1>
      </div>
      <div className="card-attribute">
        <h1>Date:</h1>
        <h1>{date}</h1>
      </div>
      <div className="card-buttons">
        <FaEdit
          className="user-table-body-row-edit"
          purchaseid={purchaseId}
          onClick={showEditPopUp}
        >
          Edit
        </FaEdit>

        <FaTrashAlt
          className="user-table-body-row-delete"
          onClick={showDeletePopUp}
          purchaseid={purchaseId}
        >
          Delete
        </FaTrashAlt>
      </div>

    </div>
  );
}

export default Card;
