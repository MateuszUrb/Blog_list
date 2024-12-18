function handleUnknownEndpoint(req, res) {
  res.status(404).json({ error: "Unknown endpoint" });
}

function errorHandler(error, req, res, next) {
  if (error.name === "CastError") {
    return res.status(400).json({ error: "uncorrect  data" });
  }
}

module.exports = {
  handleUnknownEndpoint,
  errorHandler,
};
