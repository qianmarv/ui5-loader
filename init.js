const JsonDB = require('node-json-db');
const Config  = require('node-json-db/lib/JsonDBConfig');

// import { Config } from 'node-json-db/lib/JsonDBConfig';

var db = new JsonDB(new Config("ui5loader", true, false, '/'));


db.push("/config",{
  project_root: "/var/www",
  proxy_resource: false
});
db.push("/project",{});
