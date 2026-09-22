#!/usr/bin/env node

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import {
  applyGeneratedProjects,
  buildModelPrompt,
  scanGitHubProjects,
  validateCatalog,
  validateScan,
} from './github-projects.mjs'

const defaultCatalog = 'src/data/projects.json'

function parseArguments(argv) {
  const [command, ...rest] = argv
  const options = {}
  for (let index = 0; index < rest.length; index += 2) {
    const flag = rest[index]
    if (!flag?.startsWith('--') || rest[index + 1] === undefined) {
      throw new Error(`Expected --name value, received ${flag ?? 'nothing'}`)
    }
    options[flag.slice(2)] = rest[index + 1]
  }
  return { command, options }
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'))
}

async function writeAtomic(file, value) {
  await mkdir(path.dirname(file), { recursive: true })
  const temporary = `${file}.tmp`
  await writeFile(temporary, value)
  await rename(temporary, file)
}

async function main() {
  const { command, options } = parseArguments(process.argv.slice(2))
  const catalogPath = options.catalog ?? defaultCatalog
  const catalog = validateCatalog(await readJson(catalogPath))

  if (command === 'validate') {
    console.log(`projects=${catalog.projects.length} pending=${catalog.pending.length}`)
    return
  }

  if (command === 'scan') {
    if (!options.output) throw new Error('scan requires --output')
    const scan = await scanGitHubProjects(catalog, { token: process.env.GITHUB_TOKEN ?? '' })
    await writeAtomic(options.output, `${JSON.stringify(scan, null, 2)}\n`)
    console.log(`candidates=${scan.candidates.length} pending=${scan.pending.length}`)
    return
  }

  if (command === 'prompt') {
    if (!options.scan || !options.prompt || !options.output) {
      throw new Error('prompt requires --scan, --prompt, and --output')
    }
    const scan = await readJson(options.scan)
    validateScan(scan, catalog)
    const basePrompt = await readFile(options.prompt, 'utf8')
    await writeAtomic(options.output, buildModelPrompt(basePrompt, scan))
    console.log(`candidates=${scan.candidates.length}`)
    return
  }

  if (command === 'apply') {
    if (!options.scan || !options.generated) throw new Error('apply requires --scan and --generated')
    const scan = await readJson(options.scan)
    const generated = await readJson(options.generated)
    const result = applyGeneratedProjects(catalog, scan, generated)
    const before = `${JSON.stringify(catalog, null, 2)}\n`
    const after = `${JSON.stringify(result, null, 2)}\n`
    if (before === after) {
      console.log('changed=0')
      return
    }
    await writeAtomic(catalogPath, after)
    console.log('changed=1')
    return
  }

  throw new Error('Usage: sync-github-projects.mjs <validate|scan|prompt|apply> [options]')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
