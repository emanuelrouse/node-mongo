const MongoClient = require('mongodb').MongoClient; // Client for the mongo server

const test = require('assert');

// Connection url

const url = 'mongodb://localhost:27017/';

// Database Name

const dbName = "nucampsite"; // database was already created through the mongo repl

// Connect using MongoClient

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    console.log('Connected correctly to server');

    const db = client.db(dbName);

    // create the campsites collection 
    // db.createCollection("campsites");
    // Still created some crazy bugs
    // Main takeaway with the tests is to make sure your collection is created before dropping the collection
    db.dropCollection('campsites', function (err, result) {

        const collection = db.collection('campsites');

        test.strictEqual(err, null);

        console.log('Droppped Collection', result);

        collection.insertOne({ name: "Breadcrumb Trail Campground", description: "Test" },
            function (err, result) {
                test.strictEqual(err, null);
                console.log('Insert Document:', result.ops);

                collection.find().toArray(function (err, docs) {
                    test.strictEqual(err, null);
                    console.log('Found Documents', docs);

                    client.close();
                });
            });
    });

});

// err callback pattern is used because we're working with asynchronus operations
// communication between node app and mongodb server is not synchronus 