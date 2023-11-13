const express = require('express');
const router = express.Router();
const db  = require('./dbConnection');
const { signupValidation ,loginValidation } = require('./validation');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', signupValidation, (req, res, next) => {
    db.query(
      `SELECT * FROM user WHERE username = (${db.escape(
        req.body.username
      )});`,
      (err, result) => {
        if (result.length) {
            console.log("err");
          return res.status(409).send({
            msg: 'This user is already in use!'
          });
        } else {
          // username is available
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                console.log("err 2")
              return res.status(500).send({
                msg: err
              });
            } else {
              // has hashed pw => add to database
              db.query(
                `INSERT INTO user (username, password, role) VALUES (${db.escape(
                  req.body.username
                )}, ${db.escape(hash)}, '${req.body.role}')`,
                (err, result) => {
                  if (err) {
                    console.log(err);
                    //throw err;
                    return res.status(400).send({
                      msg: err
                    });
                  }
                  return res.status(201).send({
                    msg: 'The user has been registerd with us!'
                  });
                }
              );
            }
          });
        }
      }
    );
  });

router.post('/login', loginValidation, (req, res, next) => {
    db.query(
        `SELECT * FROM user WHERE username = ${db.escape(req.body.username)};`,
        (err, result) => {
            // user does not exists
            if (err) {
              // throw err;
              return res.status(400).send({
                msg: err
              });
            }
            if (!result.length) {
                console.log("err 1");
                return res.status(401).send({
                  msg: 'Username or password is incorrect!'
                });
            }
            // check password
      bcrypt.compare(
        req.body.password,
        result[0]['password'],
        (bErr, bResult) => {
          // wrong password
          if (bErr) {
            // throw bErr;
            console.log("err 2");
            return res.status(401).send({
              msg: 'Username or password is incorrect!'
            });
          }
          if (bResult) {
            const token = jwt.sign({username:result[0].username},'the-super-strong-secrect',{ expiresIn: '1h' });
            // db.query(
            //   `UPDATE user SET last_login = now() WHERE username = '${result[0].username}'`
            // );
            return res.status(200).send({
              msg: 'Logged in!',
              token,
              user: result[0]
            });
          }
          console.log("err 3");
          return res.status(401).send({
            msg: 'Username or password is incorrect!'
          });
        }
      );
              
        }
    )
});

  

 
module.exports = router;