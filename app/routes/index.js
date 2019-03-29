const Router = require('koa-router'),
      KoaBody = require('koa-body'),
      {listTiles, createTile, updateTile, deleteTile} = require('../controllers/tileController'),
      {listApps,generateApps,syncApp} = require('../controllers/appController');

const router = new Router();

router
  .get('/appconfig/fioriSandboxConfig.json', listApps)
  .get('/api/app/generate', generateApps)
  .get('/api/app/sync/:id', syncApp)
  .get('/api/tiles', listTiles)
  .delete('/api/tile/:id', deleteTile)
  .post('/api/tile/:id', KoaBody(), updateTile)
  .put('/api/tile', KoaBody(), createTile);

module.exports = {
  routes () {
    return router.routes();
  },
  allowedMethods(){
    return router.allowedMethods();
  }
}
