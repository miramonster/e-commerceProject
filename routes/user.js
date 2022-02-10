const express = require('express')
const router = express.Router()
const models = require('../models')
const bcrypt = require('bcrypt')
const formidable = require('formidable')
const res = require('express/lib/response')
const{v4: uuidv4} = require('uuid')

// Allowing user to upload an image to add to their listing, also generates uuid
function uploadFile(req, callback) {

    new formidable.IncomingForm().parse(req)
    .on('fileBegin', (name, file) => {
        uniqueFilename = `${uuidv4()}.${file.name.split('.').pop()}`
        file.name = uniqueFilename
        file.path = __basedir + '/static/uploads/' + file.name
    })
    .on('file', (name, file) => {
        callback(file.name)
    })
}

// Uploading image to uploads folder
router.post('/upload', (req, res) => {
    uploadFile(req, (photoURL) => {
        photoURL = `/uploads/${photoURL}`
        res.render('add-listing', {imageURL:photoURL, className:'product-preview-image'})
    })
})

function authenticateMiddleware(req, res, next) {
    if(req.session) {
        if(req.session.user) {
            // send the user to their original request
            next()
        } else {
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
}

function calculateAvgRating(array) {
    const totalRating = array.reduce((average, array) => average + array.rating, 0)
    let avgRating = totalRating/array.length
    if (isNaN(avgRating)) {
        return 0
    } else {
        return avgRating
    }
}


// Fetching and display listing to edit
router.get('/listing/edit/:listingId', (req, res) => {
    const listingId = req.params.listingId
    models.Product.findByPk(listingId)
    .then((listing) => {
        res.render('edit-listing', {oneListing: listing, log:"Logout"})
    })
})
// Render Seller's profile page - Profile page display Seller's user-reviews and listings
router.get('/profile/:username/:userId', (req, res) => {
    const userId = parseInt(req.params.userId)
    models.User.findByPk(userId, {
        include: [
            {
                model: models.Product,
                as: "listings",
                where: {user_id:userId},
                include:[
                    {
                        model:models.Review,
                        as:"reviews",
                    
                    },
                    {
                        model:models.User,
                        as:"user"
                    }
                    ]

            },
            {
                model:models.SellerReview,
                as: "sellerreviews",
                include:[{
                    model:models.User,
                    as:"sellerreviewer"
                }]
            }
        ]
    })
    .then((user) => {
        // Getting Seller Reviews + Rating
        const reviews = user.dataValues.sellerreviews
        const listings = user.dataValues.listings
        user.dataValues.avgRating = calculateAvgRating(reviews).toFixed(2)
        user.dataValues.reviewAmt = reviews.length
        const avgRating = user.dataValues.avgRating
        const reviewAmt = user.dataValues.reviewAmt
        const seller = user.dataValues
        
        // Getting Rating for Items within Sellers Page Profile
        const listingReviews = listings.map((listing) => {
            for(var i=0; i<listing.reviews.length; i++) {
                return listing.reviews[i]
            }
        })
        
        // Mapping the listings to retrieve the average rating for the listings displayed
        const editedListings = listings.map((listingReviews) => {
            const reviews = listingReviews.dataValues.reviews
            listingReviews.dataValues.avg_rating = calculateAvgRating(reviews).toFixed(2)
            listingReviews.dataValues.review_amt = reviews.length
            console.log(reviews)
            return listingReviews.dataValues
        })
        if (req.session.user) {
            res.render('profile', 
            {   
                reviews:reviews, 
                listings:editedListings, 
                    avgRating:avgRating, 
                    reviewAmt:reviewAmt,
                    user: seller,
                    log:"Logout"
                }
                )
            } else {
                res.render('profile', 
                {   
                    reviews:reviews, 
                    listings:listings, 
                    avgRating:avgRating, 
                    reviewAmt:reviewAmt,
                    user: seller,
                    log:"Login"
                }
                )
            }
        })
})
    

// Rendering add-listing mustache
router.get('/dashboard/add-listing', (req,res) => {
    res.render('add-listing', {log:"Logout"})
})
    
// Rendering Dashboard mustache
router.get('/dashboard', authenticateMiddleware, (req, res) => {
    const userId = req.session.userId
    models.Product.findAll({
        where: {
            user_id: userId
        },
        include: [
            {
                model: models.User,
                as: "user"
            },
            {
                model: models.Review,
                as: "reviews",
            }
        ]

    })
    .then((listings) => {

        const editedListings = listings.map((product) => {
            const reviews = product.dataValues.reviews
            product.dataValues.avg_rating = calculateAvgRating(reviews).toFixed(2)
            product.dataValues.reviewAmt = reviews.length
            return product.dataValues
            
        })

        console.log(listings)

        res.render('user-dashboard',{userListings:editedListings, log:"Logout"})
    
    })
})
    
// Rendering user's reviews
router.get('/dashboard/reviews', authenticateMiddleware, (req, res) => {
    const userId = req.session.userId
    models.Review.findAll({
        where: {
            user_id: userId
        },
        include: [
            {
                model: models.User,
                as: "reviewer"
            }
        ]

    })
    .then((review) => {
        res.render('reviews',{userReviews:review, log:"Logout"})
    })
})

// Adding a user review to the seller's profile page
router.post('/profile/:userId/review', (req, res) => {
        
        const title = req.body.titleText
        const body = req.body.bodyText
        const sellerUserId = req.body.userIdText
        const userId = req.session.userId
        const rating = parseInt(req.body.reviewValue)
        const username = req.body.usernameText

    const review = models.SellerReview.build({
        title: title,
        body: body,
        user_id: userId,
        rating: rating,
        seller_id: sellerUserId
    })
    
    review.save().then(() => {
        res.redirect(`/user/profile/${username}/${sellerUserId}`)
    })

    
})


// Creating a listing to sell
router.post('/add-listing', (req, res) => {
    
    const userId = req.session.userId
    const title = req.body.titleText
    const description = req.body.descriptionText
    const price = req.body.priceText
    const category = req.body.categoryText

    const product = models.Product.build({
        title: title,
        description: description,
        price: price,
        category: category,
        user_id: userId,
        image: uniqueFilename
    })
    product.save().then(() => {
        res.redirect('/user/dashboard')
    })

})


// Updating Listing
router.post('/listing/update/:listingId', (req, res) => {
    const userId = req.session.userId
    const title = req.body.titleText
    const description = req.body.descriptionText
    const category = req.body.categoryText
    const listingId = req.params.listingId
    models.Product.update({
        title: title,
        description: description,
        category: category,
        userId: userId

    }, {
        where: {
            id: listingId
        }
    }).then(() => {
        res.redirect('/user/dashboard') 
    })
})


// Deleting a listing and its comments (cascade)
router.post('/listing/delete/:listingId', (req, res) => {
    const listingId = req.params.listingId
    models.Product.destroy({
        where: {
            id : listingId
        }
    }).then(() => {
        res.redirect('/user/dashboard')
    })
})



module.exports = router