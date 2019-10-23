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
mongoose.connect('mongodb://localhost:47190/auth', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// App Setup
const app = express();

const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
