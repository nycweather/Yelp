const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const reviews = require('../controllers/reviews')


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReviews));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReviews));

module.exports = router;