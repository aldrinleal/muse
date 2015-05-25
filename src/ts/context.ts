export interface ContextArgs {
    verbose?: boolean;
    directory: string;
}

export class Context {
    verbose: boolean = false;
    directory: string = ".";

    constructor(args: ContextArgs) {
        // keep doing
        if (args.verbose) {
            this.verbose = args.verbose;
        }

        if (args.directory) {
            this.directory = args.directory;
        }
    }
}