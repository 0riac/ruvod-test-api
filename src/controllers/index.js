const jwt = require('jsonwebtoken');
const { Client } = require('schemes');
const githubAuth = require('./githubauth');

const me = async (req, res) => {
  if (req.client) {
    res.send(req.client);
  } else {
    res.status(401).send('/me not authorized');
  }
}

const authMiddleware = async (req, res, next) => {
  const token = req.cookies[process.env.JWT_TOKEN_NAME];

  if (token) {
    const { id } = jwt.decode(token, process.env.JWT_TOKEN_SECRET);
    const client = await Client.findOne({ _id: id }).lean();

    if (client) {
      req.client = client;
      next();
    } else {
      res.status(401).send('not authorized');
    }
  } else {
    res.status(401).send('not authorized');
  }
}

const logOut = async (req, res) => {
  res.cookie(process.env.JWT_TOKEN_NAME, '')
  res.send('ok');
}

const authClient = (res, client) => {
  const token = jwt.sign({ id: client._id }, process.env.JWT_TOKEN_SECRET);
  res.cookie(process.env.JWT_TOKEN_NAME, token, { maxAge: 9000000, httpOnly: true });
  return token;
}

const checkAuth = async (req, res) => {
  const token = req.cookies[process.env.JWT_TOKEN_NAME];

  if (token) {
    const { id } = jwt.decode(token, process.env.JWT_TOKEN_SECRET);
    const client = await Client.findOne({ _id: id }).lean();

    if (client) res.send(client);
    else res.status(401).send('not authorized');
  } else {
    res.status(401).send('not authorized');
  }
}

const auth = async (req, res) => {
  const { body: { email, password } } = req;

  const client = await Client.findOne({ email });

  if (client && client.authenticate(password)) {
    const token = authClient(res, client);
    res.send({ token, client });
  }

  res.status(401).send('not authorized');
}

const createClient = async (req, res) => {
  const { body: { email, password, name } } = req;

  const client = await Client.findOne({ email });

  if (!client) {
    const client = new Client({ email, password, name });
    client.save((err, client) => {
      if (!err) {
        const token = authClient(res, client);
        res.send({ client, token });
      } else {
        res.status(500).send(err);
      }
    });
  } else {
    res.status(400).send('client already exist');
  }
}

const afterWebauthn = async (req, res) => {
  const user = req.user;

  const client = await Client.findOne({ email: user.username });

  if (!client) {
    const newClient = new Client({ email: user.username, name: user.displayName });
    newClient.save((err, client) => {
      if (!err) {
        const token = authClient(res, client);
        res.send({ client, token });
      } else {
        res.status(500).send(err);
      }
    });
  } else {
    const token = authClient(res, client);
    res.send({ client, token });
  }
}

const githubMiddleware = githubAuth(process.env.GITHUB_ID, process.env.GITHUB_SECRET, { authAny: true });

const githubAuthMiddleware = async (req, res) => {
  const { github } = req;

  if (github.authenticated) {
    const existClient = await Client.findOne({ github_id: github.user.id });

    if (existClient) {
      authClient(res, existClient);
      res.redirect(`${process.env.APP_URL}${process.env.APP_URL_SUBPATH}`);
    } else {
      const client = new Client({ name: github.user.login, github_id: github.user.id, email: '' });
      client.save((err, client) => {
        if (!err) {
          authClient(res, client);
          res.redirect(`${process.env.APP_URL}${process.env.APP_URL_SUBPATH}`)
        } else {
          res.redirect(`${process.env.APP_URL}${process.env.APP_URL_SUBPATH}/login`);
        }
      });
    }
  } else {
    res.redirect(`${process.env.APP_URL}${process.env.APP_URL_SUBPATH}/login`);
  }
}

module.exports = {
  checkAuth,
  auth,
  createClient,
  authMiddleware,
  logOut,
  me,
  githubMiddleware,
  githubAuthMiddleware,
  afterWebauthn,
}
