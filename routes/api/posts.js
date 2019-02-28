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
//@access Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    //tylko właściciel postu może usuwać posty
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //sprawdź właściciela postu
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({notAuthorized: 'User not authorized to remove post'})
                    }
                    //DELETE
                    Post.deleteOne().then(() => res.json({success: true}))
                })
                .catch(err => res.status(404).json({postNotFound: 'Post not found'}))
        })
});


//@route POST api/posts/like/:id
//@desc Like post by post id
//@access Private
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    //tylko właściciel postu może usuwać posty
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    // sprawdzamy czy w liście lajków jest użytkownik który wysyła zapytanie
                    const isLiked = post.likes.filter(like => like.user.toString() === req.user.id).length > 0;
                    if (isLiked) {
                        return res.status(400).json({alreadyLiked: 'User already likes this post'});
                    }

                    //Add user id to like array
                    post.likes.unshift({user: req.user.id});
                    post.save().then(post => res.json(post))
                })
                .catch(err => res.status(404).json({postNotFound: 'Post not found'}))
        })
});

//@route POST api/posts/unlike/:id
//@desc Dislike post by post id
//@access Private
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    //tylko właściciel postu może usuwać posty
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    // sprawdzamy czy w liście lajków jest użytkownik który wysyła zapytanie
                    const isLiked = post.likes.filter(like => like.user.toString() === req.user.id).length === 0;
                    if (isLiked) {
                        // for the future: do unlike button
                        return res.status(400).json({notLiked: 'User haas not liked it yet'});
                    }

                    //Get remove index
                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);

                    //Splice out of array
                    post.likes.splice(removeIndex, 1);

                    post.save().then(post => res.json(post))
                })
                .catch(err => res.status(404).json({postNotFound: 'Post not found'}))
        })
});


//@route POST api/posts/comment/:id
//@desc Add comment to post (by post id)
//@access Private
router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    //Walidacja komentarza używa takiej samej walidacji jak post dlatego jest używany validatePostInput
    const {errors, isValid} = validatePostInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            };

            //Add to comments array
            post.comments.unshift(newComment);

            //Save
            post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({postNotFound: 'Post not found'}))
});

//@route DELETE api/posts/comment/:id/:comment_id
//@desc Remove comment from post (by post and commentid)
//@access Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            const doesCommentNotExist = post.comments.filter(comment => comment.id.toString() === req.params.comment_id).length === 0
            if (doesCommentNotExist) {
                return res.status(404).json({commentNotExists: "Comment does not exists"})
            }
            // Get remove index
            const removeIndex = post.comments
                .map(item => item._id.toString())
                .indexOf(req.params.comment_id);

            //Splice comment out of array
            post.comments.splice(removeIndex, 1);

            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({postNotFound: 'Post not found'}))
});

module.exports = router;
