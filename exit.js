import { ref, get, remove } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { db } from "./firebase.js";

const scanBtn = document.getElementById("scanBtn");
const vehicleDetails = document.getElementById("vehicleDetails");

scanBtn.addEventListener("click", async () => {
  const vehNo = document.getElementById("vehicleNoInput").value.trim();
  if (!vehNo) return alert("Enter vehicle number");

  const vehRef = ref(db, "parking/" + vehNo);
  const snapshot = await get(vehRef);

  if (!snapshot.exists()) {
    vehicleDetails.innerHTML = `<p style="color:red;">Vehicle not found!</p>`;
    return;
  }

  const data = snapshot.val();

  // Calculate parking duration
  const entryTime = new Date(data.entryTime);
  const diffHours = Math.ceil((Date.now() - entryTime.getTime()) / (1000 * 60 * 60));
  const amount = diffHours > 0 ? (data.vehicleType === "4-wheeler" ? 15 : 10) * diffHours : 0;

  // UPI Link
  const upiID = "jiasingh2705@okaxis"; // replace with your UPI ID
  const payeeName = "ScanGoEase";
  const upiLink = `upi://pay?pa=${upiID}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=Parking+Payment`;

  vehicleDetails.innerHTML = `
    <p><b>Vehicle No:</b> ${data.vehicleNumber}</p>
    <p><b>Type:</b> ${data.vehicleType}</p>
    <p><b>Slot:</b> ${data.slot}</p>
    <p><b>Entry:</b> ${entryTime.toLocaleString()}</p>
    <p><b>Amount:</b> ₹${amount}</p>
    <a href="${upiLink}" target="_blank"><button id="payBtn">Pay Now</button></a>
  `;

  document.getElementById("payBtn").addEventListener("click", async () => {
    // Mock confirmation: remove vehicle → frees slot
    setTimeout(async () => {
      await remove(ref(db, "parking/" + vehNo));
      vehicleDetails.innerHTML = `<p>Payment successful & slot freed ✅</p>`;
    }, 5000);
  });
});
