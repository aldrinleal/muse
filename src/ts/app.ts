/// <reference path="../../typings/tsd.d.ts" />

import main = require("./main")

var app = main.Main.create(process.argv)

console.log("app", app)

app.execute()