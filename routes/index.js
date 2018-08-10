const Router = require('koa-router');

const controllers = require('../controllers');

var router = new Router();
router.get('/appconfig/fioriSandboxConfig.json', controllers.appconfig.get);

module.exports = router;
