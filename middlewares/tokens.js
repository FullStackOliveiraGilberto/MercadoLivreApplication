const meli = require('mercadolibre');
require('dotenv').config();

const { CLIENT_ID, CLIENT_SECRET } = process.env;

const tokens = {
  access_token: null,
  expires: null,
};

const setTokens = (newTokens) => {
  const date = new Date();
  const time_threshold = 6; // o token do mercadolivre dura até 6 horas
  date.setHours(date.getHours() + time_threshold, 0, 0, 0);
  tokens.expires = date;
  tokens.access_token = newTokens.access_token;
};

const validateToken = (req, res, next) => {
  if (!tokens.access_token || (new Date()) >= tokens.expires) {
    const redirect_uri = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
    res.send(redirect_uri);
    return;
    const { code } = req.query;
    const meliObject = new meli.Meli(CLIENT_ID, CLIENT_SECRET);
    if (code) {
      meliObject.authorize(code, redirect_uri, (error, response) => {
        if (error) {
          throw error;
        }
        setTokens(response);
        res.locals.access_token = tokens.access_token;
        res.redirect(redirect_uri);
      });
    } else {
      res.redirect(meliObject.getAuthURL(redirect_uri));
    }
  } else {
    res.locals.access_token = tokens.access_token;
    next();
  }
}

module.exports = {
  validateToken
};