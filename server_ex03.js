require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

const carRoutes = require('./routes/carsRoutes');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use("/", express.static(path.join(__dirname, "public")));



app.use('/cars', carRoutes);

app.listen(PORT, () => {
  console.log(`SERVER IS LISTENING NOW: http://localhost:${PORT}`);
})
