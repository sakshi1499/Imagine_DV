const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const http=require('http')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.json())
app.set('view engine','ejs')
app.use(express.static("public"))
const methodOverride=require("method-override")
app.use(methodOverride("_method"))
const errorHandler=require('./handlers/error')
const authRoutes = require("./routes/auth");

const User=require("./models/User")

const Post=require("./models/posts")


const server = http.createServer(app)
const port=process.env.PORT||3000;
var reload = require('reload');


app.use("/", authRoutes);

reload(server, app);

app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(errorHandler);


server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
