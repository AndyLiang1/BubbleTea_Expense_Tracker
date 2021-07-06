import React, { useEffect } from "react";
import "./GlobalTable.css"
/**
 * This is the component to display the table with the 7 most popular purchases.
 * 
 * Props:
 *  - loadGlobalTable: a function that queries the database to get the 
 *                     top 7 flavours and sets up the global table 
 *                     to display that information
 *  - listOfGlobalPurchases: the 7 most popular types (type as in flavour) of purchases
 *  - setUserClicked: a function that changes the state of whether or not to display the 
 *                    individual user table 
 *  - globalClicked: a state of whether or not to display the 
 *                   global table 
 *  - setGlobalClicked: a function that changes the state of whether or not to 
 *                    display the global table 
 *
 */
function GlobalTable({
  loadGlobalTable,
  listOfGlobalPurchases,
  setUserClicked,
  globalClicked,
  setGlobalClicked,
}) {

  useEffect(() => {
    loadGlobalTable();
  }, []);

  if (!globalClicked) {
    return null;
  }

  /**
   * This function shows the user table instead of the global table.
   */
  const showUserTable = () => {
    setUserClicked(true);
    setGlobalClicked(false);
  };

  return (
    <div className="global-container" id="global-container-id">
      <h1 className="global-header" id="global-table-last-row-id">
        These are the 7 most popular flavours!
        </h1>
      <div className="global-tab-container">
        <ul>
          <li>
            <h1 onClick={showUserTable} className="global_user-tab" id="global_user-tab-id">User</h1>
          </li>
          <li>
            <h1 className="global_global-tab" id="global_global-tab-id">
              Global
              </h1>
          </li>
        </ul>
      </div>
      <div className="global-info-container">
        <div className="global-table-container">
          <table className="global-table" id="global-table-id">
            <thead className="global-table-head" id="global-table-head-id">
              <tr>
                <td>Flavour</td>
                <td>Total Count</td>
              </tr>
            </thead>
            <tbody className="global-table-body" id="global-table-body-id">
              {listOfGlobalPurchases.map((onePurchase, index) => {
                return (
                  <tr className="global-table-body-row" key={index}>
                    <td>{onePurchase.flavour}</td>
                    <td>{onePurchase.total_count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GlobalTable;
