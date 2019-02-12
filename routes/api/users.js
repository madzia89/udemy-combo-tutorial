//authentication

const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs'); //it's to encrypt the password

const User = require('../../models/User');

//@route GET api/users/test
//@desc Tests users route
//@access Public
router.get('/test', (req, res) => res.json({msg: "Users works"}));

//@route GET api/users/register
//@desc Register user
//@access Public

router.post('/register', (req, res) => {
    //check if email given in response exists in db
    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                return res.status(400).json({email: 'Email already exists'})
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', //size
                    r: 'pg', //rating
                    d: 'mm' //default
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });
                //below encrypting the password,
                //we want 10 characters,
                //first callback create password with given salt and given password by th user
                //in second callback we set users password to the hash that was created in first callback
                //then we save updated user to json
                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(er => consol.log(er))
                    })
                })
            }
        })
});


//@route GET api/users/login
//@desc Login User / return JWT token
// @access Public

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //Find user by email
    User.findOne({email})
        .then(user => {
            //check for user
            if (!user) {
                return res.status(404).json({email: 'User not found'})
            }

            //Check password
            //compare if given password matches password provided by th user
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        res.json({msg: 'Success'});
                    } else {
                        return res.status(400).json({password: 'Password incorrect'});
                    }
                })
        })
});


module.exports = router;
