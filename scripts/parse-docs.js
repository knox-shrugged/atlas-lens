import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.resolve(__dirname, '../../atlas-docs');
const TARGET_DIRS = ['Goals', 'Initiatives', 'Projects', 'Learnings'];

const nodes = [];
const edges = [];
let xOffset = 0;
let yOffset = 0;

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processDocs() {
  const allFiles = [];

  TARGET_DIRS.forEach((dirName) => {
    const dirPath = path.join(DOCS_DIR, dirName);
    walkDir(dirPath, (filepath) => {
      if (filepath.endsWith('.md')) {
        allFiles.push({ filepath, category: dirName });
      }
    });
  });

  allFiles.forEach(({ filepath, category }) => {
    const fileContent = fs.readFileSync(filepath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    const relativePath = path.relative(DOCS_DIR, filepath);
    const nodeId = relativePath.replace(/\\/g, '/'); // Normalize paths for IDs

    let title = frontmatter.title || path.basename(filepath, '.md');
    let type = frontmatter.type || category;

    // Arrange nodes in a simple grid for now
    nodes.push({
      id: nodeId,
      type: 'default',
      position: { x: (xOffset % 5) * 250, y: Math.floor(xOffset / 5) * 150 },
      data: { label: title, type, category },
    });
    xOffset++;

    // Parse markdown links
    const tokens = marked.lexer(content);

    // Extract links
    marked.walkTokens(tokens, (token) => {
      if (token.type === 'link') {
        const href = token.href;

        // Resolve relative link to the node ID
        // Assuming link is relative to the current file, e.g., `../Goals/some-goal.md`
        if (!href.startsWith('http') && href.endsWith('.md')) {
            const targetPath = path.resolve(path.dirname(filepath), href);
            const relativeTarget = path.relative(DOCS_DIR, targetPath).replace(/\\/g, '/');

            edges.push({
                id: `e-${nodeId}-${relativeTarget}`,
                source: nodeId,
                target: relativeTarget
            });
        }
      }
    });
  });

  const output = { nodes, edges };
  const outputPath = path.resolve(__dirname, '../public/graph_data.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`Ingested ${nodes.length} nodes and ${edges.length} edges.`);
}

processDocs();