const express = require('express')
const router = express.Router()

router.get('/about',(req,res)=>{
    res.render('/menu/about')
})

router.get('/imagenes',(req,res)=>{
    res.render('/menu/imagenes')
})

router.get('/info',(req,res)=>{
    res.render('/menu/imagenes')
})
router.get('/videos',(req,res)=>{
    res.render('/menu/imagenes')
})


module.exports = router;
