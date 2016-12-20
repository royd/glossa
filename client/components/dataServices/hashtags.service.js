'use strict';
//node modules
var db = require('../db/database'),
    _ = require('lodash'),
    hashtagsCol = db.hashtags,
    fileCollection = db.uploadedFiles,
    nbCollection = db.notebooks,
    util = require('../client/components/node/file.utils');

angular.module('glossa')
    .factory('hashtagSrvc', hashtagSrvc);


function hashtagSrvc(dbSrvc, $q) {
    var service = {
        searchHastags: searchHastags,
        updateTag: updateTag,
        createHashtag: createHashtag,
        normalizeHashtag: normalizeHashtag,
        get: get,
        removeHashtag: removeHashtag
    };

    return service;
    ///////////////

    function get() {
        return dbSrvc.find(hashtagsCol, {}).then(function(docs) {
            return docs;
        })
    }

    function searchHastags(term) {
        var query = {
            tag:  new RegExp(term, 'i')
        };
        return dbSrvc.find(hashtagsCol, query).then(function(result) {
            return result;
        })
    }

    function updateTag(objectToUpdate) {
        return dbSrvc.basicUpdate(hashtagsCol, objectToUpdate)
    }

    function createHashtag(term) {
        var hashtag = {
            tag: term,
        };

        hashtag.tagColor = '#4285f4';
        hashtag.realTitle = hashtag.tag;
        hashtag.canEdit = true;
        hashtag.createdAt = Date.now();

        return dbSrvc.insert(hashtagsCol, hashtag).then(function(res) {
            console.log('result from insertion into db', res);
            return res.data;
        });
    }

    function normalizeHashtag(tag) {
        return dbSrvc.find(nbCollection, {"hashtags._id": tag._id}).then(function(result) {

            var promises = [];

            result.data.forEach(function(nb, i) {

                //Modify the data
                nb.hashtags.forEach(function(t, index) {
                    if (t._id === tag._id) {
                        nb.hashtags[index] = tag;
                    }
                });

                promises.push(dbSrvc.basicUpdate(nbCollection, nb));

            });

           return $q.all(promises).then(function(result) {
                console.log('All promises have resolved: result', result);
                console.log("This is where we could send a notifcation to user or something");
                return result;
            });

        }).catch(function(err) {
            console.log('there was an error', err);
        });
    }

    function removeHashtag(tag) {
        var promises = [];

        promises.push(dbSrvc.remove(hashtagsCol, tag._id));

        return dbSrvc.find(nbCollection, {"hashtags._id": tag._id}).then(function(result) {

            var re = new RegExp('#'+ tag.tag, "gi");
            result.data.forEach(function(nb, i) {

                console.log('nb', nb);
                console.log('nb.description', nb.description);

                // nb.description = nb.description.replace(re, '');
                console.log('nb.description after replace ', nb.description);


                //Modify the data
                nb.hashtags.forEach(function(t, index) {
                    if (t._id === tag._id) {
                        console.log('t', t);
                        console.log('nb.hashtags[index]', nb.hashtags[index]);
                        delete nb.hashtags[index];
                        if (!nb.hashtags.length || !nb.hashtags) {
                            delete nb.hashtags;
                        }
                    }
                });

                console.log('nb after modification', nb);

                promises.push(dbSrvc.basicUpdate(nbCollection, nb));

            });


            return $q.all(promises).then(function(result) {
                console.log('All promises have resolved: result', result);
                console.log("This is where we could send a notifcation to user or something");
                return result;
            });

        })
    }
}