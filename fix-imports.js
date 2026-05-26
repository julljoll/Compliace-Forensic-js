const fs = require('fs');
const path = require('path');

const directory = './src';

// Necesitamos ser cuidadosos con las importaciones relativas
// Ej: import { KpiCard } from '../../components/Shared/KpiCard'
// Se convierte en '../../components/molecules/KpiCard'

const replacements = [
  { regex: /components\/Shared\/Toast/g, replace: 'components/atoms/Toast' },
  { regex: /components\/Shared\/ErrorBoundary/g, replace: 'components/atoms/ErrorBoundary' },
  { regex: /components\/Shared\/KpiCard/g, replace: 'components/molecules/KpiCard' },
  { regex: /components\/Compliance\/NormativaAccordion/g, replace: 'components/molecules/NormativaAccordion' },
  { regex: /components\/CMSLayout/g, replace: 'components/templates/CMSLayout' },
  { regex: /components\/Layout/g, replace: 'components/templates/Layout' },
  { regex: /components\/(Casos|Compliance|DisposicionFinal|DisposicionJudicial|Laboratorio|MarcoLegal|Obtencion|Prcc)/g, replace: 'components/organisms/$1' }
];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Como movimos componentes a un nivel adicional de profundidad (ej. components/Casos -> components/organisms/Casos)
  // Las importaciones DENTRO de esos componentes necesitan actualizar sus importaciones relativas hacia atrás
  // Ej. en components/organisms/Casos/CasoCard.tsx:
  // import { useCMSStore } from '../../store/cmsStore' 
  // debería ser 
  // import { useCMSStore } from '../../../store/cmsStore'
  // Esto es complejo de hacer solo con regex simple global.
  
  replacements.forEach(({ regex, replace }) => {
    if (regex.test(content)) {
      content = content.replace(regex, replace);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

traverse(directory);
console.log('Done!');
