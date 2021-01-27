// GET('/admin')
exports.getUserList = async (req, res) => {
    const userList = await query(
      "SELECT ??, ??, ??, ??, ??, ?? FROM utilisateur\
       as u inner join ?? as r on ?? = ?? WHERE ?? = ?;",
      ["userId", "firstname", 
      "lastname", "email", 
      "phonenumber","r.rolename",
      "role","u.roleId",
       "r.roleId","u.roleId",2]
    );
  
    try {
      res.render("admin_page",{
        userList
      });
    } catch (e) {
      res.send(e);
    }
  };

// DELETE('/admin/user:id')
  exports.deleteUser = async (req, res) => {
    const userId = req.params.id
    await query(
      'DELETE FROM utilisateur\
      WHERE ?? = ?;', ['userId',userId]
    );
  
    try {
      res.redirect('/admin');
    } catch (e) {
      res.send(e);
    }
  };
  