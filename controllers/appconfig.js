module.exports = {
    get : ctx => {
        ctx.body =
            {
                "applications": {
                    "MapFSItemswithGLAccounts-display": {
                        "additionalInformation": "SAPUI5.Component=fin.cons.fsimap.maintain",
                        "applicationType": "URL",
                        "url": "/public",
                        "title": "Map FS Items with G/L Accounts"
                    }
                }
            };
    }
}
