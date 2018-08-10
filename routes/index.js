const Router = require('koa-router');

const controllers = require('../controllers');

var router = new Router();
router.get('/appconfig/fioriSandboxConfig.json', controllers.app.get);
// router.get('/', controllers.home.get);

module.exports = router;
