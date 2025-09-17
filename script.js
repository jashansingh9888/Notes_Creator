
document.addEventListener('DOMContentLoaded', ()=>{
  // helpers
  const fmtMAC = (s)=>{
    if(!s) return '';
    const clean = s.replace(/[^a-fA-F0-9]/g,'').toUpperCase();
    return clean.match(/.{1,2}/g)?.join(':')||s;
  };
  const validateMAC = (s)=>/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/.test(s);

  // elements
  const zhoneMAC = document.getElementById('zhoneMAC');
  const airtiesMAC = document.getElementById('airtiesMAC');
  const calculateRiserBtn = document.getElementById('calculateRiser');
  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyBtn');
  const outputArea = document.getElementById('outputArea');
  const roomList = document.getElementById('roomList');
  const addRoomBtn = document.getElementById('addRoom');
  const terminatedQty = document.getElementById('terminatedQty');
  const rj45Terminated = document.getElementById('rj45Terminated');
  const totalCat5 = document.getElementById('totalCat5');
  const roomSelect = document.getElementById('terminatedRoomSelect');
  const materialSelect = document.getElementById('materialSelect');
  const materialList = document.getElementById('materialList');
  const addMaterialBtn = document.getElementById('addMaterial');
  const materialQty = document.getElementById('materialQty');

  let rooms = [];
  let materials = [];

  // auto-format MAC on blur
  zhoneMAC.addEventListener('blur', ()=>{ zhoneMAC.value = fmtMAC(zhoneMAC.value); if(zhoneMAC.value && !validateMAC(zhoneMAC.value)) alert('Zhone MAC format looks incorrect'); });
  airtiesMAC.addEventListener('blur', ()=>{ airtiesMAC.value = fmtMAC(airtiesMAC.value); if(airtiesMAC.value && !validateMAC(airtiesMAC.value)) alert('Airties MAC format looks incorrect'); });

  // add room button
  addRoomBtn.addEventListener('click', ()=>{
    let room = roomSelect.value;
    if(room === 'Other') room = document.getElementById('terminatedRoomOther').value || 'Other';
    const qty = parseInt(terminatedQty.value)||0;
    if(!room || qty<=0){ alert('Enter room and qty'); return; }
    for(let i=0;i<qty;i++){ rooms.push({room}); }
    renderRooms();
  });

  function renderRooms(){
    roomList.innerHTML = '';
    rooms.forEach((r,idx)=>{
      const li = document.createElement('li');
      li.textContent = r.room + ' (1)';
      const btn = document.createElement('button');
      btn.textContent = 'Remove'; btn.type='button';
      btn.style.marginLeft='8px';
      btn.addEventListener('click', ()=>{ rooms.splice(idx,1); renderRooms(); });
      li.appendChild(btn);
      roomList.appendChild(li);
    });
  }

  // handle RJ45 terminated auto-rooms
  rj45Terminated.addEventListener('change', ()=>{
    const n = parseInt(rj45Terminated.value)||0;
    rooms = [];
    for(let i=0;i<n;i++) rooms.push({room:'Unit-Terminated'});
    renderRooms();
  });

  // add material
  addMaterialBtn.addEventListener('click', ()=>{
    const code = materialSelect.value;
    const qty = parseInt(materialQty.value)||0;
    if(!code || qty<=0){ alert('Select material and qty'); return; }
    materials.push({code,qty});
    renderMaterials();
  });

  function renderMaterials(){
    materialList.innerHTML='';
    materials.forEach((m,idx)=>{
      const li=document.createElement('li');
      li.textContent = m.code + ' - ' + m.qty;
      const btn=document.createElement('button'); btn.type='button'; btn.textContent='Remove';
      btn.style.marginLeft='8px';
      btn.addEventListener('click', ()=>{ materials.splice(idx,1); renderMaterials(); });
      li.appendChild(btn);
      materialList.appendChild(li);
    });
  }

  // calculate riser total
  calculateRiserBtn.addEventListener('click', ()=>{
    const suite = Math.abs(parseFloat(document.getElementById('suiteValue').value)||0);
    const riser = Math.abs(parseFloat(document.getElementById('riserValue').value)||0);
    const total = Math.abs(suite - riser);
    document.getElementById('totalValue').value = Math.round(total);
  });

  // generate note
  generateBtn.addEventListener('click', ()=>{
    const inside = document.getElementById('insideTech').value.trim();
    const outside = document.getElementById('outsideTech').value.trim();
    const tests = Array.from(document.querySelectorAll('input[name="tests"]:checked')).map(i=>i.value).join(', ') || 'None';
    let zLoc = document.getElementById('zhoneLocation').value;
    if(zLoc==='Other') zLoc = document.getElementById('zhoneLocationOther').value || 'Other';
    const zMAC = document.getElementById('zhoneMAC').value.trim();
    let zModel = document.getElementById('zhoneModel').value; if(zModel==='Other') zModel=document.getElementById('zhoneModelOther').value||'Other';
    let aLoc = document.getElementById('airtiesLocation').value; if(aLoc==='Other') aLoc = document.getElementById('airtiesLocationOther').value||'Other';
    const aMAC = document.getElementById('airtiesMAC').value.trim();
    let aModel = document.getElementById('airtiesModel').value; if(aModel==='Other') aModel=document.getElementById('airtiesModelOther').value||'Other';
    const rj45 = parseInt(document.getElementById('rj45Terminated').value)||0;
    const totalCat = parseInt(document.getElementById('totalCat5').value)||0;
    const panel = `Floor: ${document.getElementById('floor').value||'—'}, Panel: ${document.getElementById('panel').value||'—'}, Port: ${document.getElementById('port').value||'—'}`;
    const suite = parseFloat(document.getElementById('suiteValue').value)||0;
    const riser = parseFloat(document.getElementById('riserValue').value)||0;
    const total = Math.round(Math.abs(suite - riser));
    const hub = document.getElementById('hubStock').value;
    // rooms summary
    const roomsSummary = rooms.reduce((acc,cur)=>{ acc[cur.room]=(acc[cur.room]||0)+1; return acc; },{});
    // materials summary
    const materialsSummary = materials.map(m=>`${m.code} - ${m.qty}`).join('\n') || 'None';

    // termination phrasing e.g. "1/3 lines were terminated and 1/3 plugged into the Zhone and 1 lines fluked as per customer request."
    const terminatedPhr = `${rj45}/${totalCat} lines were terminated and ${rj45}/${totalCat} plugged into the Zhone and ${Math.max(0,totalCat - rj45)} lines fluked as per customer request.`;

    let note = `Inside Installer: ${inside}
Outside Installer: ${outside}

Tests completed: ${tests}

Zhone location : ${zLoc}
Zhone MAC : ${zMAC}
Zhone Model : ${zModel}

Airties Location: ${aLoc}
Airties MAC : ${aMAC}
Airties Model : ${aModel}

${terminatedPhr}

Terminated Rooms:`;
    Object.keys(roomsSummary).forEach(k=>{ note += `\n- ${k}: ${roomsSummary[k]}`; });

    note += `

Panel Information:
${panel}

Fibre Meter Mark:
Suite = ${suite} m, Riser = ${riser} m, Total = ${total} metres

Hub Stock Inventory:- ${hub}

Material list:-
${materialsSummary}

----`;

    outputArea.textContent = note;
  });

  // copy button
  copyBtn.addEventListener('click', ()=>{
    navigator.clipboard.writeText(outputArea.textContent).then(()=>{ alert('Copied to clipboard'); }, ()=>{ alert('Copy failed'); });
  });

});