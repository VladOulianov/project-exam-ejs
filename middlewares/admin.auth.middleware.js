module.exports = async (req, res, next) => {
  // console.log("coucou");
  try {
    const idSession = req.session.userId;
    console.log("ici : ", idSession);
    if (idSession != undefined) {
      const verif = await query(
        "SELECT roleId FROM utilisateur where userId = ?",
        [idSession]
      );
      //console.log("verif", verif[0].roleId);
      if (verif[0].roleId === 1) {
        next();
      } else {
        req.session.message = {
            type: "danger",
            intro: "connection",
            message: "Veuillez-vous connecter en tant qu'administrateur",
          };
        res.redirect("/user/login");
      }
    } else {
      res.redirect("/user/login");
    }
  } catch (err) {
    res.send(err);
  }
};
