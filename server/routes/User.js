const express = require("express");
const router = express.Router();
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../Db");
const { validateToken } = require("../middlewares/AuthMiddleware");


/**
 * This route retreives all of the purchases made by the user with id "id".
 * The returned flavours are ordered by date, then alphabetically.
 * 
 * @param userId: id of the user we are retreiving purchase information from
 * @returns a response consisting of the purchases made by the user with id "id" 
 *          ordered by date (most recent comes first).
 *          In the event of two purchases having the same date, 
 *          they will be ordered alphabetically.
 */
router.get("/purchase/:userId", validateToken, async (req, res) => {
  const { userId } = req.params;
  const query =
    "SELECT * FROM purchases where userId = ? ORDER BY date DESC, flavour";
  result = await sequelize.query(query, {
    replacements: [userId],
    type: QueryTypes.SELECT,
  });
  res.json(result);
});

/**
 * This route retrieves the purchase with purchaseId of "purchaseId" 
 * from the user with an id of "id". 
 * 
 * @param userId: id of the user we are retreiving purchase information from
 * @param purchaseId: id of the purchase we are retreiving information from
 * @returns a response containing the purchase with purchaseId of "purchaseId" 
 *          from the user with an id of "id". 
 */
router.get("/purchase/:userId/:purchaseId", validateToken, async (req, res) => {
  const { userId, purchaseId } = req.params;
  const query =
    "SELECT * FROM purchases where userId = ? AND id = ?";
  const result = await sequelize.query(query, {
    replacements: [userId, purchaseId],
    type: QueryTypes.SELECT,
  });
  res.json(result);
});

/**
 * This route retrieves the 7 most popular flavours, 
 * where the first element returned is the most popular, and where 
 * popularity is based on number of purchases recorded for that flavour.
 * 
 * @returns a response containing the 7 flavours, 
 *          along with the total number of purchases for those flavours,
 *          with the highest total number of purchases
 */
router.get("/purchase", validateToken, async (req, res) => {
  const query =
    "SELECT flavour, SUM(quantity) as total_count FROM purchases GROUP BY flavour ORDER BY total_count DESC, flavour LIMIT 7";
  const result = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
  res.json(result);
});

/**
 * This route adds a purchase for the user with an id of "userId"
 * 
 * @body flavour: flavour of the purchase to be added
 * @body quantity: quantity of the purchase to be added
 * @body price: price of the purchase to be added
 * @body date: date of the purchase to be added
 * @body location: location of the purchase to be added
 * @body userId: id of the user who is making this purchase
 */
router.post("/purchase", validateToken, async (req, res) => {
  const { flavour, quantity, price, date, location, userId } = req.body;

  const query =
    "INSERT INTO purchases (flavour, price, quantity, date, location, userId) VALUES (?, ?, ?, ?, ?, ?)";
  let result;

  result = await sequelize.query(query, {
    replacements: [flavour, price, quantity, date, location, userId],
    type: QueryTypes.INSERT,
  });
  res.json(result);
});

/**
 * This route edits a purchase with the purchaseId of "purchaseId" for the user with id "id".
 *  
 * @body flavour: new flavour of the purchase to be edited
 * @body quantity: new quantity of the purchase to be edited
 * @body price: new price of the purchase to be edited
 * @body date: new date of the purchase to be edited
 * @body location: new location of the purchase to be edited
 * @body userId: id of the user who is editing this purchase
 * @body purchaseId: id of purchase to be edited
 */
router.put("/purchase", validateToken, async (req, res) => {
  const {
    flavour,
    quantity,
    price,
    date,
    location,
    userId,
    purchaseId,
  } = req.body;

  const query =
    "UPDATE purchases SET flavour = ?, price = ?, quantity = ?, date = ?, location = ?, userId = ? WHERE id = ?";
  const result = await sequelize.query(query, {
    replacements: [
      flavour,
      price,
      quantity,
      date,
      location,
      userId,
      purchaseId,
    ],
    type: QueryTypes.UPDATE,
  });
  res.json(result);
});

/**
 * This route deletes a purchase with the purchaseId of "purchaseId" for the user with id "id". 
 * 
 * @param userId: id of the user we are retreiving purchase information from
 * @param purchaseId: id of the purchase we are retreiving information from
 */
router.delete("/purchase/:userId/:purchaseId", validateToken, async (req, res) => {
  const { userId, purchaseId } = req.params;
  const query = "DELETE from purchases WHERE UserId = ? AND id = ? ";
  const result = await sequelize.query(query, {
    replacements: [userId, purchaseId],
    type: QueryTypes.DELETE,
  });
  res.json({ success: true });
}
);

/**
 * This route returns all the purchases of the user with id "id",
 * made in the last "time" variable, 
 * where time can be month, week, year, etc.
 * 
 * @param id: id of the user we are retreiving purchase information from
 * @param time: the duration from which we will return purchase information from. 
 *              Can be month, week, day, year, etc.
 * @returns a response containing all the purchases of the user with id "id",
 *          made in the last "time" variable, 
 *          where time can be month, week, year, etc.
 */
router.get("/orderByTime/:id/:time", validateToken, async (req, res) => {
  const { id, time } = req.params;
  const queryMonth =
    "SELECT *" +
    "FROM purchases " +
    "WHERE MONTH(date) = MONTH(CURRENT_DATE()) " +
    "AND YEAR(date) = YEAR(CURRENT_DATE()) " +
    "AND UserId = ? ";
  const queryWeek =
    "SELECT * from purchases WHERE YEARWEEK(date) = YEARWEEK(NOW()) AND UserId = ? ";
  const queryDay =
    "SELECT * FROM purchases " +
    "WHERE date >= CURDATE() " +
    "AND date < CURDATE() + INTERVAL 1 DAY " +
    "AND UserId = ? ";
  const queryYear =
    "SELECT * " +
    "FROM purchases " +
    "WHERE YEAR(date) = YEAR(CURRENT_DATE()) " +
    "AND UserId = ? ";

  let query;
  if (time === "month") {
    query = queryMonth;
  } else if (time === "week") {
    query = queryWeek;
  } else if (time === "day") {
    query = queryDay;
  } else {
    query = queryYear;
  }

  const result = await sequelize.query(query, {
    replacements: [id],
    type: QueryTypes.SELECT,
  });
  res.json(result);
});

/**
 * This route returns all the purchases of the user with id "id",
 * ordered by highest price to lowest price or vice versa depending 
 * on the direction paramater. 
 * 
 * @param id: id of the user we are retreiving purchase information from
 * @param direction: the direction of how the purchases are returned, 
 *                   either ascending price, or descending price.
 * @returns a response containing all the purchases of the user with id "id",
 *          ordered by price (descending or ascending, depending on the direction variable)
 */
router.get("/orderByPrice/:id/:direction", validateToken, async (req, res) => {
  const { id, direction } = req.params;
  let query;
  direction === "ascending"
    ? (query =
      "SELECT * FROM purchases WHERE UserId = ? ORDER BY price ASC, flavour ASC")
    : (query =
      "SELECT * FROM purchases WHERE UserId = ? ORDER BY price DESC, flavour ASC");

  const result = await sequelize.query(query, {
    replacements: [id],
    type: QueryTypes.SELECT,
  });
  res.json(result);
});

/**
 * This route returns all the purchases that has the flavour "flavour" of the user with id "id",
 * ordered by lowest price to the highest price. Orders with a location specified will be
 * prioritized (returned earlier, and thus higher in the chart displayed in the UI) 
 * to show users where the cheapest locations of a particular flavour is.
 * 
 * @param id: id of the user we are retreiving purchase information from
 * @param flavour: the flavour of the purchases returned
 * @returns a response containing all the purchases with flavour "flavour" of the user with id "id",
 *          ordered from location is specified to no location specified, 
 *          then by price, from lowest to highest.
 */
router.get("/orderByFlavour/:id/:flavour", validateToken, async (req, res) => {
  const { id, flavour } = req.params;
  const query =
    "(SELECT *, 1 as SortKey " +
    "FROM purchases " +
    "WHERE flavour = ? AND UserId = ? AND location != '' " +
    "ORDER BY price ASC, flavour ASC) " +
    "UNION " +
    "(SELECT *, 2 as SortKey " +
    "FROM purchases " +
    "WHERE flavour = ? AND UserId = ? AND location = '' " +
    "ORDER BY price ASC, flavour ASC) " +
    "ORDER BY SortKey, price ASC, flavour ASC, location ASC ";

  const result = await sequelize.query(query, {
    replacements: [flavour, id, flavour, id],
    type: QueryTypes.SELECT,
  });
  res.json(result);
});

module.exports = router;
