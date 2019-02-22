//location, bio, experience, education, social network links

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Validation
const validateProfileInput = require('../../validation/profile');

// Load Profile Model
const Profile = require('../../models/Profile');

// Load User Profile
const User = require('../../models/User');

//@route GET api/profile/test
//@desc Tests profile route
//@access Public
router.get('/test', (req, res) => res.json({msg: "Profile works"}));


//@route GET api/profile
//@desc Get current users profile
//@access Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const errors = {};

    //fetch current user profile
    // klucz poniżej w findOne odniesie się do User z Profile.js
    Profile.findOne({user: req.user.id})
        //populate => w ten sposób z użytkownika pobieramy name i avatar aby wysłać je w zwrotce do profilu
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors)
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});


//@route POST api/profile
//@desc Create user profile
//@access Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {

    const {errors, isValid} = validateProfileInput(req.body);

    //check validation
    if(!isValid){
        // return any errors with 400
        return res.status(400).json(errors)
    }

    //Get fields
    const profileFields = {};
    // z req.user.id pobierane jest imię, avatar i email bo ustaliliśmy że to jest przechowywane w tokenie
    profileFields.user = req.user.id;
    if (req.body.handle) {
        profileFields.handle = req.body.handle;
    }
    if (req.body.company) {
        profileFields.company = req.body.company;
    }
    if (req.body.website) {
        profileFields.website = req.body.website;
    }
    if (req.body.location) {
        profileFields.location = req.body.location;
    }
    if (req.body.bio) {
        profileFields.bio = req.body.bio;
    }
    if (req.body.status) {
        profileFields.status = req.body.status;
    }
    if (req.body.skills) {
        profileFields.skills = req.body.skills;
    }
    //Skills - split into array
    if (typeof req.body.githubUserName !== 'undefined') {
        // this way we'll get array of skillss
        profileFields.skills = req.body.skills.split(',');
    }
    // Social
    // first create or edit social then add what we need
    profileFields.social = {};
    if (req.body.youtube) {
        profileFields.social.youtube = req.body.youtube;
    }
    if (req.body.twitter) {
        profileFields.social.twitter = req.body.twitter;
    }
    if (req.body.facebook) {
        profileFields.social.facebook = req.body.facebook;
    }
    if (req.body.linkedin) {
        profileFields.social.linkedin = req.body.linkedin;
    }
    if (req.body.twitter) {
        profileFields.social.twitter = req.body.twitter;
    }
    //chcemy znaleźć usera po req.user.id
    Profile.findOne({user: req.user.id})
        .then(profile => {
            if (profile) {
                //jeżeli profil istnieje to chcemy go edytować a nie tworzyć
                Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true})
                    .then(profile => res.json(profile));
            } else {
                // jeżeli nie ma profilu to chcemy go utworzyć.
                // najpierw sprawdzamy czy istnieje handle
                // handle odpowiada za dostęp do profilu w przyjzany sposób? :D
                Profile.findOne({handle: profileFields.handle})
                    .then(profile => {
                        if (profile) {
                            errors.handle = 'That handle already exists';
                            res.status(400).json(errors);
                        }

                        //save profile
                        new Profile(profileFields).save().then(profile => res.json(profile))
                    })
            }

        })
});


module.exports = router;
