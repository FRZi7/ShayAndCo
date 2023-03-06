if(process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

const bodyParser = require('body-parser')
const express = require("express")
const app = express()
const expressLayouts = require('express-ejs-layouts')
const nocache = require("nocache");
const userRouter  = require ("./routes/userRoute")
const adminRouter = require("./routes/adminRoute")
const path = require('path');
const session  = require("express-session")
const multer  = require('multer')
const flash = require("connect-flash")


app.use(nocache());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.set(express.static(path.join(__dirname,"/public")))
app.set("view engine","ejs")
app.set("views",__dirname+"/views")
app.use(session({secret:"Key", resave:true, saveUninitialized: true,cookie:{maxAge:6000000}}))
app.use(flash())

//multer👇
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/img')
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    },
    
  })
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/webp'
    ) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }

  app.use(
    multer({ storage: fileStorage, fileFilter }).fields([
      { name: 'image' },
      { name: 'productImage', maxCount: 3 }
    ])
  )



//WHERE OUR layout FILES WILL BE SO REPLICATION WILL BE REDUCED 👇
app.set("layout","layouts/layout")
app.use(expressLayouts)


//bringing in mongoose
 const mongoose = require("mongoose")
const userModel= require("./models/userModels")

mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser : true
})
const db = mongoose.connection
mongoose.set('strictQuery', true);
db.on("error",error => console.error(error))
db.once("open",()=>console.log("connected to mongoose"))


//applying routers to users and admin
app.use("/",userRouter)
app.use("/admin",adminRouter)

//WHERE OUR PUBLIC FILES WILL BE 👇
app.use(express.static('public'))

app.listen(process.env.PORT || 9999,()=>{
    console.log(`server started http://localhost:9999`);
})