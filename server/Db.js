/**
 * The module contains the setup to use seqeulize.
 */

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: "mysql",
  host: process.env.DB_HOSTNAME,
});

module.exports = {sequelize, Sequelize};
