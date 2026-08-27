import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const versionPath = path.join(root, 'VERSION');
const skillsRoot = path.join(root, 'skills');
const evalRoot = path.join(root, 'evals');

const fail = (message) => {
  console.error(`Validation error: ${message}`);
  process.exitCode = 1;
};

if (!fs.existsSync(versionPath)) {
  fail('VERSION is missing');
}

const releaseVersion = fs.readFileSync(versionPath, 'utf8').trim();
if (!/^\d+\.\d+\.\d+$/.test(releaseVersion)) {
  fail(`VERSION must be semver-like, received ${JSON.stringify(releaseVersion)}`);
}

const skillDirs = fs.readdirSync(skillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (skillDirs.length === 0) {
  fail('no skills found');
}

for (const skillName of skillDirs) {
  const skillDir = path.join(skillsRoot, skillName);
  const skillPath = path.join(skillDir, 'SKILL.md');

  if (!fs.existsSync(skillPath)) {
    fail(`${skillName} is missing SKILL.md`);
    continue;
  }

  const content = fs.readFileSync(skillPath, 'utf8');
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) {
    fail(`${skillName}/SKILL.md has no YAML frontmatter`);
    continue;
  }

  const name = frontmatter[1].match(/^name:\s*([^\s#]+)\s*$/m)?.[1];
  const version = frontmatter[1].match(/^version:\s*([^\s#]+)\s*$/m)?.[1];
  const hasDescription = /^description:\s*[>|"']?/m.test(frontmatter[1]);

  if (name !== skillName) fail(`${skillName}/SKILL.md name must match its folder`);
  if (!hasDescription) fail(`${skillName}/SKILL.md is missing description`);
  if (version !== releaseVersion) {
    fail(`${skillName}/SKILL.md version ${JSON.stringify(version)} does not match VERSION ${releaseVersion}`);
  }

  const referenceLinks = [...content.matchAll(/\]\((references\/[^)#]+\.md)(?:#[^)]+)?\)/g)];
  for (const match of referenceLinks) {
    const referencePath = path.join(skillDir, match[1]);
    if (!fs.existsSync(referencePath)) {
      fail(`${skillName}/SKILL.md links to missing ${match[1]}`);
    }
  }

  const evalPath = path.join(evalRoot, `${skillName}.json`);
  if (!fs.existsSync(evalPath)) {
    fail(`${skillName} is missing ${path.relative(root, evalPath)}`);
    continue;
  }

  try {
    const evaluation = JSON.parse(fs.readFileSync(evalPath, 'utf8'));
    if (evaluation.skill_name !== skillName) {
      fail(`${path.relative(root, evalPath)} skill_name must equal ${skillName}`);
    }
    if (!Array.isArray(evaluation.evals) || evaluation.evals.length < 2) {
      fail(`${path.relative(root, evalPath)} must contain at least two eval prompts`);
    }
  } catch (error) {
    fail(`${path.relative(root, evalPath)} is invalid JSON: ${error.message}`);
  }
}

if (process.exitCode) process.exit(process.exitCode);
console.log(`Validated ${skillDirs.length} skills at release v${releaseVersion}.`);
