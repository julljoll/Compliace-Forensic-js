const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const INSTRUCTIONS_PATH = path.join(ROOT, 'agent_instructions.json');
const AGENTS_MD_PATH = path.join(ROOT, 'AGENTS.md');

function getGitStatus() {
  try {
    return execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  } catch { return ''; }
}

function getLastCommit() {
  try {
    return execSync('git log -1 --pretty=format:"%h - %s (%ad)" --date=short', { encoding: 'utf8' }).trim();
  } catch { return 'Sin commits previos'; }
}

function getChangedFiles() {
  const status = getGitStatus();
  if (!status) return [];
  return status.split('\n').map(line => {
    const parts = line.trim().split(/\s+/);
    return { status: parts[0], file: parts.slice(1).join(' ') };
  });
}

function countSourceFiles() {
  const extensions = ['.tsx', '.ts', '.css', '.json'];
  let count = 0;
  const walk = (dir) => {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !['node_modules', '.next', 'dist', 'dev-dist', '.git'].includes(entry.name)) {
          walk(fullPath);
        } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
          count++;
        }
      }
    } catch {}
  };
  walk(path.join(ROOT, 'src'));
  return count;
}

function generateProjectSummary() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localTime = new Date(now.getTime() - (offset * 60 * 1000));
  const timestamp = localTime.toISOString().replace('T', ' ').substring(0, 19);
  const date = timestamp.substring(0, 10);
  
  const lastCommit = getLastCommit();
  const changedFiles = getChangedFiles();
  const sourceFileCount = countSourceFiles();
  
  // Count routes
  let routeCount = 0;
  const appDir = path.join(ROOT, 'src', 'app');
  const countRoutes = (dir) => {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('(') && !entry.name.startsWith('_')) {
          countRoutes(path.join(dir, entry.name));
        } else if (entry.isFile() && entry.name === 'page.tsx') {
          routeCount++;
        }
      }
    } catch {}
  };
  countRoutes(appDir);

  return {
    timestamp,
    date,
    lastCommit,
    changedFiles: changedFiles.length,
    changedFilesList: changedFiles.slice(0, 20),
    sourceFileCount,
    routeCount
  };
}

// Main execution
try {
  console.log('[SHA256.US] Actualizando agentes y metadatos del proyecto...\n');

  // 1. Update agent_instructions.json metadata
  if (fs.existsSync(INSTRUCTIONS_PATH)) {
    const content = fs.readFileSync(INSTRUCTIONS_PATH, 'utf8');
    const instructions = JSON.parse(content);
    const summary = generateProjectSummary();

    if (!instructions.meta) {
      instructions.meta = { version: '3.0.0', updated: '', sources: [] };
    }
    instructions.meta.updated = summary.date;
    instructions.meta.latest_project_changes = {
      timestamp: summary.timestamp,
      last_commit: summary.lastCommit,
      modified_files: summary.changedFilesList.map(f => `${f.status} ${f.file}`),
      source_files: summary.sourceFileCount,
      active_routes: summary.routeCount
    };

    fs.writeFileSync(INSTRUCTIONS_PATH, JSON.stringify(instructions, null, 2), 'utf8');
    console.log(`  ✓ agent_instructions.json actualizado (${summary.date})`);
    console.log(`    - Último commit: ${summary.lastCommit}`);
    console.log(`    - Archivos modificados: ${summary.changedFiles}`);
    console.log(`    - Archivos fuente en src/: ${summary.sourceFileCount}`);
    console.log(`    - Rutas activas: ${summary.routeCount}`);
  }

  // 2. Verify AGENTS.md exists and is current
  if (fs.existsSync(AGENTS_MD_PATH)) {
    const agentsContent = fs.readFileSync(AGENTS_MD_PATH, 'utf8');
    const hasVersion = agentsContent.includes('v3.0.0');
    const hasNextjs = agentsContent.includes('Next.js 16');
    const hasUbuntu = agentsContent.includes('Ubuntu');
    const hasNoVite = !agentsContent.includes('Vite');
    
    console.log(`\n  ✓ AGENTS.md verificado:`);
    console.log(`    - Versión 3.0.0: ${hasVersion ? '✓' : '✗ DESACTUALIZADO'}`);
    console.log(`    - Next.js 16: ${hasNextjs ? '✓' : '✗ FALTA'}`);
    console.log(`    - Tipografía Ubuntu: ${hasUbuntu ? '✓' : '✗ FALTA'}`);
    console.log(`    - Sin referencias Vite: ${hasNoVite ? '✓' : '✗ CONTIENE VITE'}`);
  }

  // 3. Check for any remaining Vite references in source
  const viteRefs = [];
  const checkVite = (dir) => {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !['node_modules', '.next', 'dist', 'normativas_rag', '.git'].includes(entry.name)) {
          checkVite(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.css'))) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('VITE_') || content.includes('vite build')) {
              viteRefs.push(fullPath.replace(ROOT, '.'));
            }
          } catch {}
        }
      }
    } catch {}
  };
  checkVite(path.join(ROOT, 'src'));
  
  if (viteRefs.length > 0) {
    console.log(`\n  ⚠ Referencias Vite encontradas en código fuente:`);
    viteRefs.forEach(f => console.log(`    - ${f}`));
  } else {
    console.log(`\n  ✓ Sin referencias Vite en código fuente`);
  }

  // 4. Check for Courier New references
  const courierRefs = [];
  const checkCourier = (dir) => {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !['node_modules', '.next', 'dist', 'normativas_rag', '.git'].includes(entry.name)) {
          checkCourier(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.css'))) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('Courier New')) {
              courierRefs.push(fullPath.replace(ROOT, '.'));
            }
          } catch {}
        }
      }
    } catch {}
  };
  checkCourier(path.join(ROOT, 'src'));
  
  if (courierRefs.length > 0) {
    console.log(`  ⚠ Referencias "Courier New" encontradas:`);
    courierRefs.forEach(f => console.log(`    - ${f}`));
  } else {
    console.log(`  ✓ Sin referencias "Courier New" en código fuente`);
  }

  console.log('\n[SHA256.US] Actualización de agentes completada.');

} catch (error) {
  console.error('Error al actualizar agentes:', error.message);
  process.exit(1);
}
