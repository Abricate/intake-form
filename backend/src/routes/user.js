const router = require('express-promise-router')();

router.get('/whoami', async function (req, res) {
  if(req.user) {
    res.send({
      user: {
        email: req.user.email,
        isAdmin: req.user.isAdmin()
      }
    });
  } else {
    res.send({});
  }    
});

module.exports = router;
