
const express = require('express')
const app = express()
const port = 3000
const path = require('path'); 
const router = require("./routers")
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views')); 
app.use(express.urlencoded({ extended: true })); 



app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
/**
 * npx sequelize-cli model:generate --name User --attributes email:string,password:string,role:string
 */