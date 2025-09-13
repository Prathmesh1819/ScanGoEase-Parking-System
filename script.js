import { ref, onValue, set, get } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { db } from "./firebase.js";

const totalSlots = 24;
const slotGrid = document.getElementById("slotGrid");
const availableSlotsEl = document.getElementById("availableSlots");
const occupiedSlotsEl = document.getElementById("occupiedSlots");

function renderSlots(parkingData) {
  slotGrid.innerHTML = "";
  let occupied = 0;

  for (let i = 1; i <= totalSlots; i++) {
    const slotDiv = document.createElement("div");
    slotDiv.classList.add("slot");
    slotDiv.textContent = "Slot " + i;

    const vehicle = Object.values(parkingData || {}).find(v => v.slot === i);
    if (vehicle) {
      slotDiv.classList.add("occupied");
      occupied++;
    } else {
      slotDiv.classList.add("available");
    }

    slotGrid.appendChild(slotDiv);
  }

  availableSlotsEl.textContent = totalSlots - occupied;
  occupiedSlotsEl.textContent = occupied;
}

const parkingRef = ref(db, "parking/");

onValue(parkingRef, snapshot => {
  renderSlots(snapshot.val());
});

document.getElementById("parkingForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const vehicleNumber = document.getElementById("vehicleNumber").value.trim();
  const vehicleType = document.getElementById("vehicleType").value;
  if (!vehicleNumber) return alert("Enter vehicle number");

  const snapshot = await get(parkingRef);
  const data = snapshot.val() || {};
  const occupiedSlotsArr = Object.values(data).map(v => v.slot);

  let freeSlot = null;
  for (let i = 1; i <= totalSlots; i++) {
    if (!occupiedSlotsArr.includes(i)) {
      freeSlot = i;
      break;
    }
  }
  if (!freeSlot) return alert("All slots full!");

  await set(ref(db, "parking/" + vehicleNumber), {
    vehicleNumber,
    vehicleType,
    slot: freeSlot,
    entryTime: new Date().toISOString(),
    status: "Unpaid"
  });

  new QRious({
    element: document.getElementById("qrCanvas"),
    size: 200,
    value: vehicleNumber
  });

  document.getElementById("qrSection").style.display = "block";
});
