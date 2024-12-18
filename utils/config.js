require("dotenv").config();

const PORT = 3003;
const MONGOODB_URI = process.env.MONGOODB_URI;

module.exports = {
  PORT,
  MONGOODB_URI,
};
