  
function makeReviewsArray() {
    return [
    {
    content: "test 1",
    id: 1,
    rating: 4,
    plantid: 1
    },
    {
    content: "test 2",
    id: 2,
    rating: 3,
    plantid: 2
  },
    {
        content: "test 3",
        id: 3,
        rating: 5,
        plantid: 3
        },
        {
        content: "test 4",
        id: 4,
        rating: 5,
         plantid: 4
            },
]
}
function makeMaliciousReview() {
    const maliciousReview = {
        content:'Naughty naughty very naughty <script>alert("xss");</script>',
        id: 911,
        rating: 5,
        plantid: 4,
    }
    const expectedReview = {
        ...maliciousReview,
        content: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    }
    return {
        maliciousReview,
        expectedReview,
    }
}


module.exports = {
    makeReviewsArray,
    makeMaliciousReview
  };

  