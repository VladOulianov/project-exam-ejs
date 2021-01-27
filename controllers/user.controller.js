const bcrypt = require("bcrypt");

// GET('/user/option')
exports.getUserOption = async (req, res) => {
  //const userId = 10;
  const userId = req.session.userId;
  const user = await query(
    "SELECT userId, firstname, lastname, email, phonenumber FROM utilisateur WHERE userId = ?;",
    [userId]
  );

  try {
    res.render("option", {
      user: user[0],
    });
  } catch (e) {
    res.send(e);
  }
};

// PUT('/user/option')
exports.putUserOption = async (req, res) => {
  //const userId = 10;
  const userId = req.session.userId;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const phoneNumber = req.body.number;
  //const emailQuery = ["select email from utilisateur where email = ? AND NOT userId = ?",[email,user_id]]

  try {
    const resultEmail = await query(
      "select email from utilisateur where email = ? AND NOT userId = ?",
      [email, userId]
    );

    if (resultEmail.length > 0) {
      req.session.message = {
        type: "danger",
        intro: "update",
        message: "Email déja utilisé.",
      };
      res.redirect("/user/option");
    } else {
      if (firstname == "" || lastname == "" || email == "" || phoneNumber == "") {
        req.session.message = {
          type: "danger",
          intro: "update",
          message: "Aucun champs de doit étre vide.",
        };
        res.redirect("/user/option");
      } else {
        try {
          await query(
            "UPDATE utilisateur SET firstname = ?,lastname = ?,email = ?,phonenumber = ? WHERE userId = ?;",
            [firstname, lastname, email, phoneNumber, userId]
          );
          req.session.message = {
            type: "success",
            intro: "update",
            message: "Informations changées avec succés.",
          };
          res.redirect("/user/option");
        } catch (err) {
          req.session.message = {
            type: "danger",
            intro: "update",
            message:
              "Nous somme navrés une erreur c'est produte veuillez réessayer plus tard.",
          };
          res.redirect("/user/option");
          console.log(err);
        }
      }
    }
  } catch (err) {
    req.session.message = {
      type: "danger",
      intro: "update",
      message:
        "Nous somme navrés une erreur c'est produte veuillez réessayer plus tard.",
    };
    res.redirect("/user/option");
    console.log(err);
  }
};
// PUT('/user/option/password')
exports.putUserPassword = async (req, res) => {
  //const userId = 10;
  const userId = req.session.userId;
  const password = req.body.password;
  const password2 = req.body.password2;

  if (password == "") {
    req.session.message = {
      type: "danger",
      intro: "update",
      message: "Aucun champs de doit étre vide.",
    };
    res.redirect("/user/option");
  } else {
    if (password2 === password) {
      try {
        bcrypt.hash(password, 10, async (err, hash) => {
          await query("UPDATE utilisateur SET password = ? WHERE userId = ?;", [
            hash,
            userId,
          ]);

          req.session.messagePass = {
            type: "success",
            intro: "update",
            message: "Votre mot de passe a été changé avec succés.",
          };
          res.redirect("/user/option");
        });
      } catch (err) {
        req.session.messagePass = {
          type: "danger",
          intro: "update",
          message:
            "Nous somme navrés une erreur c'est produte veuillez réessayer plus tard.",
        };
        res.redirect("/user/option");
        console.log(err);
      }
    } else {
      req.session.messagePass = {
        type: "danger",
        intro: "update",
        message: "Mot de passe non identique.",
      };
      res.redirect("/user/option");
    }
  }
};
