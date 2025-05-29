const express = require('express');
const router = express.Router();
const dataService = require('../../BL/bl');
const jwt = require('jsonwebtoken');
const { writeLog } = require('../../log'); 

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await dataService.verifyLogin(username, password);
    if (!user) {
      writeLog(`Failed login attempt for username=${username}`, 'warn');
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const ip = req.ip;
    const accessToken = jwt.sign({ id: user.id, username: user.username, ip }, ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '1d' });
    writeLog(`User logged in successfully: username=${username}, ip=${ip}`, 'info'); 
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 1 * 24 * 60 * 60 * 1000
      })
      .json({ user, token: accessToken });
  } catch (err) {
    console.error(err);
    writeLog(`Login error for username=${req.body.username} - ${err.message}`, 'error'); 
    res.status(500).json({ error: 'Login error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const user = await dataService.registerNewUser(req.body);
    const ip = req.ip;
    const accessToken = jwt.sign({ id: user.id, username: user.username, ip }, ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '1d' });
    writeLog(`User registered successfully: username=${user.username}, ip=${ip}`, 'info');
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 1 * 24 * 60 * 60 * 1000
      })
      .status(201)
      .json({ user, token: accessToken });
  } catch (err) {
    console.error(err);
    writeLog(`Registration error for username=${req.body.username} - ${err.message}`, 'error'); 
    res.status(400).json({ error: err.message });
  }
});

router.post('/refresh', (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    writeLog('Refresh token missing in request', 'warn');
    return res.sendStatus(401);
  }
  jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
    if (err) {
      writeLog('Invalid refresh token', 'warn'); 
      return res.sendStatus(403);
    }
    const ip = req.ip;
    const newAccessToken = jwt.sign({ id: decoded.id, ip }, ACCESS_SECRET, { expiresIn: '1d' });
    writeLog(`Access token refreshed for userId=${decoded.id}, ip=${ip}`, 'info');
    res.json({ token: newAccessToken });
  });
});

router.post('/logout', (req, res) => {
  writeLog('User logged out', 'info'); 
  res.clearCookie('refreshToken');
  res.status(200).json({ message: "Logged out" });
});

router.post('/:table', async (req, res) => {
  try {
    const body = addUserIdCondition(req);
    const created = await dataService.createItem(req.params.table, body);
    writeLog(`Created new item in table=${req.params.table} with data=${JSON.stringify(body)}`, 'info'); 
    res.status(201).json({ message: 'Created successfully', result: created });
  } catch (err) {
    console.error(err);
    writeLog(`ERROR creating item in table=${req.params.table} - ${err.message}`, 'error'); 
    res.status(500).json({ error: `ERROR inserting into ${req.params.table}` });
  }
});

router.post('/:parentTable/:parentId/:childTable', async (req, res) => {
  try {
    const parentField = `${req.params.parentTable.slice(0, -1)}_id`;
    const baseData = addUserIdCondition(req);
    const data = {
      ...baseData,
      [parentField]: req.params.parentId
    };
    const created = await dataService.createItem(req.params.childTable, data);
    writeLog(`Created new child item in table=${req.params.childTable} with parentId=${req.params.parentId} and data=${JSON.stringify(data)}`, 'info');
    res.status(201).json({ message: 'Created successfully', result: created });
  } catch (err) {
    console.error(err);
    writeLog(`ERROR creating child item in table=${req.params.childTable} - ${err.message}`, 'error'); 
    res.status(500).json({ error: `ERROR inserting into ${req.params.childTable}` });
  }
});

const addUserIdCondition = (req) => {
  const body = { ...req.body };
  if (body.user_id === 'null') {
    body.user_id = req.user?.id;
  }
  return body;
};

module.exports = router;
