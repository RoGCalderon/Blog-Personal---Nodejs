const express = require ('express')
const mongoose = require ('mongoose')
require('dotenv').config()
const Article = require('../models/article') //esto trae todo el esquema
const articleRouter = require('../routes/articles')
const methodOverride = require('method-override')
const menuRouter = require('../routes/menu')
const loginRouter = require('../routes/login')

const app = express() //inicializar express
const port = process.env.PORT || 3000 // si el puerto no está definido toma el 3000

app.set('view engine', 'ejs') //estamos utlizando ejs
app.use(express.urlencoded({extended: false})) // analiza las request entrantes con cargas utiles. Es como body parser
app.use(methodOverride('_method')) //_method se usa para lo privado u oculto

//ruta principal Home
app.get('/', async(req,res)=>{
    const articles = await Article.find().sort({
        createAt:"desc" //en orden descendente. va a traer primero lo más nuevo
    })
    res.render('articles/index', {articles: articles})  //pasamos la vista y el articulo 

})

//MongoDB connection - conexión a base de datos

mongoose
    .connect(process.env.MONGODB_URI)
    .then(()=> console.log('conectado a MongoDB Atlas'))
    .catch((err)=>console.error(err)) //captura el error, si lo recibe lo muestra por consola

app.use('/articles',articleRouter);
app.use('/public/', express.static('./public/'))
app.use('/menu', menuRouter);
app.use('/login', loginRouter)

app.listen(port,
    ()=> console.log(`Servidor escuchando en el puerto ${port}`)
)