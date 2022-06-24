const Koa = require('koa')
// const router = require('@koa/router')()
const CSRF = require('koa-csrf')
const cors = require('@koa/cors')
const fs= require('fs')
const readme= fs.readFileSync('./readme.md')
const app = new Koa()
/**
 * csrf middleware
 */

// app.use(new CSRF());

app.use(cors())
// add the CSRF middleware
app.use(new CSRF({
  invalidTokenMessage: 'Invalid CSRF token',
  invalidTokenStatusCode: 403,
  excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
  disableQuery: false
}));

// // your middleware here (e.g. parse a form submit)
// app.use((ctx, next) => {
//   if (![ 'GET', 'POST' ].includes(ctx.method))
//     return next();
//   if (ctx.method === 'GET') {
//     ctx.body = ctx.csrf;
//     return;
//   }
//   ctx.body = 'OK';
// });

app.use(async (ctx) => {
    ctx.body = readme
})


app.listen(3002)
console.log('listenning on 3002')
