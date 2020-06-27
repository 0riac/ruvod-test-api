module.exports = Object.assign({
  cors: {
    origin: 'https://0riac.github.io/ruvod-test',
    credentials: true
  }
}, require(`./env/${process.env.NODE_ENV}`));
