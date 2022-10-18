const express = require('express')
const Article = require('../models/article') //para pasar la data por parámetros a través de las rutas
const router = express.Router()

router.get('/new',(req,res)=>{
    res.render('articles/new', {article : new Article()}) //renderiza la vista de new - Pasamos el parámetro
})

// Ruta para renderizar el Articulo a Editar
router.get("/edit/:id", async (req, res, next) => {
    const article = await Article.findById(req.params.id);
    res.render("articles/edit", { article: article });
  });

// Obtenemos el Articulo con Slug aplicado
router.get("/:slug", async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    if (article == null) res.redirect("/");
    res.render("articles/show", { article: article });
  });
  

//Creamos nuevo articulo
router.post('/', async(req,res,next)=>{
    req.article = new Article()
    next()
},saveArticleAndRedirect('new')) //llamo a la func y paso como parámetro el path de new

// Editamos Articulo x ID
router.put("/:id",async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
  },
  saveArticleAndRedirect("edit"));

//Eliminar artículo por ID
router.delete('/:id',async(req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    //acá se puede poner una ventana modal, para indicar que se eliminó
    res.redirect('/') //redirecciona a la home
})

//Guardar Articulo y redireccionar
function saveArticleAndRedirect(path){
    return async(req,res)=>{ //es asíncrono porque trabaja con la base de datos
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        try{
            article = await article.save()
            res.redirect(`/articles/${article.slug}`) //redirecciona
        }catch(e){
            res.render(`articles/${path}`,{article: article})
        }
    }
}


module.exports = router;