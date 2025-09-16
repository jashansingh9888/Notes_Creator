document.addEventListener("DOMContentLoaded", () => {
  const materialsSelect = document.getElementById("materialsSelect");
  const generateBtn = document.getElementById("generateBtn");
  const outputArea = document.getElementById("outputArea");
  let templateText = '';

  fetch('materials.json').then(r => r.json()).then(materials => {
    materials.forEach(m => {const opt=document.createElement('option'); opt.value=m; opt.textContent=m; materialsSelect.appendChild(opt);});
  });
  fetch('template.txt').then(r=>r.text()).then(txt=>{templateText=txt;}).catch(()=>{templateText='Job: {{jobName}}\nDate: {{date}}\nMaterials: {{materials}}\nNotes: {{additionalNotes}}\nFiber Riser Calculated: {{riserResult}}';});

  document.getElementById('calculateRiser').addEventListener('click', ()=>{
    const riser = parseFloat(document.getElementById('riserValue').value)||0;
    const suite = parseFloat(document.getElementById('suiteValue').value)||0;
    const total = parseFloat(document.getElementById('totalValue').value)||0;
    const result = Math.abs(total - (riser + suite));
    document.getElementById('riserResult').value = result.toFixed(2);
  });

  generateBtn.addEventListener('click', ()=>{
    const fields = ['jobName','date','insideTech','outsideTech','testsCompleted','rubyRiser','exfo','lightMeter','wifi',
      'zhoneLocation','zhoneMAC','zhoneModel','airtiesLocation','airtiesMAC','airtiesModel','airtiesClosetAdvised',
      'linesTerminated','locations','returnVisitCharge','airtiesReason','floorPanelPort','riserValue','suiteValue','totalValue','riserResult',
      'hubStockLocation','additionalNotes'];
    let output=templateText;
    fields.forEach(f=>{
      const val = document.getElementById(f).value.trim() || '—';
      output = output.replace(new RegExp('{{'+f+'}}','g'), val);
    });
    const selectedMaterials = Array.from(materialsSelect.selectedOptions).map(o=>o.value);
    output = output.replace(/{{materials}}/g, selectedMaterials.length>0?selectedMaterials.join(', '):'None');
    outputArea.textContent = output;
  });
});
