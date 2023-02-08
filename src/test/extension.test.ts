import { strict as assert } from "assert";
import { Uri } from "vscode";

describe("extension", () => {
	it("works", async () => {
		assert.equal(Uri.file("C:\\foo").toString(), "file:///C:/foo");
	});
});
