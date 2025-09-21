import { ref, onValue, remove } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { db } from "./firebase.js";

const adminTable = document.getElementById("vehicleTable");

function loadDashboard() {
  const parkingRef = ref(db, "parking/");

  onValue(parkingRef, (snapshot) => {
    const data = snapshot.val() || {};
    adminTable.innerHTML = `
      <tr>
        <th>Vehicle No</th>
        <th>Type</th>
        <th>Slot</th>
        <th>Entry Time</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    `;

    if (Object.keys(data).length === 0) {
      adminTable.innerHTML += `<tr><td colspan="6">No vehicles parked</td></tr>`;
      return;
    }

    Object.values(data).forEach(vehicle => {
      const entryTime = vehicle.entryTime ? new Date(vehicle.entryTime).toLocaleString() : "-";
      const tr = document.createElement("tr");

      const actionCell = vehicle.status === "Unpaid" 
        ? `<button class="payBtn" data-veh="${vehicle.vehicleNumber}">Mark Paid</button>`
        : "✅ Paid";

      tr.innerHTML = `
        <td>${vehicle.vehicleNumber}</td>
        <td>${vehicle.vehicleType}</td>
        <td>${vehicle.slot}</td>
        <td>${entryTime}</td>
        <td>${vehicle.status}</td>
        <td>${actionCell}</td>
      `;
      adminTable.appendChild(tr);
    });

    // Attach click events to Mark Paid buttons
    document.querySelectorAll(".payBtn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const vehNo = e.target.getAttribute("data-veh");
        // Remove vehicle → frees slot
        await remove(ref(db, "parking/" + vehNo));
        alert(`✅ Payment done & slot freed for ${vehNo}`);
      });
    });
  });
}

loadDashboard();
