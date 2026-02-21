const express = require('express');
const cors = require('cors');
const mongoDB = require('../backend/db'); 
const CreateUser = require('../backend/Routes/CreateUser');
const DisplayData = require('./Routes/DisplayData');
const OrderData = require('./Routes/OrderData');

const app = express();
const port = 5000;

app.use(cors({
  origin: "*", // reflect request origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.options("*", cors()); // handle preflight


app.use(express.json());

const startServer = async () => {
  await mongoDB(); 

  app.use('/api', CreateUser);

  app.use('/api', DisplayData);

  app.use('/api', OrderData);

  app.get('/', (req, res) => {
    res.send("Hello World from Express!");
    
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

startServer();


