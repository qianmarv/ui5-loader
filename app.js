const Koa   = require('koa');
const mount = require('koa-mount');
const serve = require('koa-static');

const appconfig = require('./appconfig');
const path = require('path');

const app = new Koa();

// Load Fiori Launchpad Page
app.use(mount("/", serve('static/')));

let apps = {};
for(let k in appconfig){
    let v = appconfig[k];
    let prj_dir = path.join(v.path, "webapp");
    let nav_key = v.semantic_object+"-"+v.action;
    console.log("Project Path: " + prj_dir);

    const subapp = new Koa();
    subapp.use(serve(prj_dir));

    // Register Sub Apps
    app.use(mount("/"+nav_key, serve(prj_dir)));

    apps[nav_key] = {
        "additionalInformation": "SAPUI5.Component="+k,
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
