const bcrypt = require("bcrypt");

// GET ('/user/register')
exports.getRegisterPage = async (req, res) => {
  try {
  
    res.render("sign_in");
  } catch (e) {
    res.send(e);
  }
};

// POST('/user/register')
exports.postRegister = async (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;
  const phoneNumber = req.body.number;
  const emailQuery = "select email from utilisateur where email ='" + email + "' ";

  if (firstname == ''|| lastname == '' || email == '' || password == '' || password2 == '' || phoneNumber == ''){

    req.session.message = {
      type: 'danger',
      intro: 'Champs vide! ',
      message: "Veuillez remplir tous les champs d'information."
    }
    req.session.input = {
      firstname : firstname,
      lastname :lastname,
      email  : email,
      phoneNumber : phoneNumber
    
    
    }
    console.log(req.session.input.message);
    res.redirect('/user/register')
    
  } else {
    if (password2 === password) {
      try {
        const resultEmail = await query(emailQuery);

        if (resultEmail.length > 0) {
          req.session.message = {
            type: 'danger',
            intro: 'email invalide',
            message: "Cette adresse mail est déja utilisée."
          }
          res.redirect('/user/register')
        } else {
          bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(password, salt, async (err, hash) => {
            await query(
              "INSERT INTO utilisateur \
              (firstname,lastname,email,password,phonenumber) \
              VALUES(?,?,?,?,?);",
              [firstname, lastname, email, hash, phoneNumber]
            );

            res.redirect("/user/login");
          });
          });
        }
        console.log(resultEmail);
      } catch (err) {
        res.send(err);
      }
    } else {
      req.session.message = {
        type: 'danger',
        intro: 'Champs vide! ',
        message: "Mot de passe non identique."
      }
      res.redirect('/user/register')
    }
  }
};
