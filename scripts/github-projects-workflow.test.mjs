import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const workflowPath = '.github/private-automation/project-readme-sync.yml'

test('private automation pins schedule, model, effort, and managed file boundary', async () => {
  const workflow = await readFile(workflowPath, 'utf8')

  assert.match(workflow, /cron: "43 2 \* \* \*"/)
  assert.match(workflow, /CODEX_VERSION: 0\.155\.1/)
  assert.match(workflow, /--model gpt-5\.6-sol/)
  assert.match(workflow, /model_reasoning_effort="medium"/)
  assert.match(workflow, /MANAGED_FILE: src\/data\/projects\.json/)
  assert.match(workflow, /gh pr checks "\$pr_url" --watch --fail-fast/)
  assert.match(workflow, /gh pr merge "\$pr_url" --squash/)
  assert.match(workflow, /actions\/create-github-app-token@v2/)
  assert.match(workflow, /environment: project-content/)
  assert.match(workflow, /permission-environments: write/)
  assert.match(workflow, /include-hidden-files: true/)
  assert.match(workflow, /Verify credential writeback before consuming the login/)
  assert.match(workflow, /if: always\(\) && steps\.auth\.outcome == 'success'/)
  assert.doesNotMatch(workflow, /permission-secrets: write/)
  assert.doesNotMatch(workflow, /AWS_|aws secretsmanager/)
})

test('private auth helper writes only the protected environment secret', async () => {
  const helper = await readFile('.github/private-automation/project-auth.mjs', 'utf8')
  assert.match(helper, /authEnvironment = "project-content"/)
  assert.match(helper, /"--env",\s*authEnvironment/)
  assert.match(helper, /current\.tokens\.account_id !== before\.tokens\.account_id/)
  assert.match(helper, /for \(let attempt = 0; attempt < 3/)
})

test('model output schema uses the supported structured-output subset', async () => {
  const schema = await readFile('.github/codex/project-introduction.schema.json', 'utf8')
  assert.doesNotMatch(schema, /uniqueItems/)
})

test('public verification rejects expanded automated PR scope', async () => {
  const workflow = await readFile('.github/workflows/verify.yml', 'utf8')

  assert.match(workflow, /automation\/github-project-introductions/)
  assert.match(workflow, /changed_files.*!= "src\/data\/projects\.json"/s)
})
