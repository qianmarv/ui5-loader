const Koa = require('koa');
const cors = require('@koa/cors');

const app = new Koa();


// CORS https://github.com/koajs/cors
app.use(cors({
    origin: '*'
}));

const serve = require('koa-static');
app.use(serve('webapps/'));

const router = require('./routes');
app.use(router.routes());

// app.use(serve({rootDir: 'webapps', rootPath: 'fin.cons.fsimap.maintain'}))

app.listen(3000,function(){
    console.log('listening on port 3000');
});
