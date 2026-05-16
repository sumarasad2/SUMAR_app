let appointments =
  JSON.parse(localStorage.getItem("appointments")) || [];

let editId = null;

const days = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت"
];

const saveBtn =
  document.getElementById("saveBtn");

saveBtn.addEventListener("click", saveAppointment);

document
  .getElementById("searchInput")
  .addEventListener("input", renderAppointments);

document
  .getElementById("importFile")
  .addEventListener("change", importData);

function saveAppointment() {

  const appointment = {
    id: editId || Date.now(),
    day: document.getElementById("day").value,
    area: document.getElementById("area").value,
    property: document.getElementById("property").value,
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    notes: document.getElementById("notes").value
  };

  if (
    !appointment.property ||
    !appointment.name
  ) {
    alert("يرجى تعبئة الحقول المطلوبة");
    return;
  }

  if (editId) {

    appointments = appointments.map(a =>
      a.id === editId ? appointment : a
    );

    editId = null;

  } else {

    appointments.push(appointment);

    showNotification(
      "تم حفظ موعد جديد لـ " + appointment.name
    );
  }

  saveData();

  clearForm();

  renderAppointments();
}

function renderAppointments() {

  const container =
    document.getElementById("appointments");

  const search =
    document.getElementById("searchInput")
      .value
      .toLowerCase();

  container.innerHTML = "";

  let found = false;

  days.forEach(day => {

    const filtered = appointments.filter(a =>
      a.day === day &&
      (
        a.name.toLowerCase().includes(search) ||
        a.property.toLowerCase().includes(search) ||
        a.phone.toLowerCase().includes(search) ||
        a.area.toLowerCase().includes(search)
      )
    );

    if (filtered.length > 0) {

      found = true;

      container.innerHTML += `
        <div class="day-title">
          ${day}
        </div>
      `;

      filtered.forEach(a => {

        container.innerHTML += `
          <div class="card">

            <h3>${a.name}</h3>

            <p>
              <strong>المنطقة:</strong>
              ${a.area}
            </p>

            <p>
              <strong>رقم العقار:</strong>
              ${a.property}
            </p>

            <p>
              <strong>الهاتف:</strong>
              ${a.phone}
            </p>

            <p>
              <strong>ملاحظات:</strong>
              ${a.notes || "-"}
            </p>

            <div class="actions">

              <button
                class="edit-btn"
                onclick="editAppointment(${a.id})">
                تعديل
              </button>

              <button
                class="postpone-btn"
                onclick="postponeAppointment(${a.id})">
                تأجيل
              </button>

              <button
                class="delete-btn"
                onclick="deleteAppointment(${a.id})">
                حذف
              </button>

            </div>

          </div>
        `;
      });
    }
  });

  if (!found) {

    container.innerHTML = `
      <div class="empty">
        لا توجد مواعيد حالياً
      </div>
    `;
  }
}

function editAppointment(id) {

  const a =
    appointments.find(a => a.id === id);

  document.getElementById("day").value = a.day;
  document.getElementById("area").value = a.area;
  document.getElementById("property").value = a.property;
  document.getElementById("name").value = a.name;
  document.getElementById("phone").value = a.phone;
  document.getElementById("notes").value = a.notes;

  editId = id;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function postponeAppointment(id) {

  const appointment =
    appointments.find(a => a.id === id);

  const currentIndex =
    days.indexOf(appointment.day);

  let nextIndex = currentIndex + 1;

  if (nextIndex >= days.length) {
    nextIndex = 0;
  }

  appointment.day = days[nextIndex];

  saveData();

  renderAppointments();

  alert(
    "تم تأجيل الموعد إلى " + appointment.day
  );
}

function deleteAppointment(id) {

  const confirmDelete =
    confirm("هل تريد حذف الموعد؟");

  if (!confirmDelete) return;

  appointments =
    appointments.filter(a => a.id !== id);

  saveData();

  renderAppointments();
}

function clearForm() {

  document.getElementById("property").value = "";
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("notes").value = "";
}

function saveData() {

  localStorage.setItem(
    "appointments",
    JSON.stringify(appointments)
  );
}

function exportData() {

  const data =
    JSON.stringify(appointments, null, 2);

  const blob = new Blob(
    [data],
    { type: "application/json" }
  );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download =
    "appointments-backup.json";

  a.click();

  URL.revokeObjectURL(url);
}

function importData(event) {

  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {

    try {

      appointments =
        JSON.parse(e.target.result);

      saveData();

      renderAppointments();

      alert("تمت استعادة النسخة بنجاح");

    } catch {

      alert("ملف غير صالح");
    }
  };

  reader.readAsText(file);
}

async function requestNotificationPermission() {

  if ("Notification" in window) {

    const permission =
      await Notification.requestPermission();

    if (permission === "granted") {

      new Notification(
        "تم تفعيل الإشعارات"
      );
    }
  }
}

function showNotification(message) {

  if (
    "Notification" in window &&
    Notification.permission === "granted"
  ) {

    new Notification(
      "إدارة الكشف العقاري",
      {
        body: message
      }
    );
  }
}

requestNotificationPermission();

renderAppointments();

if ("serviceWorker" in navigator) {

  navigator.serviceWorker
    .register("service-worker.js");
}