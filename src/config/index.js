module.exports = Object.assign({
  cors: {
    origin: 'https://0riac.github.io',
    credentials: true
  }
}, require(`./env/${process.env.NODE_ENV}`));
