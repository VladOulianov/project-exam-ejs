const joi = require('joi');

// GET('/')
exports.getIndexPage = async (req, res) => {
  const legumeList = await query(
    "SELECT l.legumeId, legumename, GROUP_CONCAT(s.saisonname) AS saison FROM legume AS l\
     LEFT OUTER JOIN legume_saison AS ls ON l.legumeId = ls.legumeId\
    LEFT OUTER JOIN saison AS s ON s.saisonId = ls.saisonId\
    GROUP BY l.legumeId ORDER BY l.legumename;"
  );
  console.log(legumeList);
  try {
    res.render("index", { legumeList/*, csrfToken: req.csrfToken()  */});
  } catch (e) {
    res.send(e);
  }
};

// POST('/')
exports.postLegume = async (req, res) => {
  const legumeName = req.body.legumename;
  const saison = req.body.saisonname;
  //console.log("coucou",saison);
  //const saisonName2 = req.body.saisonname2
  //const saison = []
  try {
    const schema = joi.object().keys({
      legumeName: joi.string().min(3).max(45).required(),
    });

    const dataToValidate = {
      legumeName: legumeName
    }
    const result = schema.validate(dataToValidate);
    if (result.error) {
      req.session.message = {
        type: 'danger',
        intro: 'legume invalide',
        message: "Nom de légume invalide."
      }
      res.redirect("/");
    }else{
      try {
        const inleg = await query(
          "INSERT IGNORE INTO legume (legumename)\
           VALUES (?);",
          [legumeName]
        );
        console.log(inleg);
        const legumeId = await query(
          "SELECT legumeId FROM legume WHERE legumename = ?;",
          [legumeName]
        );
    
        console.log(legumeId[0].legumeId);
    
        //saison.push(saisonName)
        console.log(saison);
        if (saison.length == 1) {
          await query(
            "insert into legume_saison  (legumeId, saisonId)  values (?, ?)",
            [legumeId[0].legumeId, saison]
          );
        } else
          saison.forEach(async (element) => {
            const forsais = await query(
              "insert into legume_saison  (legumeId, saisonId)  values (?, ?)",
              [legumeId[0].legumeId, element]
            );
            console.log(forsais);
          });
    
        res.redirect("/");
      } catch (e) {
        res.send(e);
      }
    }
  } catch (e) {
      console.log(e);
  }
  
};

//DELETE ("/legume:id")
exports.deletelegume = async (req, res) => {
  const legumeId = req.params.id;

  try {
    await query("DELETE FROM legume WHERE legumeId = ?;", [legumeId]);
    res.redirect("/");
  } catch (e) {
    res.send(e);
  }
};
