const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PostShcema = newShcema({
    user: {
        type: Schema.Types.ObjectId, //get user by id
        ref: 'user' //reference to user collection
    },
    text: {
        type: String,
        required: true
    },
    name: {
        // Name is passed here so even if the user deletes his profile, the post will stay and be signed by his name
        type: String
    },
    avatar: {
        type: String
    },
    likes: [
        {
            // Users are passed so there can be a logic that prevents from multiliking or disliking
            user: {
                type: Schema.Types.ObjectId, //get user by id
                ref: 'user' //reference to user collection
            }
        }
    ],
    comments: [
        {
            // Users are passed so there can be a logic that prevents from multiliking or disliking
            user: {
                type: Schema.Types.ObjectId, //get user by id
                ref: 'user' //reference to user collection
            },
            text: {
                String,
                required: true
            },
            name: {
                // Name is passed here so even if the user deletes his profile, the post will stay and be signed by his name
                type: String
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now,
            }
        }
    ]
});

module.exports = Post = mongoose.model('post', PostSchema)
