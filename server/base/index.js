// Base routes for default index/root path, about page, 404 error pages, and others..
var qr = require('qr-image');

//var qr_svg = qr.image('I love QR!', { type: 'svg' });
//qr_svg.pipe(require('fs').createWriteStream('i_love_qr.svg'));

exports.register = function(server, options, next) {

    server.route([
        {
            method: 'GET',
            path: '/',
            config: {
                handler: function(request, reply){
                  // Render the view with the custom greeting
                    //var test = qr.imageSync('I love QR!', { type: 'svg' });
                    //console.log(test);
                    //var svg_string = qr.svgObject('I love QR!', { type: 'svg' });
                    var svg_obj = qr.svgObject('San Jose Center For The Performing Arts', { type: 'svg' });
                    //console.log(svg_string);
                    reply.view('index', {
                        title: 'Welcome to smart tree homepage',
                        qrcode: svg_obj.path
                    });
                },
                id: 'index'
            }
        },
        {
            method: 'GET',
            path: '/{path*}',
            config: {
                handler: function(request, reply){
                    reply.view('404', {
                        title: 'Page not found'
                    }).code(404);
                },
                id: '404'
            }
        }
    ]);

    next();
}

exports.register.attributes = {
    name: 'base'
};
