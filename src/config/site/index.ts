import yaml from "js-yaml";

import { Config } from "../entities";
import { SiteConfig as SiteCfg, SiteConfigSchema } from "./entities";

class SiteConfig extends Config<SiteCfg, typeof SiteConfigSchema> {
	constructor(config: SiteCfg) {
		super(config, SiteConfigSchema);
	}

	static load(file: string) {
		const cfg = yaml.load(file) as SiteCfg;

		return new SiteConfig(cfg);
	}
}

export default SiteConfig;
