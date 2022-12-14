const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');


const crypto = require('crypto');

//Register a new user => /api/v1/register
const registerUser = catchAsyncErrors( async (req, res, next) => {

    const { name, email, password } = req.body;

    const user = await User.create({
        name, 
        email,
        password,
        avatar: {
            public_id: 'avatars/kccvibpsuiusmwfepb3m',
            url: 'https://res.cloudinary.com/shopit/image/upload/v1606305757/avatars/kccvibpsuiusmwfepb3m.png'
        }
    })

    res.status(200).json({
        success: true,
        message: 'Account registered successfully'
    })

    // sendToken(user, 200, res)
})


// // Login User => /api/v1/login
// exports.loginUser = catchAsyncErrors( async (req, res, next) => {

//     const { email, password } = req.body


//     // Check if email and password is entered by user 
//     if(!email || !password) {
//         return next(new ErrorHandler('Please enter email and password'));
//     }

//     // finding user in the database
//     const user = await User.findOne({ email }).select('+password')

//     if(!user) {
//         return next(new ErrorHandler('Invalid Email or Password', 401))
//     }

//     // Check if password is correct or not 
//     const isPasswordMatched = await user.comparePassword(password);

//     if(!isPasswordMatched) {
//         return next(new ErrorHandler('Invalid Email or Password', 401))
//     }

//     sendToken(user, 200, res)

// });


// // forgot Password => /api/v1/password/forgot
// exports.forgotPassword = catchAsyncErrors(async(req, res, next)  =>  {

//     const user = await User.findOne({ email: req.body.email });

//     if(!user) {
//         return next(new ErrorHandler('User not found with this  email', 404))
//     }

//     // get reset tokenoif theuser exists 
//     const resetToken = user.getResetPasswordToken();

//     await user.save({ validateBeforeSave: false });

//     // Create reset password link
//     const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    
//     const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email then ignore it`;

//     try {

//         await sendEmail({
//             email: user.email,
//             subject: 'Deluccis Password Reset',
//             message
//         })

//         res.status(200).json({
//             success: true,
//             message: `Email sent to: ${user.email} successfully`
//         })

//     } catch (error) {
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpires = undefined;

//         await user.save({ validateBeforeSave: false });

//         return next(new  ErrorHandler(error.message, 500))
//     }

// })


// // forgot Password => /api/v1/password/reset/:token
// exports.resetPassword = catchAsyncErrors(async(req, res, next)  =>  {

//     // Hash URL token 
//     const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

//     const user = await User.findOne({
//         resetPasswordToken,
//         resetPasswordExpire: { $gt: Date.now() }
//     })

//     if(!user) {
//         return next(new  ErrorHandler('Password reset token is  invalid or has expired', 400))
//     }

//     if(req.body.password !== req.body.confirmPassword) {
//         return next(new  ErrorHandler('Password does not match', 400))
//     }

//     // setup new password
//     user.password = req.body.password;
//     user.resetPasswordExpire = undefined;

//     await user.save();

//     sendToken(user, 200, res);
// })


// //Get currently logged in user detauils => /api/v1/me
// exports.getUserProfile = catchAsyncErrors(async(req, res, next)  => {
//     const user = await  User.findById(req.user.id);

//     res.status(200).send({
//         success: true,
//         // message: 'got all users'
//         user 
//     })
// }) 


// // Update/Change Password => /api/v1/password/update
// exports.updatePassword = catchAsyncErrors(async(req, res, next)  => {
//     const user = await User.findById(req.user.id).select('+password');

//     // Check orevious user password 
//     const isMatched = await user.comparePassword(req.body.oldPassword)

//     if(!isMatched) {
//         return next(new  ErrorHandler('Old Password  is Incorrect', 400))
//     }

//     user.password = req.body.password
//     await user.save();

//     sendToken(user, 200, res);
// })


// // Update user profile => /api/v1/me/update
// exports.updateProfile = catchAsyncErrors(async(req, res, next)  => {
//     const newUserData= {
//         name: req.body.name,
//         email: req.body.email
//     }

//     // Update avatar : TODO

//     const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
//         new: true,
//         runValidators: true,
//         useFindAndModify: false
//     })

//     res.status(200).json({
//         success: true,
//     })
// })


// // Logout User route => /api/v1/logout
// exports.logout = catchAsyncErrors(async (req, res, next) => {
//     res.cookie('token', null, {
//         expires: new Date(Date.now()),
//         httpOnly: true
//     })

//     res.status(200).json({
//         success: true,
//         message: 'Logged out'
//     })
// })


// // Admin Routes 
// // Get all users => /api/v1/admin/users
// exports.allUsers = catchAsyncErrors(async (req, res, next) => {
//     const users = await User.find();

//     res.status(200).json({
//         success: true,
//         users
//     })
// })


// //Get User Deatils => /api/v1/admin/user/:id
// exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
//     const user = await User.findById(req.params.id);

//     if(!user) {
//         return next(new ErrorHandler(`User with id: ${req.params.id} not found`));
//     }

//     res.status(200).json({
//         success: true,
//         user
//     })
// })


// // Update  user  profile => /api/v1/admin/user:id
// exports.updateUser = catchAsyncErrors(async(req, res, next)  => {
//     const newUserData= {
//         name: req.body.name,
//         email: req.body.email,
//         role: req.body.role
//     }

//     const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
//         new: true,
//         runValidators: true,
//         useFindAndModify: false
//     })

//     res.status(200).json({
//         success: true,
//     })
// })


// //Delete User => /api/v1/admin/user/:id
// exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
//     const user = await User.findById(req.params.id);

//     if(!user) {
//         return next(new ErrorHandler(`User with id: ${req.params.id} not found`));
//     }


//     // Remove avatar from cloudinary : TODO


//     await user.remove()

//     res.status(200).json({
//         success: true,
//     })
// })


export {
    registerUser,
    // currentUserProfile,
    // updateProfile,
    // forgotPassword,
    // resetPassword,
    // allAdminUsers,
    // getUserDetails,
    // updateUser,
    // deleteUser
}