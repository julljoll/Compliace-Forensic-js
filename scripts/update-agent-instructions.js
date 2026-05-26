const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const INSTRUCTIONS_PATH = path.join(process.cwd(), 'agent_instructions.json');

try {
  if (!fs.existsSync(INSTRUCTIONS_PATH)) {
    console.error('No se encontró el archivo agent_instructions.json en la raíz del proyecto.');
    process.exit(0);
  }

  const fileContent = fs.readFileSync(INSTRUCTIONS_PATH, 'utf8');
  const instructions = JSON.parse(fileContent);

  // 1. Obtener fecha y hora actual local
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localTime = new Date(now.getTime() - (offset * 60 * 1000));
  const formattedDate = localTime.toISOString().replace('T', ' ').substring(0, 19);

  // 2. Obtener estado de Git (archivos modificados, agregados o eliminados)
  let gitStatus = '';
  try {
    gitStatus = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  } catch (err) {
    gitStatus = '';
  }

  // 3. Obtener último commit
  let lastCommit = '';
  try {
    lastCommit = execSync('git log -1 --pretty=format:"%h - %s (%ad)" --date=short', { encoding: 'utf8' }).trim();
  } catch (err) {
    lastCommit = 'Sin commits previos';
  }

  // 4. Actualizar metadatos del JSON
  if (!instructions.meta) {
    instructions.meta = { version: "2.0.0", updated: "", sources: [] };
  }
  instructions.meta.updated = formattedDate.substring(0, 10); // Mantener formato YYYY-MM-DD

  const filesList = gitStatus
    ? gitStatus.split('\n').map(line => line.trim())
    : [];

  instructions.meta.latest_project_changes = {
    timestamp: formattedDate,
    last_commit: lastCommit,
    modified_files: filesList
  };

  // Guardar archivo formateado con sangrado de 2 espacios
  fs.writeFileSync(INSTRUCTIONS_PATH, JSON.stringify(instructions, null, 2), 'utf8');
  console.log(`[SHA256.US] agent_instructions.json actualizado con éxito. Hora local: ${formattedDate}`);
} catch (error) {
  console.error('Error al actualizar agent_instructions.json:', error);
}
