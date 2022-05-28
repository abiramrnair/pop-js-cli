#!/usr/bin/env node
const path = require("path");
const fs = require("fs-extra");
const camelCase = (string) =>
	string
		.toLowerCase()
		.trim()
		.split(/[.\-_\s]/g)
		.reduce((string, word) => string + word[0].toUpperCase() + word.slice(1));

async function main(command) {
	try {
		const task = command[0].split("-")[0];
		const tag = command[0].split("-")[1];
		const folderArgs = command[1].split("/");
		const component = folderArgs[folderArgs.length - 1];
		const folder = folderArgs.slice(0, folderArgs.length - 1).join("/");
		const flag = command[2];
		if (task === "make") {
			if (folder) {
				await fs.ensureDir(folder);
			}
			if (component) {
				const filePath =
					flag === "-f"
						? "/templates/full-component.txt"
						: "/templates/standard-component.txt";
				fs.readFile(__dirname + filePath, "utf-8", (err, data) => {
					if (err) throw err;
					const componentRewrite = data.replace(
						/componentName/gim,
						camelCase(component)
					);
					let finalReplace;
					if (tag) {
						finalReplace = componentRewrite.replace(/div/gim, tag);
					}
					fs.writeFile(
						path.join(folder ? folder : "./", `${component}.js`),
						finalReplace ? finalReplace : componentRewrite,
						"utf-8",
						(err) => {
							if (err) throw err;
						}
					);
				});
			}
		}
	} catch (e) {
		console.log("Insufficient or incorrect arguments provided.");
	}
}

main(process.argv.slice(2, process.argv.length));
