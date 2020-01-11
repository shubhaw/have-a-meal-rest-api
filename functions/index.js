const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const cors = require('cors')({ origin: true });

exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});


exports.getRestaurants = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        //   response.status(500).send({test: 'Testing functions'});
        admin.firestore().collection('restaurants').get()
            .then(data => {

                let restaurants = [];
                data.forEach(restaurant => {
                    restaurants.push(
                        {
                            id: restaurant.id,
                            ...restaurant.data(),
                        }
                    );
                });
                return response.json(restaurants);
            })
            .catch(err => console.error(err));
    })
});

exports.getRestaurantFoodItems = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        admin.firestore().collection('restaurants').doc(request.query.id).collection('foodItems').get()
            .then(data => {
                let foodItems = [];
                data.forEach(foodItem => {
                    foodItems.push(
                        {
                            id: foodItem.id,
                            ...foodItem.data(),
                        }
                    );
                });
                return response.json(foodItems);
            })
            .catch(err => console.error(err));
    })
});
