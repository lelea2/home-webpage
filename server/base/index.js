// Base routes for default index/root path, about page, 404 error pages, and others..
var qr = require('qr-image');
var axios = require('axios');

//var qr_svg = qr.image('I love QR!', { type: 'svg' });
//qr_svg.pipe(require('fs').createWriteStream('i_love_qr.svg'));

exports.register = function(server, options, next) {

    function generateBarCode(data, key) {
        for (var i = 0; i < data.length; i++) {
            console.log(data[i][key]);
            data[i].qrcode = qr.svgObject(data[i][key], { type: 'svg', size: 5 }).path;
        }
        console.log(data);
        return data;
    }

    server.route([{
        method: 'GET',
        path: '/',
        config: {
            handler: function(request, reply){
                axios.get('https://secure-dusk-26659.herokuapp.com/trees')
                    .then(function (response) {
                        reply.view('index', {
                            title: 'Welcome to smart tree homepage',
                            trees: generateBarCode(response.data, 'id')
                        });
                    }).catch(function (err) {
                        reply.view('index', {
                            title: 'Welcome to smart tree homepage',
                            trees: [] //don't display tree
                        });
                    });
            },
            id: 'index'
        }
    }, {
        method: 'GET',
        path: '/faketree',
        config: {
            handler: function(request, reply) {
                var svg_obj1 = qr.svgObject('8f14886c-d267-44b8-8518-8cf363634929', { type: 'svg', size: 5 });
                var svg_obj2 = qr.svgObject('45304c60-9eac-48bf-9d0b-c02dda6c6cb3', { type: 'svg', size: 5 });
                //console.log(svg_string);
                reply.view('faketree', {
                    title: 'Welcome to smart tree homepage',
                    qrcode1: svg_obj1.path,
                    qrcode2: svg_obj2.path
                });
            },
            id: 'fake_tree'
        }
    }, {
        method: 'GET',
        path: '/users',
        config: {
            handler: function(request, reply){
                axios.get('https://secure-dusk-26659.herokuapp.com/users')
                    .then(function (response) {
                        reply.view('user', {
                            title: 'Scan barcode to login',
                            users: generateBarCode(response.data, 'userId')
                        });
                    }).catch(function (err) {
                        console.log(err);
                        reply.view('user', {
                            title: 'Scan barcode to login',
                            users: [] //don't display users
                        });
                    });
            },
            id: 'user'
        }
    }, {
        method: 'GET',
        path: '/photos/{treeId}',
        config: {
            handler: function(request, reply) {
                var treeId = request.params.treeId;
                axios.get('https://secure-dusk-26659.herokuapp.com/tree/' + treeId + '/photos')
                    .then(function (response) {
                        reply.view('photos', {
                            title: 'Photos available',
                            photos: response.data
                        });
                    }).catch(function (err) {
                        console.log(err);
                        reply.view('photos', {
                            title: 'Photos available',
                            photos: [] //don't display users
                        });
                    });
            },
            id: 'photos'
        }
    }]);

    next();
}

exports.register.attributes = {
    name: 'base'
};
