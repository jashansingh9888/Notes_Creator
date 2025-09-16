document.addEventListener("DOMContentLoaded", () => {
  const outputArea = document.getElementById("outputArea");
  const roomList = document.getElementById("roomList");
  const materialList = document.getElementById("materialList");
  let rooms = [];
  let materials = [];

  // Add Room
  document.getElementById("addRoom").addEventListener("click", ()=>{
    let room = document.getElementById("terminatedRoom").value;
    if(room==="Other") room = document.getElementById("terminatedRoomOther").value;
    let qty = parseInt(document.getElementById("terminatedQty").value)||0;
    if(room && qty>0){
      rooms.push({room, qty});
      renderRooms();
    }
  });

  function renderRooms(){
    roomList.innerHTML="";
    rooms.forEach(r=>{
      const li=document.createElement("li");
      li.textContent = `${r.room}: ${r.qty}`;
      roomList.appendChild(li);
    });
  }

  // Add Material
  document.getElementById("addMaterial").addEventListener("click", ()=>{
    let code = document.getElementById("materialCode").value.trim();
    let qty = parseInt(document.getElementById("materialQty").value)||0;
    if(code && qty>0){
      materials.push({code, qty});
      renderMaterials();
    }
  });

  function renderMaterials(){
    materialList.innerHTML="";
    materials.forEach(m=>{
      const li=document.createElement("li");
      li.textContent = `${m.code}: ${m.qty}`;
      materialList.appendChild(li);
    });
  }

  // Calculate Riser
  document.getElementById("calculateRiser").addEventListener("click", ()=>{
    const suite = parseFloat(document.getElementById("suiteValue").value)||0;
    const riser = parseFloat(document.getElementById("riserValue").value)||0;
    document.getElementById("totalValue").value = Math.abs(suite - riser);
  });

  // MAC validation
  function validateMAC(mac){
    return /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(mac);
  }

  // Generate Note
  document.getElementById("generateBtn").addEventListener("click", ()=>{
    let insideTech = document.getElementById("insideTech").value;
    let outsideTech = document.getElementById("outsideTech").value;

    let tests = Array.from(document.querySelectorAll("input[name='tests']:checked")).map(c=>c.value).join(", ");

    let zhoneLocation = document.getElementById("zhoneLocation").value;
    if(zhoneLocation==="Other") zhoneLocation=document.getElementById("zhoneLocationOther").value;
    let zhoneMAC = document.getElementById("zhoneMAC").value;
    if(zhoneMAC && !validateMAC(zhoneMAC)){alert("Invalid Zhone MAC!"); return;}
    let zhoneModel = document.getElementById("zhoneModel").value;
    if(zhoneModel==="Other") zhoneModel=document.getElementById("zhoneModelOther").value;

    let airtiesLocation=document.getElementById("airtiesLocation").value;
    if(airtiesLocation==="Other") airtiesLocation=document.getElementById("airtiesLocationOther").value;
    let airtiesMAC=document.getElementById("airtiesMAC").value;
    if(airtiesMAC && !validateMAC(airtiesMAC)){alert("Invalid Airties MAC!"); return;}
    let airtiesModel=document.getElementById("airtiesModel").value;
    if(airtiesModel==="Other") airtiesModel=document.getElementById("airtiesModelOther").value;

    let rj45=document.getElementById("rj45Terminated").value;
    let totalCat5=document.getElementById("totalCat5").value;
    let panelInfo=`Floor: ${document.getElementById("floor").value}, Panel: ${document.getElementById("panel").value}, Port: ${document.getElementById("port").value}`;

    let suite=document.getElementById("suiteValue").value;
    let riser=document.getElementById("riserValue").value;
    let total=document.getElementById("totalValue").value;

    let hubStock=document.getElementById("hubStockLocation").value;

    let note = `Inside Installer: ${insideTech}
Outside Installer: ${outsideTech}

Tests completed: ${tests}

Zhone Location: ${zhoneLocation}
Zhone MAC: ${zhoneMAC}
Zhone Model: ${zhoneModel}

Airties Location: ${airtiesLocation}
Airties MAC: ${airtiesMAC}
Airties Model: ${airtiesModel}

RJ45's Terminated: ${rj45}
Total CAT5 Lines in Unit: ${totalCat5}
Terminated Rooms:`;
    rooms.forEach(r=>{note += `\n- ${r.room}: ${r.qty}`});

    note += `

Panel Information:
${panelInfo}

Fibre Meter Mark:
Suite = ${suite} m, Riser = ${riser} m, Total = ${total} m

Hub Stock Inventory: ${hubStock}

Material List:`;
    materials.forEach(m=>{note += `\n- ${m.code}: ${m.qty}`});

    outputArea.textContent=note;
  });
});
