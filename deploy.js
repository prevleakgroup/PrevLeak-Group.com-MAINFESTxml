const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const axios = require('axios');

const API_BASE = 'https://firebasehosting.googleapis.com/v1beta1';

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function toBase64Url(buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

async function listFiles(rootDir, relativeDir = '') {
  const absoluteDir = path.join(rootDir, relativeDir);
  const entries = await fs.readdir(absoluteDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules') {
      continue;
    }

    const relativePath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(rootDir, relativePath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(relativePath);
    }
  }

  return files;
}

async function main() {
  const accessToken = getEnv('FIREBASE_OAUTH_ACCESS_TOKEN');
  const projectId = getEnv('FIREBASE_PROJECT_ID');
  const siteId = getEnv('FIREBASE_SITE_ID');
  const deployDir = path.resolve(process.env.FIREBASE_DEPLOY_DIR || '.');
  console.log(`Deploying Firebase Hosting content from: ${deployDir}`);

  const fileList = await listFiles(deployDir);
  if (fileList.length === 0) {
    throw new Error(`No files found in deploy directory: ${deployDir}`);
  }

  const filesByPath = {};
  const pathsByHash = {};

  for (const relativePath of fileList) {
    const absolutePath = path.join(deployDir, relativePath);
    const contents = await fs.readFile(absolutePath);
    const hash = toBase64Url(crypto.createHash('sha256').update(contents).digest());
    const normalizedPath = `/${relativePath.split(path.sep).join('/')}`;

    filesByPath[normalizedPath] = hash;
    if (!pathsByHash[hash]) {
      pathsByHash[hash] = absolutePath;
    }
  }

  const client = axios.create({
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  });

  const versionResponse = await client.post(
    `${API_BASE}/projects/${projectId}/sites/${siteId}/versions`,
    {}
  );

  const versionName = versionResponse.data?.name;
  if (!versionName) {
    throw new Error('Firebase API did not return a version name');
  }

  const populateResponse = await client.post(`${API_BASE}/${versionName}:populateFiles`, {
    files: filesByPath
  });

  const uploadUrl = populateResponse.data?.uploadUrl;
  const requiredHashes = populateResponse.data?.uploadRequiredHashes || [];

  if (requiredHashes.length > 0 && !uploadUrl) {
    throw new Error('Firebase API did not return uploadUrl for required file uploads');
  }

  for (const hash of requiredHashes) {
    const sourceFilePath = pathsByHash[hash];
    if (!sourceFilePath) {
      throw new Error(`No source file found for hash ${hash}`);
    }

    const data = await fs.readFile(sourceFilePath);
    await client.post(`${uploadUrl}/${hash}`, data, {
      headers: {
        ...client.defaults.headers.common,
        'Content-Type': 'application/octet-stream'
      }
    });
  }

  await client.patch(
    `${API_BASE}/${versionName}`,
    { status: 'FINALIZED' },
    { params: { updateMask: 'status' } }
  );

  await client.post(`${API_BASE}/sites/${siteId}/releases`, {
    versionName
  });

  console.log(
    `Firebase Hosting deployment completed for ${siteId} (version: ${versionName})`
  );
}

main().catch((error) => {
  const responseData = error.response?.data;
  let message = error.message || 'Unknown deployment error';
  if (responseData) {
    message =
      typeof responseData === 'string'
        ? responseData
        : JSON.stringify(responseData);
  }
  console.error('Firebase Hosting deployment failed:', message);
  process.exit(1);
});
