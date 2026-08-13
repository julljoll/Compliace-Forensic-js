#!/usr/bin/env node

/**
 * SHA256.US — Script de Sincronización Automática con GitHub
 *
 * Ejecuta verificación estática (tsc), prepara los cambios (git add .),
 * genera un commit descriptivo y realiza push automático a origin main.
 *
 * Uso:
 *   npm run sync
 *   npm run sync -- "feat: descripción de mi actualización"
 *   node scripts/sync-github.js "fix: actualización de plantilla"
 */

const { execSync } = require('child_process');
const path = require('path');

function runCmd(cmd, options = {}) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: options.silent ? 'pipe' : 'inherit', ...options });
  } catch (error) {
    if (!options.allowError) {
      console.error(`\n❌ Error ejecutando comando: ${cmd}`);
      if (error.stdout) console.error(error.stdout);
      if (error.stderr) console.error(error.stderr);
      process.exit(1);
    }
    return null;
  }
}

function getFormattedTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const min = pad(now.getMinutes());
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

async function main() {
  console.log('\n🚀 SHA256.US — INICIANDO SINCRONIZACIÓN AUTOMÁTICA CON GITHUB');
  console.log('─────────────────────────────────────────────────────────────────');

  // 1. Verificación TypeScript previa (opcional pero recomendada)
  console.log('🔍 Paso 1/4: Verificando compilación estática TypeScript (tsc)...');
  try {
    execSync('npx tsc --noEmit', { stdio: 'ignore' });
    console.log('✅ Compilación TypeScript sin errores.');
  } catch (e) {
    console.warn('⚠️ Se detectaron advertencias de tipos, procediendo con la sincronización...');
  }

  // 2. Comprobar estado de Git
  console.log('\n📦 Paso 2/4: Preparando y agregando archivos modificados (git add .)...');
  runCmd('git add .');

  const statusOutput = runCmd('git status --porcelain', { silent: true }) || '';
  const hasChanges = statusOutput.trim().length > 0;

  // 3. Generar Commit
  const customMsg = process.argv.slice(2).join(' ').trim();
  const defaultMsg = `feat(cms): actualización de planillas forenses y sincronización GitHub [${getFormattedTimestamp()}]`;
  const commitMsg = customMsg || defaultMsg;

  if (hasChanges) {
    console.log(`\n✏️ Paso 3/4: Creando commit Git...`);
    console.log(`   Mensaje: "${commitMsg}"`);
    runCmd(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
    console.log('✅ Commit realizado exitosamente.');
  } else {
    console.log('\nℹ️ Paso 3/4: No hay cambios nuevos en el directorio de trabajo.');
  }

  // 4. Push a GitHub
  console.log('\n🌐 Paso 4/4: Subiendo cambios a GitHub (git push origin main)...');
  runCmd('git push origin main');

  console.log('─────────────────────────────────────────────────────────────────');
  console.log('🎉 ¡SINCRONIZACIÓN CON GITHUB COMPLETADA EXITOSAMENTE!');
  console.log('   Repositorio: https://github.com/julljoll/SHA256.git');
  console.log('─────────────────────────────────────────────────────────────────\n');
}

main();
