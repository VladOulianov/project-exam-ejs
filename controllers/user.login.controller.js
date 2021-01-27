const bcrypt = require("bcrypt");

// GET LOGIN PAGE ('/user/login') 
exports.getLoginPage = async (req, res) => {
  try {
    //let message = "";
    res.render("login"/*, { csrfToken: req.csrfToken() }*/ /*, { message }*/);
  } catch (e) {
    res.send(e);
  }
};

// POST LOGIN PAGE ('/user/login')
exports.postLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email == "" || password) {
    await query(
      "SELECT firstname, email, password, userId, roleId FROM utilisateur WHERE email= ?",
      [email],
      (err, result) => {
        if (err || result.length === 0) {
          // console.log("result :", result);
          // req.flash("info", "Erreur d'email ou de mot de passe ");
          // let message = req.flash();

          // console.log(message.info);

          // res.render("login", { message: message.info });

          req.session.message = {
            type: "danger",
            intro: "connection",
            message: "Email ou mot de passe incorect.",
          };
          req.session.input = {
            email: email,
          };
          res.redirect("/user/login");
        } else {
          bcrypt.compare(password, result[0].password, async (err, success) => {
            if (err) {
              req.session.message = {
                type: "danger",
                intro: "connection",
                message: "mot de passe incorect.",
              };
              req.session.input = {
                email: email,
              };
              res.redirect("/user/login");
            }
            if (success) {
              await query(
               "SELECT firstname, email, userId, roleId FROM utilisateur WHERE email = ? AND password = ?",
              [email, result[0].password],
              await function (err, results) {
                if (results.length) {
                  req.session.loggedin = true;
                  req.session.firstname = result[0].firstname;
                  req.session.email = result[0].email;
                  req.session.userId = result[0].userId;
                  req.session.roleId = result[0].roleId;
                  //req.session.redirectTo = req.redirectTo;
                  //var redirectTo = req.session.path || '/';
                  // console.log("coucou1",result[0]);
                  res.redirect("/");
                  
                  //console.log("req.session :", req.session);
                } else {
                  
                  req.session.message = {
                    type: "danger",
                    intro: "connection",
                    message: "Email ou mot de passe incorect.",
                  };
                  req.session.input = {
                    email: email,
                  };
                  res.redirect("/user/login");
                }
              }
              );
            } else {
              req.session.message = {
                type: "danger",
                intro: "connection",
                message: "Email ou mot de passe incorect.",
              };
              req.session.input = {
                email: email,
              };
              res.redirect("/user/login");
            }
          });
        }
      }
    );
  } else {
    req.session.message = {
      type: "danger",
      intro: "connection",
      message: "Aucun champs de doit étre vide",
    };
    req.session.input = {
      email: email,
    };
    res.redirect("/user/login");
  }
};

// GET LOGOUT (/user/logout) 
exports.getLogout = async (req, res) => {
  try {
    req.session.destroy()
    res.redirect("/user/login" /*, { message }*/);
  } catch (e) {
    res.send(e);
  }
};
