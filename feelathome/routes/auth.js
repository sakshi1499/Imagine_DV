const express = require("express");
const app=express()
const router = express.Router();
const { signup, signin } = require("../handlers/auth");
const User=require("../models/User")
const Post=require("../models/posts")
const Event=require("../models/events")

const moment=require('moment')
const {sendConfirmationEmail}=require("../emails/email")
const bcrypt = require("bcrypt");
const methodOverride=require("method-override")
app.use(methodOverride("_method"))
const multer=require("multer")
var CircularJSON = require('circular-json');


const multerConf={
  storage:multer.diskStorage({
    destination:function(req,file,next){
      next(null,'./public/img')
    },
    filename:function(req,file,next){
const ext=file.mimetype.split('/')[1];
next(null,file.fieldname+'-'+Date.now()+'.'+ext)
    }
  }),
  fileFilter:function(req,file,next){
    if(!file){
      next();
    }
    const image=file.mimetype.startsWith('image/')
if(image){
  next(null,true)
}else{
  next({message:"File type not suported"})
}
  }
}



router.get("/",(req,res)=>{
  Post.find({}).sort({date:-1}).exec(function(err,posts){

    if(err){
      res.send(err);
    }
    res.render('landing',{posts:posts,isLoggedIn:false,username:null,user:null,userId:null,add:false})

  })
})

router.get("/posts/:id",(req,res)=>{
  Post.findById(req.params.id,(err,post)=>{

    if(err){
      res.send(err);
    }
else{
  res.json(post)
}
  })
})

router.get("/:id/bookmarks/:postId",(req,res)=>{
  Post.findById(req.params.postId,(err,post)=>{

    if(err){
      res.send(err);
    }
else{
  res.json(post)
}
  })
})


router.get("/forgot",(req,res)=>{
  res.render("forgotpass",{sent:false})
})


router.get("/login",(req,res)=>{
   res.render("login")
  })
  router.get("/chat",(req,res)=>{
    res.render("chatbox")

  })

  router.get("/:id/chat",(req,res)=>{
    User.findById(req.params.id,(err,found)=>{
      if(err){
        res.redirect("back")
      }else{
          res.redirect("/chat?username="+found.username+"&room=206")
      }
    })

    // res.render("chatbox")

  })

  router.get("/events/:id",(req,res)=>{
  Event.findById(req.params.id,(err,event)=>{
    if(err){
      res.redirect("back")
    }else{
      // res.render("events",{event:event})
      res.json(event)
    }
  })
  })

  router.get("/events",(req,res)=>{
    res.render("events",{event:null})

  })





  router.get("/:id",(req,res)=>{
   User.findById(req.params.id,(err,found)=>{
    if(err){
      console.log(err);
    }else{
      Post.find({}).sort({date:-1}).exec(function(err,posts){
        res.render('landing',{posts:posts,username:found.username,user:found,isLoggedIn:true,userId:req.params.id,add:false})

      })
    }
  })
  })

  router.get("/:id/comments/:commentId",(req,res)=>{
    User.findById(req.params.id,(err,found)=>{
     if(err){
       console.log(err);
     }else{
       Post.find({}).sort({date:-1}).exec(function(err,posts){
         res.render('landing',{postID:req.params.commentId,posts:posts,username:found.username,user:found,isLoggedIn:true,userId:req.params.id,add:true})

       })
     }
   })
  })

  router.get("/:id/profile",(req,res)=>{
    User.findById(req.params.id,(err,found)=>{
      if(err){
        console.log(err);
        res.redirect("/"+req.params.id)
      }else{
        console.log(found.username);
        res.render("profile",{username:found.username,user:found})

      }

    })
  })
  router.get("/step2/:id",(req,res)=>{
    res.render("step2",{userId:req.params.id})
  })

  router.get("/step1/:id",(req,res)=>{
    res.render("step1",{userId:req.params.id})
  })



router.post("/events",(req,res)=>{
  Event.create(req.body,(err,event)=>{
    if(err){
      res.send(err)
    }else{
      res.json(event)
    }
  })
})


  router.post("/:id/step1",(req,res)=>{
    var category=req.body.options;
User.findByIdAndUpdate(req.params.id,{category:category},(err,found)=>{
  if(err){
    console.log(err);
    res.redirect("/"+"step1/"+req.params.id)
  }
  else{
    res.redirect("/step2/"+req.params.id)

  }
})

  })



  router.post("/:id/step2",(req,res)=>{
    var location=req.body.location;
User.findByIdAndUpdate(req.params.id,{address:location},(err,found)=>{
  if(err){
    console.log(err);
    res.redirect("/"+"step2/"+req.params.id)
  }
  else{
    res.redirect("/"+req.params.id)

  }
})

  })











  router.post("/signup", signup);
  router.post("/login", signin);




router.get("/:id/newpassword",(req,res)=>{

  res.render("newpass",{i:req.params.id})
})



router.get('/events',(req,res)=>{

})


router.get("/recipe",(req,res)=>{
        res.render("recipe")
      })


router.post("/:id/newpassword",async (req,res)=>{
  if(req.body.password===req.body.confirm){
    let hashedPassword = await bcrypt.hash(req.body.password, 10);
  User.findByIdAndUpdate(req.params.id,{password:hashedPassword},(err,update)=>{
    console.log(update);
    if(err){
      console.log(err);
    }else{
    res.redirect("/"+req.params.id)
  }})}else{
    res.redirect("back")
  }
})

router.post("/forgotpassword", (req,res)=>{
  var emailid='';
User.find({email:req.body.email},async(err,found)=>{
    if(err){
      console.log(err);
    }else{
      console.log("/"+found[0].id+"/newpassword");
      emailid=found[0].id
  await sendConfirmationEmail(req.body.email,found[0].username,emailid)
   res.render("forgotpass",{sent:true})
    }
  })

})









  router.post("/:id/remove",(req,res)=>{
    User.findById(req.params.id,(err,found)=>{
      if(err){
        console.log(err);
      }else{
        var authorId=req.params.id;
        Post.find({authorId:authorId},(err,x)=>{
          console.log(x);
        })
        Post.findOneAndRemove({authorId:authorId},(err)=>{
          if(err)
  {
  console.log(err);
  }          else{
    let id =req.params.id;

    User.findByIdAndUpdate(id,{postCount:found.postCount-1},(err,update)=>{
  })
      res.redirect("/"+req.params.id)

          }
        })
      }
    })

  })

  router.post("/:id/comments/:commentId",(req,res)=>{

  var comment=req.body.comment;
if(comment){

User.findById(req.params.id,(err,user)=>{
  if(err){
    res.redirect("/"+req.params.id)
  }else{
  Post.findById(req.params.commentId, (err,found)=>{
    if(err){
      res.redirect("/"+req.params.id)
    }else{
  user.commentCount=user.commentCount+1;
  user.save()
  found.comments=[...found.comments,{comment:comment,  author:user.username}]
  found.commentCount=found.commentCount+1;
  found.save()
  res.redirect("/"+req.params.id)
    }
  })
}

})

}else{
  res.redirect("/"+req.params.id)

}


  })

router.post("/:id/comments",(req,res)=>{

var author=req.body.author;

Post.find({createdBy:author},(err,found)=>{
  if(err){
    res.redirect("/"+req.params.id)
  }else{

res.redirect("/"+req.params.id  +"/comments/"+ found[0]._id)
  }
})

})





router.put("/:id/likes",(req,res)=>{
  Post.findByIdAndUpdate(req.params.id,req.body,{new:true},(err,post)=>{
    if(err){
      res.json(err)
    }else{




    }
  })
})


router.put("/:id/bookmarks/:postId",(req,res)=>{
  User.findById(req.params.id,(err,user)=>{
    if(err){
      res.json(err)
    }else{

  Post.findByIdAndUpdate(req.params.postId,req.body,{new:true},(err,post)=>{
if(post.bookmarked){
  post.bookmarkedUsers.push(user.username)
  post.save()
}



  console.log(user);
  console.log(req.body.bookmarked);
  if(post.bookmarked){
    user.bookmarkCount=user.bookmarkCount+1;

  }
  else if(!post.bookmarked){
    user.bookmarkCount=user.bookmarkCount-1;
  }
  user.save()

})



    }
  })
})


router.post("/:id",(req,res)=>{
// if(){
var createdBy=null;
User.findById(req.params.id,(err,found)=>{
if(err){
  console.log(err);
  res.redirect("/" +req.params.id)
}else{
createdBy=found.username;
var author={
  id:req.params.id,
  username:found.username
}
console.log(author);
let id =req.params.id;
     if(req.body.post['description'].length!==0){
      Post.create({...req.body.post,authorId:author.id,author:author,postIcon:found.photo,createdBy:createdBy},(err,post)=>{
        if(err){
          console.log(err);
        }else{
          post.save();
          User.findByIdAndUpdate(id,{postCount:found.postCount+1},(err,update)=>{
        })
          res.redirect("/"+id)
}

})}


}
})



      })








router.post("/:id/profilepic",multer(multerConf).single('photo'),(req,res)=>{
      // res.send('wait
      if(req.file){
// {"fieldname":"photo","originalname":"map.png","encoding":"7bit","mimetype":"image/png","destination":"./public/img","filename":"photo-1573054641066.png","path":"public\\img\\photo-1573054641066.png","size":76428}
        req.body.photo=req.file.filename
      }
      // res.send(req.file)
      var pic=req.file.filename;
      var id=req.params.id;
      User.findByIdAndUpdate(id,{photo:pic},(err,update)=>{
        if(err){
          console.log(err);
        }else{
          var username=update.username
          Post.find({createdBy:username},(err,posts)=>{
            posts.forEach(post=>{
              Post.findByIdAndUpdate(post.id,{postIcon:pic},(err,update)=>{
              })
            })

          })

      }
})

res.redirect("/"+id+"/profile")
//findByIdAndUpdate


      })




module.exports = router;
