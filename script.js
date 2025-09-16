document.addEventListener("DOMContentLoaded", () => {
  const materialsSelect = document.getElementById("materialsSelect");
  const generateBtn = document.getElementById("generateBtn");
  const outputArea = document.getElementById("outputArea");

  let templateText = "";

  // Load materials list
  fetch("materials.json")
    .then(response => {
      if (!response.ok) throw new Error("materials.json not found");
      return response.json();
    })
    .then(materials => {
      materials.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item;
        opt.textContent = item;
        materialsSelect.appendChild(opt);
      });
    })
    .catch(err => console.error("Error loading materials:", err));

  // Load template
  fetch("template.txt")
    .then(response => {
      if (!response.ok) throw new Error("template.txt not found");
      return response.text();
    })
    .then(text => { templateText = text; })
    .catch(() => {
      templateText = `Job: {{jobName}}
Date: {{date}}

Materials: {{materials}}

Notes:
{{notes}}`;
    });

  // On button click, generate note
  generateBtn.addEventListener("click", () => {
    const jobName = document.getElementById("jobName").value.trim();
    const date = document.getElementById("date").value;
    const notes = document.getElementById("notes").value.trim();
    const selectedMaterials = Array.from(materialsSelect.selectedOptions).map(o => o.value);

    let output = templateText
      .replace(/{{jobName}}/g, jobName || "—")
      .replace(/{{date}}/g, date || "—")
      .replace(/{{materials}}/g, selectedMaterials.length > 0 ? selectedMaterials.join(", ") : "None")
      .replace(/{{notes}}/g, notes || "None");

    outputArea.textContent = output;
  });
});