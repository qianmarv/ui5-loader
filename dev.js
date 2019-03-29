const Koa    = require('koa');
const mount  = require('koa-mount');
const serve  = require('koa-static');
const Router = require('koa-router');

const appconfig = require('./appconfig');
const path = require('path');


const router = new Router();

const app = new Koa();

var prj_dir = "/home/qianmarv/ws/fin.cons.ica.reconcase/webapp/"
// Load Fiori Launchpad Page
//app.use(mount("/", serve('static/')));


app.use(mount("/resources", serve("static/resources/")));

app.use(mount("/", serve(prj_dir)));


app.listen(3001,function(){
	console.log('listening on port 3001');
});
