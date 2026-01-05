const User = require("../models/user.js");


// sign up form
module.exports.signUpForm = (req,res)=>{
    res.render("users/signup");

};

module.exports.signup=async(req,res)=>{
  try{
      let{username,email,password} = req.body;
    const newUser = new User({email,username});
      const registeredUser=  await  User.register(newUser, password);
      req.login(registeredUser,(err)=>{
         console.log(registeredUser);
        if(err){
          return next(err);
        }
        
      req.flash("success","Welcome To Wonderlust");
      res.redirect("/listings");
      });
     
  }catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
  }
};

// login form
module.exports.loginForm=(req,res)=>{
    res.render("users/login.ejs");
};

//login
module.exports.login =  async(req,res)=>{
        req.flash("success","welcome back to wanderlust! ");
       let redirectUrl = res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl);
};
// logout
module.exports.logout = (req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
  });

};