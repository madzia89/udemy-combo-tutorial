//location, bio, experience, education, social network links

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// Load Profile Model
const Profile = require('../../models/Profile');

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


//@route GET api/profile/handle/:handle
//@desc Get profile by handle
//@access Public
router.get('/handle/:handle', (req, res) => {
    const errors = {};
    Profile.findOne({handle: req.params.handle})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }
            res.status(200).json(profile);
        })
        .catch(err => res.status(404).json({profile: 'There is no profile for this user'}));
});

//@route GET api/profile/user/:user_id
//@desc Get profile by user_id
//@access Public
router.get('/user/:user_id', (req, res) => {
    const errors = {};
    Profile.findOne({user: req.params.user_id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }
            res.status(200).json(profile);
        })
        .catch(err => res.status(404).json({profile: 'There is no profile for this user'}));
});

//@route GET api/profile/all
//@desc Get all profiles
//@access Public
router.get('/all', (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                errors.noprofile = 'There are no profiles';
                return res.status(404).json(errors);
            }
            res.json(profiles);
        })
        .catch(err => res.status(404).json({profile: 'There are no profiles'}))
});


//@route POST api/profile
//@desc Create user profile
//@access Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {

    const {errors, isValid} = validateProfileInput(req.body);

    //check validation
    if (!isValid) {
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
    if (typeof req.body.skills  !== 'undefined') {
        //Skills - split into array
        profileFields.skills = req.body.skills.split(',')
    }
    if (req.body.githubusername) {
        profileFields.githubusername = req.body.githubusername;
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


//@route POST api/profile/experience
//@desc Add user experience to profile
//@access Private
router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res)=> {

    const {errors, isValid} = validateExperienceInput(req.body);

    //check validation
    if (!isValid) {
        // return any errors with 400
        return res.status(400).json(errors)
    }

    Profile.findOne({user: req.user.id})
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                tp: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            // Add to exp array at the beginning
            profile.experience.unshift(newExp);
            // Save profile and send it back to front
            profile.save().then(profile => res.json(profile));
        })
});

//@route POST api/profile/education
//@desc Add user education to profile
//@access Private
router.post('/education', passport.authenticate('jwt', {session: false}), (req, res)=> {

    const {errors, isValid} = validateEducationInput(req.body);

    //check validation
    if (!isValid) {
        // return any errors with 400
        return res.status(400).json(errors)
    }

    Profile.findOne({user: req.user.id})
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldOfStudy: req.body.fieldOfStudy,
                from: req.body.from,
                tp: req.body.to,
                current: req.body.current,
                description: req.body.description
            };

            // Add to exp array at the beginning
            profile.education.unshift(newEdu);
            // Save profile and send it back to front
            profile.save().then(profile => res.json(profile));
        })
});

module.exports = router;
