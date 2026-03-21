import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.resolve(__dirname, '../../atlas-docs');
const TARGET_DIRS = ['Goals', 'Initiatives', 'Projects', 'Agents', 'Learnings', 'Activities'];

const nodes = [];
const edges = [];
const categoryYOffsets = {};

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

function processDocs() {
  const allFiles = [];

  TARGET_DIRS.forEach((dirName) => {
    const dirPath = path.join(DOCS_DIR, dirName);
    walkDir(dirPath, (filepath) => {
      if (filepath.endsWith('.md')) {
        // Category is the top-level folder name within DOCS_DIR
        const relativeToDocs = path.relative(DOCS_DIR, filepath);
        const category = relativeToDocs.split(path.sep)[0];
        allFiles.push({ filepath, category });
      }
    });
  });


  allFiles.forEach(({ filepath, category }) => {
    const fileContent = fs.readFileSync(filepath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    const relativePath = path.relative(DOCS_DIR, filepath);
    const nodeId = relativePath.replace(/\\/g, '/'); // Normalize paths for IDs

    let title = frontmatter.title || path.basename(filepath, '.md');
    let description = '';

    let type = frontmatter.type || category;
    let status = frontmatter.status || 'Active';
    let schedule = frontmatter.schedule || '';
    let project = frontmatter.project || '';

    let role = frontmatter.role || '';

    // Advanced Extraction: Look for Friendly Name, Description, Status, Schedule, Project, and Role in content
    const lines = content.split('\n');
    for (const line of lines) {
        if (line.startsWith('**Friendly Name:**')) {
            title = line.replace('**Friendly Name:**', '').trim();
        }
        if (line.startsWith('**Description:**')) {
            description = line.replace('**Description:**', '').trim();
        }
        if (line.startsWith('**Status:**')) {
            status = line.replace('**Status:**', '').trim();
        }
        if (line.startsWith('**Schedule:**')) {
            schedule = line.replace('**Schedule:**', '').trim();
        }
        if (line.startsWith('**Project:**')) {
            project = line.replace('**Project:**', '').trim();
        }
        if (line.startsWith('**Role:**')) {
            role = line.replace('**Role:**', '').trim();
        }
    }

    // Determine if it's a Ledger (index) or a Detail node
    const isLedger = title.toLowerCase().includes('ledger') || title.toLowerCase() === 'readme';
    
    // Vertical hierarchy based on category
    const categoryYMap = {
      'Goals': 0,
      'Initiatives': 400,
      'Projects': 800,
      'Agents': 1200,
      'Activities': 1600,
      'Learnings': 2000,
      'default': 2400
    };


    const baseY = categoryYMap[category] !== undefined ? categoryYMap[category] : categoryYMap.default;
    
    // Distribute nodes horizontally within each category to avoid overlap
    if (categoryYOffsets[category] === undefined) categoryYOffsets[category] = 0;
    
    const xPos = isLedger ? -400 : (categoryYOffsets[category] * 350);
    const finalY = baseY;

    categoryYOffsets[category] += 1;

    nodes.push({
      id: nodeId,
      type: 'default',
      position: { x: xPos, y: finalY },
      data: { label: title, description, type, category, isLedger, status, schedule, project, role },
    });

    // Hierarchy map for directional edges
    const layerMap = { 'Goals': 0, 'Initiatives': 1, 'Projects': 2, 'Agents': 3, 'Activities': 4, 'Learnings': 5, 'default': 6 };
    const currentLayer = layerMap[category] !== undefined ? layerMap[category] : layerMap.default;

    // Resolve markdown links into edges with correct tactical direction
    const tokens = marked.lexer(content);
    marked.walkTokens(tokens, (token) => {
      if (token.type === 'link') {
        const href = token.href;
        if (!href.startsWith('http') && href.endsWith('.md')) {
            const absolutePath = path.resolve(path.dirname(filepath), href);
            const targetId = path.relative(DOCS_DIR, absolutePath).replace(/\\/g, '/');
            
            // Extract target category from its ID (top-level directory)
            const targetCategory = targetId.split('/')[0];
            const targetLayerLayer = layerMap[targetCategory] !== undefined ? layerMap[targetCategory] : layerMap.default;

            let source = nodeId;
            let target = targetId;

            // If the linked entity is 'higher' in the strategic hierarchy, orient edges downward
            if (targetLayerLayer < currentLayer) {
                source = targetId;
                target = nodeId;
            }

            edges.push({
                id: `e-${source}-${target}`, // source is parent, target is child
                source: source,
                target: target
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