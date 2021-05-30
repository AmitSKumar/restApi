const ejs = require("ejs");
const express =require("express");
const mongoose= require("mongoose");
const app = express();
app.set('view engine', 'ejs');
mongoose.connect('mongodb://127.0.0.1:27017/wikiDb',{useNewUrlParser:true},{ useUnifiedTopology: true } );
const articleSchema =mongoose.Schema({
    title:String,
    content:String
})

const Article= mongoose.model('Article',articleSchema);


app.use(express.urlencoded({extended:true}));
app.use(express.static("Public"))

//chaining of route in express
app.route('/articles').get((req,res)=>{
    Article.find({},(err,foundArticles)=>{
        if(!err){
            res.send(foundArticles);
        }
    })
    }).post((req,res)=>{
        const article = new Article({
            title:req.body.title,
           content :req.body.content
        });
        article.save((err)=>{
            if(!err){
                res.send("saved sucessfully")
            }else{
                res.send(err)  
            }
        });
    }).delete((req,res)=>{
        Article.deleteMany({},(err)=>{
            if(!err){
                res.send("saved sucessfully");
            }else{
                res.send(err);
            }
        })
    });

    app.route('/articles/:articleTitle')
    .get((req,res)=>{
        Article.findOne({title:req.params.articleTitle},(err,foundArticle)=>{
            if(foundArticle){
                res.send(foundArticle);
            }
            else{
                res.send(err)
            }
        })
    })
    .put((req,res)=>{
        Article.update(
            {title:req.params.articleTitle},
            {title:req.body.title, content:req.body.content},
            {overwrite:true},
            (err)=>{
                if(!err){
                    res.send("updated successfully")
                }
                else{
                    console.log(err)
                }
                
            }
            )
    })
    .patch((req,res)=>{
        Article.update(
            {title:req.params.articleTitle},
            {$set:req.body},
            (err)=>{
                if(!err){
                    res.send("updated patch successfully")
                }
            }
        )
    })
    .delete((req,res)=>{
        Article.deleteOne({title:req.params.articleTitle},(err)=>{
            if(!err){
                res.send("deleted sucessfully")
            }
        })
    })
//fetch all from db.
// app.get('/articles',(req,res)=>{
// Article.find({},(err,foundArticles)=>{
//     if(!err){
//         res.send(foundArticles);
//     }
// })
// });

// app.post('/articles',(req,res)=>{
//     const article = new Article({
//         title:req.body.title,
//        content :req.body.content
//     });
//     article.save((err)=>{
//         if(!err){
//             res.send("saved sucessfully")
//         }else{
//             res.send(err)  
//         }
//     });
// })
// app.delete('/articles',(req,res)=>{
//     Article.deleteMany({},(err)=>{
//         if(!err){
//             res.send("saved sucessfully");
//         }else{
//             res.send(err);
//         }
//     })
// })
app.listen(3000,()=>{
    console.log('started 3000')
})