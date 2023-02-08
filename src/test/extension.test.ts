import { strict as assert } from "assert";
import { Uri } from "vscode";

describe("extension", () => {
	const isWin = process.platform.startsWith("win");
	it("maps URIs without changing drive letters", async () => {
		if (isWin)
			assert.equal(Uri.file("C:\\FOO\\bar").toString(), "file:///C:/FOO/bar");
		else
			assert.equal(Uri.file("/FOO/bar").toString(), "file:///FOO/bar");
	});
});
