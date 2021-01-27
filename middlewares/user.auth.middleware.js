module.exports = async (req, res, next) => {
  try {
    const idSession = req.session.userId;

    if (idSession != undefined) {
      const verif = await query(
        "SELECT userId FROM utilisateur where userId = ?",
        [idSession]
      );

      if (verif.length) {
        next();
      } else {
        res.redirect("/user/login");
      }
    } else {
      res.redirect("/user/login");
    }
  } catch (err) {
    res.send(err);
  }
};
