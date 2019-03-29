const Koa    = require('koa');
const mount  = require('koa-mount');
const serve  = require('koa-static');
const Router = require('koa-router');

const appconfig = require('./appconfig');
const path = require('path');


const router = new Router();

const app = new Koa();

// Router configures
router.get('/api/pull/:pid',async (ctx, next) =>{
  //TODO move to a sperate router module
  const util = require('util');
  const exec = util.promisify(require('child_process').exec);
  const path = require('path');

  async function gitpull(sProjectId){
    try{
      const { stdout, stderr } = await exec('cd ../' + sProjectId + ' && git pull');
      ctx.body = stderr === "" ? stdout : stderr;
    }catch(err){
      ctx.body = err.stderr;
    }
  }
  console.log(ctx.params.pid);
  await gitpull(ctx.params.pid);
});
 // const proxy = require('koa-proxies');
// const cors = require('koa2-cors');
//CORS
// app.use(cors({origin: '*'}));
// app.use(cors({
//   origin: function(ctx) {
//     if (ctx.url === '/test') {
//       return false;
//     }
//     return '*';
//   },
//   exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
//   maxAge: 5,
//   credentials: true,
//   allowMethods: ['GET', 'POST', 'DELETE'],
//   allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
// }));

//Proxy
 // app.use(proxy('/sap/opu',{
 //   target: 'https://ldai4er9.wdf.sap.corp:44300',
 //   secure: false,
 //   // changeOrigin: true,
 //   logs: true
 // }));

app.use(router.routes());

// Load Fiori Launchpad Page
app.use(mount("/", serve('static/')));

let apps = {};

// appconfig["main"] = {
//   path: "/home/qianmarv/ws/proj_mgmt",
//   title: "Project Management",
//   namespace: "mycompany.myapp.MyWorkListApp",
//   semantic_object: "project",
//   action: "maintain"
// };

for(let k in appconfig){
  let v = appconfig[k];
  let prj_dir = path.join(v.path, "webapp");
  let namespace = v.namespace;
  let nav_key = v.semantic_object+"-"+v.action;
  console.log("Load Project - " + prj_dir);

  const subapp = new Koa();
  subapp.use(serve(prj_dir));

  // Register Sub Apps
  app.use(mount("/"+nav_key, serve(prj_dir)));

  apps[nav_key] = {
    "additionalInformation": "SAPUI5.Component="+namespace,
    "applicationType": "URL",
    "url": "/" + nav_key,
    "title": v.title
  };
}

// Register Configurations
app.use(mount("/appconfig/fioriSandboxConfig.json", async (ctx, next)=>{
  await next();
  ctx.body = {
    "applications": apps
  };
}));
// const router = require('./routes');
// app.use(router.routes());

// app.use(serve({rootDir: 'webapps', rootPath: 'fin.cons.fsimap.maintain'}))

app.listen(3000,function(){
  console.log('listening on port 3000');
});
