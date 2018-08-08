const serve = require('koa-static');
const Koa = require('koa');
const app = new Koa();

const reload = require('reload')

// app.use(serve('webapps/fin.cons.fsimap.maintain'));
app.use(serve('webapps/Walkthrough/webapp'))
app.use(serve('webapps/sapui5-dist'))

// app.use(serve({rootDir: 'webapps', rootPath: 'fin.cons.fsimap.maintain'}))
reload(app);

app.listen(3000,function(){
    console.log('listening on port 3000');
    if(process.send){
        process.send('online');
    };
});
