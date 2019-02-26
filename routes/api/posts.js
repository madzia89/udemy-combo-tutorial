//posty użytkowników i ich komentarze

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');


const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');

//@route GET api/posts/test
//@desc Tests posts route
//@access Public
router.get('/test', (req, res) => res.json({msg: "Posts works"}));

//@route GET api/posts
//@desc Get post by id
//@access Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({posts: 'post not found'}))
});

//@route GET api/posts/:id
//@desc Get all posts
//@access Public
router.get('/', (req, res) => {
    Post.find()
    //sort posts by date
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({posts: 'posts not found'}))
});


//@route GET api/posts
//@desc Create Post
//@access Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {

    const {errors, isValid} = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
        // if any errors, sen 400 with errors object
        return res.status(400).json(errors);
    }
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post)).catch(err => res.status(400).json('Wystąpił błąd'));
});


//@route DELETE api/posts/:id
//@desc Delete post by id
//Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    //tylko właściciel postu może usuwać posty
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //sprawdź właściciela postu
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({notauthorized: 'User not authorized to remove post'})
                    }
                    //DELETE
                    Post.deleteOne().then(() => res.json({success: true}))
                })
                .catch(err => res.status(404).json({postnotfound: 'Post not found'}))
        })
});

module.exports = router;
