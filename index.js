const express = require('express');
const app = express();
app.use (express.json());


const employeesApp = require('./employeesapp');


app.use('/', employeesApp);


app.listen(8000, () => {
    console.log('Server is running on port 8000');
});


