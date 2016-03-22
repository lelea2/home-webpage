#### CMPE235

Web homepage for CMPE235, implemented on HAPI express.js framwork

```
npm install hapi --save

### Install nodemon, which will detect changes in you file and do server hot reload
sudo npm install -g nodemon

nodemon -w ./index.js

```

##### Start to create your hapi server
```javascript
'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const Boom = require('boom');
const Path = require('path');

server.connection({
  host: localhost,
  port: 8000
});

//inert plugin is function to handle your static file in hapi
server.register(require('inert') () => {
  /**
   * Routing in hapi
   */
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      //reply('hello hapi');
      //reply can take object and change content header according, or can use Promise
      //reply(Boom.notFound());
      //let resp = reply('Hello world');
      //resp.code(418)
      //resp.state('hello', 'world'); //set cookies in hapi
      reply('hello world')
        .code(418)
        .type('text/plain')
        .header('hello', 'world') //set header objec
        .state('hello', 'world'); //set cookie
    }
  });

  server.route({
    method: 'GET',
    path: '/{param*}'
    handler: {
      directory { //inert plugin support to view static file
        path: Path.join(__dirname, 'public');
      }
    }
  });

  //Example for parameter
  function handler(request, reply) {
    reply(request.params);
  }

  server.route({
    method: 'GET',
    path: '/files/{files*2}' //{file}.jpeg OR {userId} OR {userId?} //can or cannot have userId
    handler: handler
  });

  server.start(() => console.log('Start at ${server.info.uri'));
});
```

###### Hapi view engine with the use of "vision"

```javascript
server.register(require('vision') => () {
  server.views({
    engines: {
      hbs: require('handlebars')
    },
    relativeTo: __dirnname,
    layout: true, //use layout partial
    path: 'views'
  });

  server.route({
    method: 'GET',
    path: '{name?}',
    handler: function(request, reply) {
      reply.view('home', {name: request.params.name || 'World'});
    }
  });
  server.start(() => console.log('Start at ${server.info.uri'));

});
```

###### Hapi to handle POST and PUT request
* Hapi parse object automatically

```javascript
'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const Boom = require('boom');
const Path = require('path');

server.connection({
  host: localhost,
  port: 8000
});

server.route({
  method: ['POST', 'PUT'],
  path: '/',
  config: {
    payload: {
      output: 'data',
      parse: false,
      allow: 'application/json'
    }
  },
  handler: function(request, reply) {
    reply(request.payload);
  }
});

server.start(() => {});

### Result
> http -v --form PUT localhost:8080 fname=Mike lname=Frey
> {
>   "error": "Unsupported Media Type",
>   "statusCode": 415
> }
```

###### Extending the request with lifecycle events
As next() in express.js ==> reply.continue(). Order in sequences below
* onRequest
* onPreAuth
* onPostAuth
* onPreHandler
* handler
* onPostHandler
* onPreResponse

```javascript
server.ext('onRequest', (request, reply) => {
  console.log('onRequest');
  reply.continue();
});

server.ext('onPreHandler', (request, resply) => {
  console.log('onPreHandler');
  reply.continue();
});

server.ext('onPostHandler', (request, resply) => {
  console.log('onPostHandler');
  reply.continue();
});

server.ext('onPreResponse', (request, resply) => {
  console.log('onPreResponse');
  reply.continue();
});

server.route({
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    console.log('handler');
    reply('hello world');
  }
});

```

###### Hapi to handle bad request

```javascript
'use strict';
const Hapi = require('hapi');
const Boom = require('boom');
const server = new Hapi.Server();
server.connection({ port: 8000 });

server.register(require('vision'), () => {

  server.views({
    engines: { hbs: require('handlebars') },
    relativeTo: __dirname,
    path: 'views'
  });

  server.ext('onPreResponse', (request, reply) => {
    let resp = request.response;
    if (resp.isBoom) {
      return reply.view('error', resp.output.payload).code(resp.output.statusCode);
    }
    reply.continue();
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      reply(Boom.badRequest());
      //reply(Boom.notFound());
    }
  });

  server.start(() => {});

});

```

###### Hapi to handle request validation with Joi

```javascript
'use strict';
const Hapi = require('hapi');
const Joi = require('joi');
const server = new Hapi.Server();
server.connection({ port: 8000 });

server.route({
  method: ['POST','PUT'],
  path: '/user/{id?}',
  config: {
    validate: {
      params: Joi.object().keys({
        id: Joi.number()
      }),
      payload: Joi.object().keys({
        id: Joi.number()
        email: Joi.string()
      }).unknown(),
      query: Joi.object().keys({
        id: Joi.number()
      })
    },
    handler: function(request, reply) {
      reply({
        params: request.params,
        query: request.query
        payload: request.payload
      });
    }
  }
});

server.start(() => console.log(`Started at: ${server.info.uri}`))

```

##### Hapi manage cookies through state

Express middleware concept. State is used to set cookies in route response

```javascript
'use strict';
const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({ port: 8000 });

server.state('hello', {
  ttl: 60 * 60 * 1000,
  isHttpOnly: true,
  encoding: 'iron',
  password: 'a5LewP10pXNbWUdYQakUfVlk1jUVuLuUU6E1WEE302k'
});

server.route({
  method: 'GET',
  path: '/',
  config: {
    handler: function(request, reply) {
      let hello = request.state.hello;
      reply(`Cookies! ${hello}`)
        .state('hello', 'world')
    }
  }
});

server.start(() => console.log(`Started at: ${server.info.uri}`));

```
