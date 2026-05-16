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

document
.getElementById("saveBtn")
.addEventListener("click", saveAppointment);

document
.getElementById("searchInput")
.addEventListener("input", renderAppointments);

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

  if (!appointment.name || !appointment.property) {
    alert("يرجى تعبئة البيانات");
    return;
  }

  if (editId) {

    appointments = appointments.map(a =>
      a.id === editId ? appointment : a
    );

    editId = null;

  } else {

    appointments.push(appointment);
  }

  localStorage.setItem(
    "appointments",
    JSON.stringify(appointments)
  );

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
        <div class="day-title">${day}</div>
      `;

      filtered.forEach(a => {

        container.innerHTML += `
          <div class="card">

            <h3>${a.name}</h3>

            <p><strong>المنطقة:</strong> ${a.area}</p>

            <p><strong>العقار:</strong> ${a.property}</p>

            <p>
<strong>الهاتف:</strong>
<a href="tel:${a.phone}">
${a.phone}
</a>
</p>

            <p><strong>ملاحظات:</strong> ${a.notes}</p>

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
      لا توجد مواعيد
      </div>
    `;
  }
}

function deleteAppointment(id) {

  appointments =
  appointments.filter(a => a.id !== id);

  localStorage.setItem(
    "appointments",
    JSON.stringify(appointments)
  );

  renderAppointments();
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

  localStorage.setItem(
    "appointments",
    JSON.stringify(appointments)
  );

  renderAppointments();
}

function clearForm() {

  document.getElementById("property").value = "";
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("notes").value = "";
}

renderAppointments();
