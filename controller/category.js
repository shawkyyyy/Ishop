const Page = require('../models/category');

exports.getaddpage = async function(req,res,next){ 
    title='';
    slug='';
    content=''; 
    
    res.render('admin/addpage' , {
        title:title,
        slug:slug,
        content:content
    });
}

exports.addpage= async function(req,res,next){
    
  
    if(req.body.title=='' || req.body.content==''|| req.body.slug==''){
        req.session.message = {
            type: 'danger',
            intro: 'Empty fields! ',
            message: 'Please insert the requested information.'
          }
           // res.locals.message=req.session.message;
            //console.log(req.session.message)
          res.redirect('/admin/addpage') 
    } else { 
        var title = req.body.title;
        var slug = req.body.slug;
        var content = req.body.content; 
        var page = new Page({
            title:title,
            slug:slug,
            content:content,
            sorting:100,
        })
  /*      page.save(()=>{
            if(err){
                console.log(err)
                req.session.message = {
                    type: 'danger',
                    intro: 'error! ',
                    message: 'err'
                  }
            } else{ 

                req.session.message = {
                    type: 'sucess',
                    intro: 'done! ',
                    message: 'new pages is added.'
                  } 
                  res.redirect('/')
            
        })*/page.save(function(err){
             if(err)    return console.log(err) 
             req.session.message = {
                type: 'success',
                intro: 'done! ',
                message: 'new pages is added.'
              } 
              res.redirect('/admin/pages')

        })
        
 
    }
    
   // req.flash('success', 'Registration successfully');
   // res.locals.message = req.flash();
  //  console.log(req.session.message)
    //res.redirect('/admin/addpage') 
  
}

exports.getpages = async function (req,res,next){ 
    Page.find({}).sort({sorting:1}).exec(function(err,pages){
        res.render('admin/pages',{
            pages:pages,
        })
    })

} 

exports.reorder = async function (req,res ){
    var id = req.body['id[]'];
    var count = 0; 
    
  for(var i = 0; i<id.length;i++){ 
      var cid=id[i];    
      count++; 
        (function(count){

            Page.findById(cid,function(err ,page){
                console.log(page)
                page.sorting= count;
                page.save(function(err){
                    if (err )
                        return console.log(err)
                });
            });
        })(count); 
   

    }
   // console.log(id) 
} 

exports.geteditpage = async function(req,res,next){ 
   
    id = req.params.id;
    Page.findById(id,function(err,page){
        if (err)
            return console.log(err)
            else {
                res.render('admin/editpage' , { 
                    page:page
                    
                });
            }
    })
   
} 

exports.updatepage = async function (req,res ){
   var pid = req.body.id; 
   var title= req.body.title;
   var slug = req.body.slug;
   var content = req.body.content; 
   if(title==""|| slug==""||content==""){
    req.session.message = {
        type: 'danger',
        intro: 'Empty fields! ',
        message: 'Please insert the requested information.'
      }
    
      res.redirect(req.get('referer'));

   }else {
          Page.findById(pid,function(err,page){
            if (err)  
                return console.log(err)
                else{ 
            
                    page.title=title;
                    page.slug=slug;
                    page.content=content; 
                    page.save() 
                    req.session.message = {
                        type: 'success',
                        intro: 'done! ',
                        message: 'pages is edited.'
                      } 
                      res.redirect('/admin/pages')
        
                  }

   })

   }
  
} 

exports.deletepage = async function(req,res,next){ 
   
    id = req.params.id;
    Page.findByIdAndRemove(id,function(err){
        if(err)
                return console.log(err) 
         req.session.message = {
            type: 'success',
            intro: 'done! ',
             message: 'pages is deleted.'
          } 
           res.redirect('/admin/pages')      

    })
   
} 