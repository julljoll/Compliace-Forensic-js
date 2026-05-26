const fs = require('fs');

const fixes = [
  { 
    file: 'src/components/organisms/Casos/CasoCard.tsx',
    regex: /\.\.\/\.\.\/store/g,
    replace: '../../../store'
  },
  { 
    file: 'src/components/organisms/Casos/CasosFilters.tsx',
    regex: /\.\.\/\.\.\/store/g,
    replace: '../../../store'
  },
  { 
    file: 'src/components/organisms/Casos/NuevoCasoModal.tsx',
    regex: /\.\.\/\.\.\/store/g,
    replace: '../../../store'
  },
  { 
    file: 'src/components/organisms/Casos/NuevoCasoModal.tsx',
    regex: /\.\.\/\.\.\/data/g,
    replace: '../../../data'
  },
  { 
    file: 'src/components/organisms/DisposicionFinal/ActaDisposicionFinal.tsx',
    regex: /\.\.\/\.\.\/store/g,
    replace: '../../../store'
  },
  { 
    file: 'src/components/organisms/DisposicionJudicial/ResguardoJudicial.tsx',
    regex: /\.\.\/\.\.\/store/g,
    replace: '../../../store'
  },
  { 
    file: 'src/components/organisms/Laboratorio/AnalisisForense.tsx',
    regex: /\.\.\/\.\.\/store/g,
    replace: '../../../store'
  },
  { 
    file: 'src/components/organisms/Laboratorio/InformeTecnico.tsx',
    regex: /\.\.\/\.\.\/store/g,
    replace: '../../../store'
  },
  { 
    file: 'src/components/organisms/Obtencion/AdquisicionTecnica.tsx',
    regex: /\.\.\/\.\.\/store/g,
    replace: '../../../store'
  },
  { 
    file: 'src/components/organisms/Obtencion/ConsignacionForm.tsx',
    regex: /\.\.\/\.\.\/store/g,
    replace: '../../../store'
  },
  { 
    file: 'src/components/organisms/Prcc/FormularioPrcc.tsx',
    regex: /\.\.\/\.\.\/store/g,
    replace: '../../../store'
  },
  { 
    file: 'src/components/templates/CMSLayout.tsx',
    regex: /\.\.\/store/g,
    replace: '../../store'
  },
  { 
    file: 'src/components/templates/Layout.tsx',
    regex: /\.\.\/store/g,
    replace: '../../store'
  }
];

fixes.forEach(fix => {
  if (fs.existsSync(fix.file)) {
    let content = fs.readFileSync(fix.file, 'utf8');
    content = content.replace(fix.regex, fix.replace);
    fs.writeFileSync(fix.file, content, 'utf8');
    console.log('Fixed', fix.file);
  } else {
    console.log('File not found', fix.file);
  }
});
