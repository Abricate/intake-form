import express from 'express';
import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';

import config from '../config';

import { Admin } from '../db';

const router = express.Router();

passport.use(
  new OAuth2Strategy({
    clientID: config.google.web.client_id,
    clientSecret: config.google.web.client_secret,
    callbackURL: config.google.web.redirect_uri
  }, function(accessToken, refreshToken, profile, done) {
    const result = (async function() {
      const googleId = profile.id;
      const domain = profile._json.domain;
      const name = profile.displayName;
      const emailObject = profile.emails.find(email => email.type === 'account');
      const email = emailObject && emailObject.value;
      
      const existingAdmin = await Admin.findOne({
        where: { googleId }
      });

      if(existingAdmin != null) {
        return existingAdmin;
      }
      
      if(config.adminDomainWhitelist.includes(domain)) {
        return await Admin.create({ googleId, name, email });
      } else {
        throw 'Not allowed';
      }
    })();

    result.then(admin => {
      done(null, admin);
    }).catch(error => {
      done(error);
    });
  })
);

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/google',
           passport.authenticate('google', { scope: ['email'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/google/callback', 
           passport.authenticate('google', { failureRedirect: '/login' }),
           function(req, res) {
             res.redirect('/admin');
        });

module.exports = router;
