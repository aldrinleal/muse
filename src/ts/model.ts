/// <reference path="../../typings/tsd.d.ts" />

import Immutable = require("immutable");
import jsyaml = require("js-yaml");

export class Service {
	constructor(public prefix: string) { }
}

export class Configuration {
	//	services: Immutable.OrderedMap<String, Service>;
	//	
	//	constructor(servicesToAssign: Array<Service>) {
	//		var x = Immutable.List(servicesToAssign).map((x) => (x.prefix, x));
	//		
	//		//this.services = Immutable.OrderedMap();
	//		
	//	}
	constructor(public services: Immutable.Map<string, Service> = Immutable.Map<string, Service>([])) { }

	toJSON() {
		return JSON.stringify({ services: this.services }, null, 2);
	}

	toYAML() {
		return jsyaml.dump({ services: JSON.parse(JSON.stringify(this.services)) }, { indent: 2 })
	}

	static loadFromYaml(src: string) {
		var sourceYaml = jsyaml.safeLoad(src);

		console.log("sourceYaml", sourceYaml)

		var sourceAsObject = Immutable.fromJS(sourceYaml.services)

		return new Configuration(sourceAsObject)
	}

	static generateTemplate() {
		const HEADER = `# Template file for muse
# Please uncomment the sections below to enable modules
#
`;
		const PATHS = Immutable.fromJS(Immutable.List.of("whatever").map((x) => {
			var service = new Service(`/${x}`);

			return [x, service];
		}))

		const baseServices = Immutable.Map<string, Service>(PATHS)

		var templateYamlContent = new Configuration(baseServices).toYAML()
		
		var skeletonYamlContent = HEADER + templateYamlContent.replace(/(.+?)\r?\n/g, "# $1\n");

		return skeletonYamlContent
	}
}
