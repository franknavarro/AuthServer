// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
const whitelist = require('./config').whitelist;

// DB Setup
const mongoPort = 47190;
mongoose
  .connect(`mongodb://localhost:${mongoPort}/auth`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to DB on port ${mongoPort}`);
  });

// App Setup
const app = express();

const corsOptions = {
  origin: whitelist,
};
app.use(cors(corsOptions));

// Used for logging request to console
app.use(morgan('combined'));

// Any incoming request will be parsed as json
app.use(bodyParser.json({ type: '*/*' }));

router(app);

// Server Setup
const port = process.env.PORT || 47405;
const server = http.createServer(app);
server.listen(port, () => console.log(`Listiengin on port ${port}`));
