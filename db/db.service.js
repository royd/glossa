'use strict';

angular.module('glossa')
    .factory('dbSrvc', dbSrvc);

function dbSrvc($q) {
    var service = {
        find: find,
        insert: insert,
        update: update
    };

    return service;
    ///////////////

    function find(db, query) {
        var deferred = $q.defer();
        db.find(query, function(err, docs) {
            if (err) {
                console.log('There was an error with the query: ' + query + 'with db: ' + db);
                deferred.reject(err);
            } else {
                console.log('Queried all files in database.');
                deferred.resolve(docs);
            }
        });
        return deferred.promise;
    }

    function insert(db, data) {
        var deferred = $q.defer();
        db.insert(data, function(err, doc) {
            if (err) {
                console.log('There was an error saving file data to the DB', err);
                deferred.reject(err);
            } else {
                console.log('File data was saved to the DB', doc);
                deferred.resolve(doc);
            }
        });
        return deferred.promise;
    }

    function update(db, data) {
        console.log('data', data);
        db.update({_id: data.fileId}, { $set: data.field }, data.options, function(err, numReplaced) {
            if (err) {
                console.log('There was an error updating the file', err);
            }
            console.log('updating data');
        })
    }
}