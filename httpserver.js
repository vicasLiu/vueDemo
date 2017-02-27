var colors     = require('colors'),
    os         = require('os'),
    HttpServer = require('http-server').HttpServer,
    opener     = require('opener');

var ifaces = os.networkInterfaces();

module.exports = function(opt, callback){

    var port = opt.port,
        host = opt.host || '0.0.0.0',
        ssl = opt.ssl,
        proxy = opt.proxy,
        server;

    server = new HttpServer(opt);
    
    server.listen(port, host, function () {
        var canonicalHost = host === '0.0.0.0' ? '127.0.0.1' : host,
            protocol = ssl ? 'https://' : 'http://';

        console.info(['Starting up http-server, serving '.yellow,
        opt.root,
        ssl ? (' through'.yellow + ' https'.cyan) : '',
        '\nAvailable on:'.yellow
        ].join(''));

        if (host !== '0.0.0.0') {
            console.info(('  ' + protocol + canonicalHost + ':' + port.toString()).green);
        }
        else {
            Object.keys(ifaces).forEach(function (dev) {
                ifaces[dev].forEach(function (details) {
                    if (details.family === 'IPv4') {
                        console.info(('  ' + protocol + details.address + ':' + port.toString()).green);
                    }
                });
            });
        }

        if (typeof proxy === 'string') {
            console.info('Unhandled requests will be served from: ' + proxy);
        }

        console.info('Hit CTRL-C to stop the server');
        if (opt.open) {
            opener(
                protocol + '//' + canonicalHost + ':' + port
            );
        };

        if(typeof callback === 'function'){
            callback();
        };
    });

    return server;
};
