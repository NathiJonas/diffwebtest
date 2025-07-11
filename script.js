let learners = [];
let sortAsc = true;

async function loadData() {
  const res = await fetch('learners.json');
  learners = await res.json();
  renderTable();
}

function renderTable() {
  const tbody = document.querySelector("#learnerTable tbody");
  const filterClass = document.getElementById("filterClass").value;
  const search = document.getElementById("searchInput").value.toLowerCase();
  tbody.innerHTML = "";
  learners.filter(l => 
    (!filterClass || l.class === filterClass) &&
    (!search || l.name.toLowerCase().includes(search))
  ).forEach(l => {
    tbody.innerHTML += `
      <tr>
        <td contenteditable="true">${l.name}</td>
        <td>${l.grade}</td>
        <td>${l.class}</td>
        <td>${l.age}</td>
        <td>${l.parent_name}</td>
        <td>${l.parent_cell}</td>
        <td>${l.score_visual}</td>
        <td>${l.score_auditory}</td>
        <td>${l.score_reading}</td>
        <td>${l.score_kinesthetic}</td>
        <td>${l.preferred_learning_style}</td>
      </tr>`;
  });
  renderChart();
}

function renderChart() {
  const ctx = document.getElementById('learnerChart').getContext('2d');
  if (window.learnerChart) window.learnerChart.destroy();

  // Example: count preferred learning styles
  const styleCounts = {};
  learners.filter(l => 
    (!document.getElementById("filterClass").value || l.class === document.getElementById("filterClass").value) &&
    (!document.getElementById("searchInput").value.toLowerCase() || l.name.toLowerCase().includes(document.getElementById("searchInput").value.toLowerCase()))
  ).forEach(l => {
    const style = l.preferred_learning_style || "Unknown";
    styleCounts[style] = (styleCounts[style] || 0) + 1;
    
  });

  window.learnerChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(styleCounts),
      datasets: [{
        label: "Preferred Learning Style Count",
        data: Object.values(styleCounts),
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }]
    },
    options: {
      scales: { y: { beginAtZero: true } },
      plugins: { legend: { display: false } }
    }
  });
}
function sortTable(field) {
  learners.sort((a, b) => {
    let nameA = a.name.split(" ").slice(-1)[0].toLowerCase();
    let nameB = b.name.split(" ").slice(-1)[0].toLowerCase();
    if (nameA < nameB) return sortAsc ? -1 : 1;
    if (nameA > nameB) return sortAsc ? 1 : -1;
    return 0;
  });
  sortAsc = !sortAsc;
  renderTable();
}

function exportCSV() {
  const rows = [["Name", "Grade", "Class", "Age", "Parent", "Cell", "Visual", "Auditory", "Reading", "Kinesthetic", "Preferred"]];
  learners.forEach(l => {
    rows.push([l.name, l.grade, l.class, l.age, l.parent_name, l.parent_cell, l.score_visual, l.score_auditory, l.score_reading, l.score_kinesthetic, l.preferred_learning_style]);
  });
  const csv = rows.map(row => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "learners.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}

if (!localStorage.getItem("loggedIn")) {
  window.location.href = "login.html";
} else {
  loadData();
}

