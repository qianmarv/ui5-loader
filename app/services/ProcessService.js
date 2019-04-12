"use strict";

const util = require('util');
const fs   = require('fs');
const path = require('path');
const exec = util.promisify(require('child_process').exec);

module.exports = {
  gitPull: async function(sPath){
    try{
      if(!fs.existsSync(sPath)){
        throw `Not a valid path: ${sPath}`;
      }
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
      if(!fs.existsSync(sDir)){
        throw `Root directory '${sDir}' not exist.`;
      }
      var sPath = path.join(sDir, sTarget);
      if(fs.existsSync(sPath)){
        // throw `Project already exist: ${sPath}`;
        return `Project already exist: ${sPath}, skip git clone.`;
      }else{
        const { stdout, stderr } = await exec(`cd ${sDir} && git clone ${sUrl} ${sTarget}`);
        console.log(stdout);
        console.log(stderr);
        return stderr === "" ? stdout : stderr;
      }
    }catch(err){
      console.log(err);
      return err.stderr;
    }
  },
  //WARNING: Dangerouse
  forceRemoveProject: async function(sDir, sTarget){
    try{

      const { stdout, stderr } = await exec(`cd ${sDir} && rm -rf ${sTarget}`);
      console.log(stdout);
      console.log(stderr);
      return stderr === "" ? stdout : stderr;
    } catch(err){
      console.log(err);
      return err.stderr;
    }
  }
};
