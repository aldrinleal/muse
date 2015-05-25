/// <reference path="../../typings/node/node.d.ts" />

import cliparser = require("./cliparser");

import ctx = require("./context");

export class Main {
    ctx: ctx.Context;

    cmd_init() {
        console.log("cmd_init()");
    }

    cmd_install() {
        console.log("cmd_install()");
    }

    execute() {
        var cliParser = new cliparser.CLIParser();

        var args = cliParser.parse(process.argv);

        this.ctx = new ctx.Context({
            verbose: <boolean>args["--verbose"],
            directory: <string>args["--directory"],
        });

        var commandToCall: any;

        for (var key in args) {
            var functionName = `cmd_${ key }`;

            var commandMatched = 'function' === typeof Main.prototype[functionName];

            if (commandMatched) {
                commandToCall = Main.prototype[functionName];

                break;
            }
        }

        if (commandToCall) {
            commandToCall();
        } else {
            throw new Error("Command not implemented!");
        }
    }
}
