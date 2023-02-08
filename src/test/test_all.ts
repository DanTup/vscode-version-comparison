import * as vstest from "@vscode/test-electron";
import * as path from "path";

let exitCode = 0;
const cwd = process.cwd();
const testEnv = Object.create(process.env);

async function runTests(): Promise<void> {
	const codeVersion = process.env.BUILD_VERSION;

	// The VS Code download is often flaky on GH Actions, so we want to retry
	// if required - however we don't want to re-run tests if they fail, so do
	// the download step separately.
	let currentAttempt = 1;
	const maxAttempts = 5;
	while (currentAttempt <= maxAttempts) {
		try {
			console.log(`Attempting to download VS Code attempt #${currentAttempt}`);
			await vstest.downloadAndUnzipVSCode(codeVersion);
			break;
		} catch (e) {
			if (currentAttempt >= maxAttempts)
				throw e;

			console.warn(`Failed to download VS Code, will retry: ${e}`);
			currentAttempt++;
		}
	}

	console.log("Running tests with pre-downloaded VS Code");
	try {
		const res = await vstest.runTests({
			extensionDevelopmentPath: cwd,
			extensionTestsEnv: { ...testEnv },
			extensionTestsPath: path.join(cwd, "out", "src", "test"),
			launchArgs: [
				path.join(cwd, "src", "test", "test_project"),
				"--profile-temp",
				"--disable-extension",
				"vscode.git",
				"--disable-extension",
				"vscode.git-ui",
				"--disable-extension",
				"vscode.github",
				"--disable-extension",
				"vscode.github-authentication",
				"--disable-workspace-trust",
			],
			version: codeVersion,
		});
		exitCode = exitCode || res;
	} catch (e) {
		console.error(e);
		exitCode = exitCode || 999;
	}

	console.log("############################################################");
	console.log("\n\n");
}

async function runAllTests(): Promise<void> {
	try {
		await runTests();
	} catch (e) {
		exitCode = 1;
		console.error(e);
	}
}


runAllTests().then(() => process.exit(exitCode));
