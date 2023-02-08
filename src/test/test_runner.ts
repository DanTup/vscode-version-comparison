console.log("Starting test runner...");

import * as glob from "glob";
import * as Mocha from "mocha";
import * as path from "path";

module.exports = {
	run(testsRoot: string, cb: (error: any, failures?: number) => void): void {
		const mocha = new Mocha({
			color: true,
			ui: "bdd",
		});

		const callCallback = (error: any, failures?: number) => {
			setTimeout(() => {
				console.error(`Test process did not quit within 10 seconds!`);
			}, 10000).unref();

			console.log(`Test run is complete! Calling VS Code callback with (${error}, ${failures})`);
			cb(error, failures);
		};

		glob("**/**.test.js", { cwd: testsRoot }, (err, files) => {
			if (err) {
				return callCallback(err);
			}

			// Add files to the test suite
			files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

			try {
				// Run the mocha test
				mocha.run((failures) => callCallback(null, failures));
			} catch (err) {
				callCallback(err);
			}
		});
	},
};
