// Base routes for default index/root path, about page, 404 error pages, and others..
var qr = require('qr-image');
var axios = require('axios');

//var qr_svg = qr.image('I love QR!', { type: 'svg' });
//qr_svg.pipe(require('fs').createWriteStream('i_love_qr.svg'));

exports.register = function(server, options, next) {

    function generateBarCode(data, key) {
        for (var i = 0; i < data.length; i++) {
            data[i].qrcode = qr.svgObject(data[i][key], { type: 'svg', size: 5 }).path;
        }
        //console.log(data);
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
    }]);

    next();
}

exports.register.attributes = {
    name: 'base'
};
