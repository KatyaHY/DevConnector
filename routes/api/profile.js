const express = require('express');
//to use the express router. 
//Routing refers to how an application’s endpoints (URIs) respond to client requests.
const router = express.Router();

//@route    GET api/profile
//@desc     Test route
//@access   Public
router.get('/', (req, res) => res.send('Profile route'));

module.exports = router;