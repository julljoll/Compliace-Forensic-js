const fs = require('fs');

function convertToJSX(html) {
  let jsx = html;
  
  // Replace class= with className=
  jsx = jsx.replace(/class="/g, 'className="');
  
  // HTML comments to JSX comments
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

  // Replace style="..." with style={{...}}
  jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
    let styles = p1.split(';').filter(s => s.trim() !== '').map(s => {
      let parts = s.split(':');
      if (parts.length < 2) return '';
      let key = parts[0].trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      let val = parts.slice(1).join(':').trim();
      return `'${key}': '${val}'`;
    }).join(', ');
    return `style={{ ${styles} }}`;
  });

  // Self closing tags
  jsx = jsx.replace(/<br>/g, '<br />');
  jsx = jsx.replace(/<input([^>]*?)>/g, (m, p1) => {
    if(p1.endsWith('/')) return m;
    return `<input${p1} />`;
  });
  
  // attributes
  jsx = jsx.replace(/colspan="/g, 'colSpan="');
  jsx = jsx.replace(/onclick="([^"]*)"/g, 'onClick={() => { window.print() }}');
  jsx = jsx.replace(/onchange="([^"]*)"/g, 'onChange={() => { }}');
  jsx = jsx.replace(/for="/g, 'htmlFor="');

  return jsx;
}

const files = [
  { name: 'acta_obtencion_consignacion.html', comp: 'ActaObtencionPage' },
  { name: 'planilla_prcc_derivacion.html', comp: 'PlanillaPRCCPage' },
  { name: 'seguimiento.html', comp: 'SeguimientoPage' }
];

files.forEach(f => {
  const content = fs.readFileSync(f.name, 'utf8');
  
  const bodyMatch = content.match(/<body>([\s\S]*?)<\/body>/);
  let bodyContent = bodyMatch ? bodyMatch[1] : '';
  bodyContent = bodyContent.replace(/<script>[\s\S]*?<\/script>/, '');

  let jsx = convertToJSX(bodyContent);

  const tsxTemplate = `import React, { useEffect } from 'react';
import './Planillas.css';

const ${f.comp} = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="planilla-container">
${jsx}
    </div>
  );
};

export default ${f.comp};
`;

  fs.writeFileSync(`src/pages/Planillas/${f.comp}.tsx`, tsxTemplate);
  console.log(`Created ${f.comp}.tsx`);
});
