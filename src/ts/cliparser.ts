/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/docopt/docopt.d.ts" />

import docopt = require("docopt");

export class CLIParser {
    public static USAGE: string = `muse.

Usage:
  muse [options] init
  muse [options] run
  muse [options] start
  muse [options] stop
  muse [options] status
  muse help <COMMAND>

Options:
  -v,--verbose            Turn on verbose [default: false]
  -d DIR --directory=DIR  Directory [default: .]
`;

    parse(args?:Array<string>) {
        var parsed_args = docopt.docopt(CLIParser.USAGE, {options_first: true});

        console.log("parsed_args", parsed_args);

        return parsed_args;
    }
}

