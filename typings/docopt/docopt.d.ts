declare module "docopt" {
    export interface StringToAnyMap {
        [index: string]: any;
    }

    export interface DocoptArgs {
        argv?: Array<string>;
        name?: string;
        help?: boolean;
        version?: string;
        options_first?: boolean;
        exit?: boolean;
    }

    export function docopt(doc: string, args?: DocoptArgs): StringToAnyMap;
}
