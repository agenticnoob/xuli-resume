import { spawn } from "node:child_process";
import { lstat, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout } from "node:timers/promises";
import { pathToFileURL } from "node:url";

export const authEnvironment = "project-content";
export const authSecret = "CODEX_AUTH_JSON";

export function validateManagedAuth(raw) {
  let auth;
  try {
    if (typeof raw !== "string" || Buffer.byteLength(raw) > 40_000) throw 0;
    auth = JSON.parse(raw);
  } catch {
    throw new Error("Invalid Codex authentication JSON; log in again.");
  }

  if (
    auth?.auth_mode !== "chatgpt" ||
    auth.OPENAI_API_KEY ||
    !["access_token", "refresh_token", "id_token", "account_id"].every(
      (key) =>
        typeof auth.tokens?.[key] === "string" &&
        auth.tokens[key].trim().length > 0,
    )
  ) {
    throw new Error("A dedicated ChatGPT-managed Codex login is required.");
  }

  return auth;
}

async function readAuth(filename) {
  const info = await lstat(filename);
  if (!info.isFile() || info.size > 40_000) {
    throw new Error("Invalid Codex authentication file.");
  }
  const raw = await readFile(filename, "utf8");
  validateManagedAuth(raw);
  return raw;
}

export async function restoreAuth(root, raw) {
  validateManagedAuth(raw);
  const codexHome = path.join(root, "codex-home");
  await mkdir(codexHome, { recursive: true, mode: 0o700 });
  await writeFile(path.join(root, "auth-before.json"), raw, {
    mode: 0o600,
    flag: "wx",
  });
  await writeFile(path.join(codexHome, "auth.json"), raw, {
    mode: 0o600,
    flag: "wx",
  });
}

async function runSecretWrite(args, raw, token) {
  await new Promise((resolve, reject) => {
    const child = spawn("gh", args, {
      env: { ...process.env, GH_TOKEN: token, GH_HOST: "github.com" },
      stdio: ["pipe", "ignore", "ignore"],
    });
    let inputFailed = false;
    child.stdin.on("error", () => {
      inputFailed = true;
    });
    child.once("error", () => reject(new Error("Secret write could not start.")));
    child.once("close", (code) => {
      if (inputFailed || code !== 0) reject(new Error("Secret write failed."));
      else resolve();
    });
    child.stdin.end(raw);
  });
}

export async function persistAuth(root, repository, token, run = runSecretWrite) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository ?? "") || !token) {
    throw new Error("Repository and session-store token are required.");
  }

  const raw = await readAuth(path.join(root, "codex-home/auth.json"));
  const current = validateManagedAuth(raw);
  const before = validateManagedAuth(
    await readAuth(path.join(root, "auth-before.json")),
  );
  if (current.tokens.account_id !== before.tokens.account_id) {
    throw new Error("Codex account changed; refusing to replace the saved login.");
  }

  const args = [
    "secret",
    "set",
    authSecret,
    "--repo",
    repository,
    "--env",
    authEnvironment,
  ];
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await run(args, raw, token);
      return;
    } catch {
      if (attempt === 2) {
        throw new Error(
          "Cannot save the Codex login; generation must not be published. Reseed the dedicated login before retrying.",
        );
      }
      await setTimeout(1000 * (attempt + 1));
    }
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const [command, directory] = process.argv.slice(2);
  try {
    if (!directory || !["restore", "persist"].includes(command)) {
      throw new Error(
        "Usage: project-auth.mjs restore|persist <temporary-directory>",
      );
    }
    const root = path.resolve(directory);
    if (command === "restore") {
      await restoreAuth(root, process.env.CODEX_AUTH_JSON);
    } else {
      await persistAuth(root, process.env.GITHUB_REPOSITORY, process.env.GH_TOKEN);
    }
  } catch {
    console.error(
      `Project authentication ${command ?? "command"} failed. Check the private environment, dedicated login, and session-store App permission. No sensitive output is logged.`,
    );
    process.exitCode = 1;
  }
}
