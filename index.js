const MongoClient = require('mongodb').MongoClient; // Client for the mongo server
const assert = require('assert');
const dboper = require('./operations');

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
    // Main takeaway with the asserts is to make sure your collection is created before dropping the collection
    db.dropCollection('campsites', function (err, result) {


        assert.strictEqual(err, null);

        console.log('Droppped Collection', result);

        dboper.insertDocument(db, { name: "Breadcrumb Trail Campground", description: "test" }, 'campsites', result => {
            console.log('Insert Document:', result.ops);

            dboper.findDocuments(db, 'campsites', docs => {
                console.log('Found Documents', docs);

                dboper.updateDocument(db, { name: "Breadcrumb Trail Campground" }, { description: "Updated Test Description" }, 'campsites', result => {
                    console.log('Updated Document Count:', result.result.nModified);

                    dboper.findDocuments(db, 'campsites', docs => {
                        console.log('Found Documents', docs);

                        dboper.removeDocument(db, { name: "Breadcrumb Trail Campground" },
                            'campsites', result => {
                                console.log('Deleted Document Count:', result.deletedCount);

                                client.close();
                            }
                        );
                    })
                });
            });
        });
    });
});


// MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {

//     assert.strictEqual(err, null);

//     console.log('Connected correctly to server');

//     const db = client.db(dbname);

//     db.dropCollection('campsites', (err, result) => {
//         assert.strictEqual(err, null);
//         console.log('Dropped Collection:', result);

//         dboper.insertDocument(db, { name: "Breadcrumb Trail Campground", description: "Test" },
//             'campsites', result => {
//                 console.log('Insert Document:', result.ops);

//                 dboper.findDocuments(db, 'campsites', docs => {
//                     console.log('Found Documents:', docs);

//                     dboper.updateDocument(db, { name: "Breadcrumb Trail Campground" },
//                         { description: "Updated Test Description" }, 'campsites',
//                         result => {
//                             console.log('Updated Document Count:', result.result.nModified);

//                             dboper.findDocuments(db, 'campsites', docs => {
//                                 console.log('Found Documents:', docs);

//                                 dboper.removeDocument(db, { name: "Breadcrumb Trail Campground" },
//                                     'campsites', result => {
//                                         console.log('Deleted Document Count:', result.deletedCount);

//                                         client.close();
//                                     }
//                                 );
//                             });
//                         }
//                     );
//                 });
//             });
//     });
// });
// err callback pattern is used because we're working with asynchronus operations
// communication between node app and mongodb server is not synchronus
// Defining vs Calling
// Defining: Will do once run
// Calling: Execute the code