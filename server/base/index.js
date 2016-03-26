// Base routes for default index/root path, about page, 404 error pages, and others..
var qr = require('qr-image');

//var qr_svg = qr.image('I love QR!', { type: 'svg' });
//qr_svg.pipe(require('fs').createWriteStream('i_love_qr.svg'));

exports.register = function(server, options, next) {

    server.route([{
        method: 'GET',
        path: '/',
        config: {
            handler: function(request, reply){
                // Render the view with the custom greeting
                var svg_obj1 = qr.svgObject('8f14886c-d267-44b8-8518-8cf363634929', { type: 'svg', size: 5 });
                var svg_obj2 = qr.svgObject('45304c60-9eac-48bf-9d0b-c02dda6c6cb3', { type: 'svg', size: 5 });
                //console.log(svg_string);
                reply.view('index', {
                    title: 'Welcome to smart tree homepage',
                    qrcode1: svg_obj1.path,
                    qrcode2: svg_obj2.path
                });
            },
            id: 'index'
        }
    }, {
        method: 'GET',
        path: '/user',
        config: {
            handler: function(request, reply){
                // Render the view with the custom greeting
                var svg_obj1 = qr.svgObject('a4be9c46-ee9f-4a11-961e-821d1487659b', { type: 'svg', size: 5 });
                //console.log(svg_string);
                reply.view('user', {
                    title: 'Scan barcode to login',
                    qrcode1: svg_obj1.path
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
