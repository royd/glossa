'use strict';
var fs = require('fs');
var path = require('path');

angular.module('glossa')
    .factory('nodeSrvc', nodeSrvc);

function nodeSrvc() {

    var uploadPath = 'uploads/';
    var fileArray = [];

    var service = {
        addFiles: addFiles,
        getFiles: getFiles
    };

    return service;
    //////////


    /**
     * Add files from user's selection to uploads direcoty
     * TODO: add validation for files with the same name
     * TODO: add validation for file types
     * TODO: maybe sort audio/video files
     *
     * @param files
     */
    function addFiles(files) {
        for (var key in files) {
            if (files.hasOwnProperty(key)) {
                fs.createReadStream(files[key].path).pipe(fs.createWriteStream(uploadPath + files[key].name));
                buildFileObject(files[key].name);
            }
        }
        return fileArray;
    }

    /**
     * Builds an object with file data to pass back to view to be consumed by angular
     *
     * @param file - a string of the file name
     */
    function buildFileObject(file) {
        var filePath = path.join(uploadPath, file);
        var tObj = {
            fileName: file,
            filePath: filePath
        };
        fileArray.push(tObj);
    }

    /**
     * The function is called when the controller is initialized
     * @returns {Array} - an array of file object for angular
     *
     * TODO: I don't like having to define the file path here and also in the build function
     */
    function getFiles() {
        fs.readdirSync(uploadPath).forEach(function(file) {
            var filePath = path.join(uploadPath, file);
            if (!fs.statSync(filePath).isDirectory()) {
                buildFileObject(file);
            }
        });
        return fileArray;
    }


    // function getDirectories(srcpath) {
    //     return fs.readdirSync(srcpath).filter(function(file) {
    //         return fs.statSync(path.join(srcpath, file)).isDirectory();
    //     });
    // }
    //
    // function getFiles(srcpath) {
    //     console.log("What I got "+srcpath);
    //     var files = fs.readdirSync(srcpath);
    //     return files.filter(function(file) {
    //         return !fs.statSync(path.join(srcpath, file)).isDirectory();
    //     });
    // }
    //
    // function getFileContent(srcpath) {
    //     return fs.readFileSync(srcpath, {encoding: 'utf-8'});
    // }
    //
    // function writeFile(srcpath,content) {
    //     fs.writeFile( srcpath, content, function(err) {
    //         if(err) {
    //             return console.log(err);
    //         }
    //
    //         console.log("The file was saved!");
    //     });
    // }

}