import { Octokit } from '@octokit/rest';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export function getVPscore(content: Record<string, string>) {
  try {
    const depNum =
      'dependencies' in content ? Object.keys(content.dependencies).length : 0;
    const devDepNum =
      'devDependencies' in content
        ? Object.keys(content.devDependencies).length
        : 0;

    const totalDep = depNum + devDepNum;
    const VPscore = totalDep == 0 ? 1 : 1 / totalDep;
    console.log(VPscore);
    fs.appendFileSync('info.tmp', '\n');
    fs.appendFileSync('info.tmp', VPscore.toString());
    fs.appendFileSync('info.tmp', '\n');
  } catch (error) {
    if (error instanceof Error) return error.message;
  }
}

export async function getVP(owner: string, repo: string) {
  try {
    const { data } = await octokit.repos.getContent({
      owner: owner,
      repo: repo,
      path: 'package.json',
    });
    if ('content' in data) {
      const packagejson = JSON.parse(
        Buffer.from(data.content, 'base64').toString()
      );
      //console.log(typeof packagejson);
      getVPscore(packagejson);
    } else {
      const devDepNum = 0;
    }
  } catch (error) {
    if (error instanceof Error) return error.message;
  }
}

export async function getLicense(owner: string, repo: string) {
  const { data } = await octokit.repos.get({
    owner: owner,
    repo: repo,
  });
  //console.log(data.license);
}

export async function getRP(owner: string, repo: string) {}

getVP('vesln', 'package');
getLicense('danieldoh', 'firebase');
