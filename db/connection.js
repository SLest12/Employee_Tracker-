const mysql=require('mysql2');
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Junior11%',
    database:'employee_trackerDB'
});
connection.connect(function(err){
    if(err) throw err;
 
});
module.exports=connection;