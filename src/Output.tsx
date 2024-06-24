import { useState } from "react";
import { Replacement } from "./types";
import classes from "./Output.module.css";

const languages = {
	nginx: (replacements: Replacement[]) => {
		return replacements.map(replacement => replacement.to !== null ? `rewrite ^${replacement.from}$ ${replacement.to} permanent;` : `# 410: ${replacement.from}`).join("\n");
	},
	caddy: (replacements: Replacement[]) => {
		return replacements.map(replacement => replacement.to !== null ? `rewrite ${replacement.from} ${replacement.to}` : `# 410: ${replacement.from}`).join("\n");
	},
	apache: (replacements: Replacement[]) => {
		return replacements.map(replacement => replacement.to !== null ? `Redirect 301 ${replacement.from} ${replacement.to}` : `# 410: ${replacement.from}`).join("\n");
	},
	json: (replacements: Replacement[]) => {
		return JSON.stringify(Object.fromEntries(replacements.map(e => [e.from, e.to])), null, 2);
	}
} satisfies Record<string, (replacements: Replacement[]) => string>;

interface Output {
	replacements: Replacement[];
}

function Output({
	replacements,
}: Output) {
	const [language, setLanguage] = useState<keyof typeof languages>("nginx");
	return <div className={classes.root}>
		<select value={language} onChange={e => setLanguage(e.currentTarget.value as keyof typeof languages)}>
			{Object.keys(languages).map(lang => <option key={lang} value={lang}>{lang}</option>)}
		</select>
		<textarea value={languages[language](replacements)} readOnly/>
	</div>;
}
export default Output;