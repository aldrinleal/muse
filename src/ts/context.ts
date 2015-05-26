/// <reference path="../../typings/tsd.d.ts" />

import Immutable = require("immutable")
import model = require("./model")
import fs = require("fs")
import tspromise = require('tspromise');
import path = require("path")
import docopt = require("docopt")

export interface ContextArgs {
    verbose?: boolean
    directory: string
    args: docopt.StringToAnyMap
}

export class Context {
    verbose: boolean = false
    directory: string = "."
    configFilePath: string
    config: model.Configuration = new model.Configuration()
    args: docopt.StringToAnyMap
    ready: tspromise<string>

    constructor(contextArgs: ContextArgs) {
        this.args = contextArgs.args
        
        // keep doing
        this.verbose = contextArgs.verbose || false

        this.directory = contextArgs.directory || process.cwd()

        var realpath = (path: string) => {
            return new tspromise<string>((resolve, reject) => {
                fs.realpath(path, function(err, data) { 
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            })
        }
        
        var exists = (path: string) => {
            return new tspromise<boolean>((resolve, reject) => {
                fs.exists(path, function(data) {
                    resolve(data);
                })
            })
        }

        this.ready = realpath(this.directory).then((resolvedPath) => {
            this.directory = resolvedPath

            console.log("Using directory:", this.directory)

            this.configFilePath = path.join(this.directory, ".muserc.yaml")

            console.log("Configuration file:", this.configFilePath)

            return this.configFilePath
        }).then(exists).then((existsP) => {
            if (existsP) {
                var yamlContent = fs.readFileSync(this.configFilePath)

                this.config = model.Configuration.loadFromYaml(yamlContent.toString())
            }

            return this.configFilePath
        })

        console.log("this.ready", this.ready)
    }
}