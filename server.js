require("console.table")


const { prompt} = require('inquirer');
const db = require('./db/connection');
const { up } = require('inquirer/lib/utils/readline');
function startPrompt () {

//function promtpUser(){
  prompt([
    {
    type: 'list',
    name: 'choice',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees', 
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      "quit",
    ]
  }]).then( (answer) => {
console.log(answer.choice);
  switch(answer.choice) {
    case 'View all departments': 
      // call viewDepartments()
      viewDepartments();
      break;

    case 'View all roles':
      viewRoles();
      break;
    
    case 'View all employees':
      viewEmployees();
      break;

    case 'Add a department':
      addDepartment();
      break;
    

    case 'Add a role':
     addRole();
     break;

    case 'Add an employee':
      addEmployee();
      break;

    case 'Update an employee role':
      updateEmployeeRole();
      break;
    
    default:
      process.exit(0);
  }
})
}

startPrompt();


// Inside the switch case for 'View all departments'

async function viewDepartments() {

    // Query database and get departments
  
    const departments = await db.promise().query('SELECT * FROM departments;'); 
  
    // Log departments as a table
  
   // console.log('\n ',departments[0])
    console.table(departments[0]);
  
    // Restart prompt
  
    startPrompt();
  
  }
  
 // viewDepartments();

  // Inside 'View all roles' case:

async function viewRoles() {

    const roles = await db.promise().query(`
      SELECT role.id, role.title, department.name AS department, role.salary 
      FROM roles role
      LEFT JOIN departments department on role.department_id = department.id
    `);
  
    console.log('\n');  
    console.table(roles[0]);
  
    startPrompt();
  }
  
  //viewRoles();
  
  // Inside 'View all employees' case:

async function viewEmployees() {

    const employees = await db.promise().query(`
      SELECT 
        e.id, 
        e.first_name, 
        e.last_name,
        r.title AS job_title,
        d.name AS department,
        r.salary, 
        m.first_name AS manager_first_name,
        m.last_name AS manager_last_name
      FROM employee e
      LEFT JOIN roles r ON e.role_id = r.id 
      LEFT JOIN departments d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id
    `);
  
    console.log('\n');
    console.table(employees[0]);
  
    startPrompt();
  
  }
  
  //viewEmployees();

  // Inside 'Add a department' case:


async function addDepartment() {

    const departmentName = await prompt({
      name: 'name', 
      message: 'Enter the department name:'
    });
  
//add department to database
    await db.promise().query(`
      INSERT INTO departments (name) 
      VALUES ('${departmentName.name}')
    `);
  
    console.log(`Added ${departmentName.name} to the database.`);
  
    startPrompt();
  
  }
  
  //inside addEmployee
  async function addEmployee() {

    const employeeName = await prompt([
      {
      name: 'firstName',
      type: 'input',
      message: 'Enter the new employees first name:'
    },
    {
      name: 'lastName',
      type: 'input',
      message: 'Enter the new employees last name:'
    },
    {
      name: 'roleId',
      type: 'input',
      message: 'Enter the new employees roleId:'
    },
    {
      name: 'managerId',
      type: 'input',
      message: 'Enter the new employees managerId:'
    },
  ]);
  

    await db.promise().query(`
    INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
      ('${employeeName.firstName}', '${employeeName.lastName}',${employeeName.roleId},${employeeName.managerId});
    `);
  
    console.log(`Added ${employeeName.firstName} to the database.`);
  
    startPrompt();
  
  }

    //inside addRole
    async function addRole() {

      const roleName = await prompt([
        {
        name: 'title', 
      type: 'input',
        message: 'Enter the role title:'
      },
      {
        name: 'salary', 
      type: 'input',
        message: 'Enter the role salery:'
      },
      {
        name: 'department_id', 
      type: 'input',
        message: 'Enter the role department_id:'
      },
    ]);
    
  
      await db.promise().query(`
        INSERT INTO roles (title, salary, department_id)  VALUES ('${roleName.title}', ${roleName.salary}, ${roleName.department_id});`)
      
     
      console.log(`Added new role to the database.`);
    
      startPrompt();
    
    }

    
async function updateEmployeeRole() {

  const updateEmployeeRole = await prompt([{
    name:'employee', 
    type:'input',
    message:'Enter employees id'
  },
  {
    name:'role', 
  type:'input',
    message:'Enter the roleid:'
  }]
  );

//add department to database
  await db.promise().query("UPDATE employee SET role_id = ? WHERE id = ?",[updateEmployeeRole.role, updateEmployeeRole.employee]
  

  );
  console.log(`Added to the database.`);

  startPrompt();

}


// //////
// updateEmployeeRole(employeeId, roleId) {
//   return this.connection.promise().query(
//     "UPDATE employee SET role_id = ? WHERE id = ?",
//     [${roleId, employeeId]
//   );
// }






// Update an employee's role
//function updateEmployeeRole() {
//   db.findAllEmployees()
//     .then(([rows]) => {
//       let employees = rows;
//       const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
//         name: `${first_name} ${last_name}`,
//         value: id
//       }));

//       prompt([
//         {
//           type: "list",
//           name: "employeeId",
//           message: "Which employee's role do you want to update?",
//           choices: employeeChoices
//         }
//       ])
// .then(res => {
//           let employeeId = res.employeeId;
//           db.findAllRoles()
//             .then(([rows]) => {
//               let roles = rows;
//               const roleChoices = roles.map(({ id, title }) => ({
//                 name: title,
//                 value: id
//               }));

//               prompt([
//                 {
//                   type: "list",
//                   name: "roleId",
//                   message: "Which role do you want to assign the selected employee?",
//                   choices: roleChoices
//                 }
//               ])
//                 .then(res => db.updateEmployeeRole(employeeId, res.roleId))
//                 .then(() => console.log("Updated employee's role"))
//                 .then(() => loadMainPrompts())
//             });
//         });
//     })
// }
    