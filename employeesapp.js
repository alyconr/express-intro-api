const express = require('express');
const app = express();
const employees = require('./api/employees');
const fs = require('fs');
const router = express.Router();
const jsonSchema= require('jsonschema');





app.use(express.json());





   
//1. Get the content of the employees.json file that is attached to the statement

router.get ('/api/employees', (req, res) => {
      res.json(employees);
    });


// 2  Return the first 2 employees from the employees.json file with the query ?page=1 and Return the second and third employees from the employees.json file with the query ?page=2 


router.get ('/api/emplooyees', (req, res) => {
    
    const page = req.query.page;
    const limit = 2;
    const start = (page - 1) * limit;
    const end = page * limit;
    const employeesPage = employees.slice(start, end);
    res.json(employeesPage);
   
    
});

//3. Return the firsr 2 employees From Item 0 to Item 1 of the employees.json file

router.get ('/api/employess', (req, res) => {
    const page = req.query.page;
    const limit = (2*(page-1))+1;
    const start = (2*(page - 1));
    const end = page * limit; 
    const employeesPage = employees.slice(start, end);
    res.json(employeesPage);
   
    


});



//4 Return  the corresponding individual object to the oldest employee in the employees.json file


router.get ('/api/employees/oldest', (req, res) => {
    const oldest = Math.max (...employees.map(employee => employee.age));
    const oldestEmployee = employees.find(employee => employee.age === oldest);
    res.json(oldestEmployee);
   
    
});

5//Return list of employees with privileges == "user"

router.get ('/api/employee', (req, res) => {
    const user = req.query.user;
    if (user === 'true') {
       
        const employeesUser = employees.filter(employee => employee.privileges === 'user');
        res.json(employeesUser);
    }
});



6// Add and Item to the employees.json file. It will be validated that the body complies with the same JSON schema as the employees.json file.

router.post ('/api/employees', (req, res) => {
   const newEmployee = {
    name: req.body.name,
    age: req.body.age,
    phone: {
      personal: req.body.phone.personal,     
      work: req.body.phone.work,
      ext: req.body.phone.ext
    },
    privilages: req.body.privilages,
    favorites: {
        artist: req.body.favorites.artist,
        food: req.body.favorites.food
    },
    finished: [
        req.body.finished[0],
        req.body.finished[1],
    ],
    badges: [
        String(req.body.badges[0]),
        String(req.body.badges[1]),
    ],
    points : [
        {
            points: req.body.points[0].points,
            bonus: req.body.points[0].bonus
        },
        {
            points: req.body.points[1].points,
            bonus: req.body.points[1].bonus
        }
    ]
    };     
   

    const schema = fs.readFileSync('./api/employees.json');
    const validate = require('jsonschema').validate;
    const result = validate(newEmployee, schema);
    if (result.errors.length > 0) {
        res.status(400).json(result.errors);
    } else {
        employees.push(newEmployee);
        res.json(employees);
    }
});

7// Return the employees list that includes black in the badges atrrribute.

router.get('/api/employes', (req, res) => {
    const badges = req.query.badges;
    if (badges === 'black') {
        const employeesBadges = employees.filter(employee => employee.badges.includes('black'));
        res.json(employeesBadges);
    } else {
        res.json(employees);
    }
});

8// Return employees object whose name is equal Name. Name can take different values. If the user is not found , return an error message.

/router.param ('name', (req, res, next, name) => {
    const employee = employees.find(employee => employee.name === name);
    if (employee) {
        req.employee = employee;
        next();
    } else {
        res.status(404).send({ 'code': 'Employee not found'});
    }
});

router.get ('/api/employees/:name', (req, res) => {
    res.json(req.employee);
});


module.exports = router;