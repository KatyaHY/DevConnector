const express = require('express');
//to use the express router. 
//Routing refers to how an application’s endpoints (URIs) respond to client requests.
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

//user model
const User = require('../../models/User')

//@route    POST api/users
//@desc     Register user
//@access   Public
router.post('/', [
    check('name', 'Please enter your name').not().isEmpty(),
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'Please enter password with 6 or more characters').isLength({min:6})
], 
async (req, res) =>{ 
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {name, email, password} = req.body;

    try {
        //check if the user exists (search by email)
       let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        //get user gravatar
        const avatar = gravatar.url(email, {
            s: '200',        //size
            r: 'pg',          //apropriate picture
            d: 'mm'          //defaul picture
        });

        //create an instance of the user
        user = new User({
            name,
            email,
            avatar,
            password
        });

        //encryp password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save()

        res.send('User registered');
    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }


});

module.exports = router;
