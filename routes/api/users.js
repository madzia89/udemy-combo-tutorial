//authentication

const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs'); //it's to encrypt the password
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//load Input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const User = require('../../models/User');

//@route GET api/users/test
//@desc Tests users route
//@access Public
router.get('/test', (req, res) => res.json({msg: "Users works"}));

//@route GET api/users/register
//@desc Register user
//@access Public

router.post('/register', (req, res) => {
    const {errors, isValid} = validateRegisterInput(req.body);
    //check validation
    if (!isValid) {
        return res.status(400).json(errors)
    }

    //check if email given in response exists in db
    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                errors.email = 'Email already exists';
                return res.status(400).json(errors.email)
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
                            .catch(er => console.log(er))
                    })
                })
            }
        })
});


//@route GET api/users/login
//@desc Login User / return JWT token
// @access Public

router.post('/login', (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body);
    //check validation
    if (!isValid) {
        return res.status(400).json(errors)
    }

    const email = req.body.email;
    const password = req.body.password;

    //Find user by email
    User.findOne({email})
        .then(user => {
            //check for user
            if (!user) {
                errors.email = 'User not found';
                return res.status(404).json(errors)
            }

            //Check password
            //compare if given password matches password provided by th user
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //User Matched
                        const payload = {id: user.id, name: user.name, avatar: user.avatar}; //create jwt payload

                        // Sign token
                        jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600},
                            (errors, token) =>
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                })
                        );
                    } else {
                        errors.password = 'Password incorrect';
                        return res.status(400).json(errors);
                    }
                })
        })
});


//@route GET api/users/current
//@descReturn current user
//@access Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
});


module.exports = router;
