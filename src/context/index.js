const epxressContext = ({ req, res }) => {
  return {
    req: req,
    client: req.client,
    res
  }
}

module.exports = epxressContext;
