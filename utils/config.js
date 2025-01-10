require("dotenv").config();

const PORT = 3003;
const MONGOODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGOODB_URI
    : process.env.MONGOODB_URI;

module.exports = {
  PORT,
  MONGOODB_URI,
};
