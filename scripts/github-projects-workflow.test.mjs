import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const workflowPath = '.github/private-automation/project-readme-sync.yml'

test('private automation pins schedule, model, effort, and managed file boundary', async () => {
  const workflow = await readFile(workflowPath, 'utf8')

  assert.match(workflow, /cron: "43 2 \* \* \*"/)
  assert.match(workflow, /CODEX_VERSION: 0\.139\.0/)
  assert.match(workflow, /--model gpt-5\.6-sol/)
  assert.match(workflow, /model_reasoning_effort="medium"/)
  assert.match(workflow, /MANAGED_FILE: src\/data\/projects\.json/)
  assert.match(workflow, /gh pr checks "\$pr_url" --watch --fail-fast/)
  assert.match(workflow, /gh pr merge "\$pr_url" --squash/)
  assert.match(workflow, /actions\/create-github-app-token@v2/)
  assert.match(workflow, /permission-secrets: write/)
  assert.match(workflow, /gh secret set CODEX_AUTH_JSON/)
  assert.doesNotMatch(workflow, /AWS_|aws secretsmanager/)
})

test('public verification rejects expanded automated PR scope', async () => {
  const workflow = await readFile('.github/workflows/verify.yml', 'utf8')

  assert.match(workflow, /automation\/github-project-introductions/)
  assert.match(workflow, /changed_files.*!= "src\/data\/projects\.json"/s)
})
