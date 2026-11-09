import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

it("returns account information", async () => {
  const { stdout } = await execFileAsync("sam", [
    "local",
    "invoke",
    "MyFunction",
    "--event",
    "events/event.json",
  ]);

  const response = JSON.parse(stdout);

  expect(response.statusCode).toBe(200);

  const body = JSON.parse(response.body);

  expect(body.status).toBe("ok");
  expect(body.account).toBeDefined();
});
