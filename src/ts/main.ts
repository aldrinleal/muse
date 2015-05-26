/// <reference path="../../typings/node/node.d.ts" />

import cliparser = require("./cliparser");
import Promise = require("tspromise")
import model = require("./model");
import context = require("./context");
import fs = require("fs");

export class Main {
    ctx: context.Context
    
    constructor(newContext: context.Context) {
        
        this.ctx = newContext
    }

    cmd_init() {
        var templateContent = model.Configuration.generateTemplate()

        console.log(this.ctx.ready)
        console.dir(this.ctx.ready)
        //var configFile = this.ctx.ready.then.value()

        //fs.writeFile(configFile, templateContent)

        //console.log(`Configuration skeleton written into ${configFile}`)
    }

    cmd_install() {
        console.log("cmd_install()")
    }

    static create(args = process.argv) {
        var cliParser = new cliparser.CLIParser()

        var parsed_args = cliParser.parse(process.argv)

        var newCtx = new context.Context({
            verbose: <boolean>args["--verbose"],
            directory: <string>args["--directory"],
            args: parsed_args
        })

        var result = new Main(newCtx)
        
        // console.log("create()", result)
        
        return result
    }

    /***
     * Method/call Dispatcher
     */
    execute() {
        var commandToCall: any

        for (var key in this.ctx.args) {
            var functionName = `cmd_${ key }`

            var commandMatched = 'function' === typeof Main.prototype[functionName]

            if (commandMatched) {
                commandToCall = Main.prototype[functionName]

                break
            }
        }

        if (commandToCall) {
            commandToCall()
        } else {
            throw new Error("Command not implemented!")
        }
    }
}
