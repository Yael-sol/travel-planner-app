const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const getRoutes = require('./routes/get');
const postRoutes = require('./routes/post');
const putRoutes = require('./routes/put');
const deleteRoutes = require('./routes/delete');
const verifyToken = require('./verifyToken');
const app = express();
const PORT = 3001;

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,               
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(verifyToken);
app.use('/', getRoutes);
app.use('/', postRoutes);
app.use('/', putRoutes);
app.use('/', deleteRoutes);

app.listen(PORT, () => {
  console.log(`The server runs on port: ${PORT}`);
});
