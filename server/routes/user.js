const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {

        try {

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);

                const newUser = new User({

                        username : req.body.username,
                        email : req.body.email,
                        password : hashedPassword

                });

                const savedUser = await newUser.save();
                res.status(200).json(savedUser);

        } catch(err) {

                res.status(500).json(err);

        }

});


router.post('/login', async (req, res) => {

        

        try {

                const user = await User.findOne({username : req.body.username});

                if(!user) {

                         res.status(400).json('Wrong Username or Password');

                }

                const validPassword = await bcrypt.compare(req.body.password, user.password);

                if(!validPassword) {

                          res.status(400).json('Wrong Username or Password');

                 }

                res.status(200).json({username : req.body.username});
            

        } catch(err) {

                res.status(500).json(err);
                

        }

});



module.exports = router;