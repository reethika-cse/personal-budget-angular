const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use('/', express.static('old-code'));

const budget = require('./budget.json');
app.get('/budget', (req, res) => {
    res.json(budget);
});

app.use(cors());

app.listen(port, () => {
    console.log(`API app listening at http://localhost:${port}`);
});