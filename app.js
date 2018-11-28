const Koa   = require('koa');
const mount = require('koa-mount');
const serve = require('koa-static');

const appconfig = require('./appconfig');
const path = require('path');

const app = new Koa();

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
//   target: 'http://ldcier9.wdf.sap.corp:50000',
//   changeOrigin: true,
//   logs: true
// }));



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
