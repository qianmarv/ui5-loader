const router = require('koa-router')();
const serve  = require('koa-router-static');

module.exports = router.get('/test-resources', serve('../webapps/test-resources/'));
