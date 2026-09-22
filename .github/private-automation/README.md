# Private project-introduction automation

`project-readme-sync.yml` is a workflow template for a dedicated **private** GitHub repository. It intentionally does not live directly under this public repository's `.github/workflows/` directory.

The workflow runs every day at `02:43 UTC` (`10:43 Asia/Shanghai`) and supports manual dispatch. It scans `agenticnoob` repositories, invokes Codex only for new or fingerprint-changed README-based content, validates the result, and reuses the fixed `automation/github-project-introductions` PR branch. The publisher accepts only `src/data/projects.json`, enables auto-merge after required checks, and uses a GitHub App token so the merge triggers ordinary push workflows and Vercel Git deployment.

## One-time private setup

1. Create a private repository dedicated to this automation. Copy `project-readme-sync.yml` to its `.github/workflows/` directory and copy this repository's `.github/codex/` directory to the same path in the private repository. The private copies are the trusted prompt and Schema used by the model job; the job does not load those controls from the public target checkout. Do not combine its Codex session with other automation.
2. Create and install a GitHub App only on `agenticnoob/xuli-resume`. Give it `Contents: Read and write`, `Pull requests: Read and write`, `Checks: Read`, and `Metadata: Read`. Add its ID and private key to the private automation repository as `RESUME_APP_ID` and `RESUME_APP_PRIVATE_KEY` secrets.
3. Create one AWS Secrets Manager secret for this workflow's `auth.json`. Configure an AWS IAM role trusted through GitHub OIDC only by the private automation repository, with `secretsmanager:GetSecretValue` and `secretsmanager:PutSecretValue` limited to that secret. Add `AWS_ROLE_ARN`, `AWS_REGION`, and `CODEX_AUTH_SECRET_ID` as repository variables.
4. In a new local directory used only for this project, set `CODEX_HOME` to that directory, set `cli_auth_credentials_store = "file"` in `config.toml`, and run `codex login`. Upload the resulting `auth.json` directly to the AWS secret. Never commit it, upload it as an Actions artifact, paste it into an issue, or send it through chat.
5. The workflow stops before push on local validation failure, then waits for every PR check, including `Verify build` and Vercel Preview, before merging. A failed check leaves the reusable content PR open and blocks production publication. Repository-level **Allow auto-merge** may remain enabled, but this workflow does not depend on branch protection that would block the existing direct Vibe-data sync.
6. Run the private workflow manually once. Confirm that its PR changes only `src/data/projects.json`, the required checks pass, the PR auto-merges, `verify.yml` receives the resulting `main` push, and Vercel creates the production deployment.

The session store must preserve the refreshed file written by Codex. One serialized workflow owns this `auth.json`; do not restore an older seed over it or use the same session from another runner.
