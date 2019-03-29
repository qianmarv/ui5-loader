"use strict";

const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
  gitPull: async function(sPath){
    try{
      const { stdout, stderr } = await exec(`cd ${sPath} && git pull`);
      console.log(stdout);
      console.log(stderr);
      return stderr === "" ? stdout : stderr;
    }catch(err){
      console.log(err);
      return err.stderr;
    }
  },
  gitClone: async function(sDir, sUrl, sTarget){
    sTarget = sTarget || "";
    try{
      const { stdout, stderr } = await exec(`cd ${sDir} && git clone ${sUrl} ${sTarget}`);
      console.log(stdout);
      console.log(stderr);
      return stderr === "" ? stdout : stderr;
    }catch(err){
      console.log(err);
      return err.stderr;
    }
  }
};
