// Sample event data
const FESTIVAL_DATE = new Date("2026-11-20T09:00:00");

const events = [
    { id: 1, name: "CodeSprint Hackathon", category: "Technical", date: "2026-11-20", time: "10:00 AM", venue: "Computer Lab A", coordinator: "Dr. Ramesh Kumar", icon: "💻", description: "A six-hour team coding challenge." },
    { id: 2, name: "Robo Wars", category: "Technical", date: "2026-11-21", time: "11:00 AM", venue: "Mechanical Workshop", coordinator: "Prof. Anitha S", icon: "🤖", description: "Build and battle robots in a knock-out arena." },
    { id: 3, name: "Group Dance", category: "Cultural", date: "2026-11-21", time: "5:00 PM", venue: "Open Air Theatre", coordinator: "Ms. Divya R", icon: "💃", description: "Classical, folk and western dance performances." },
    { id: 4, name: "Singing Contest", category: "Cultural", date: "2026-11-20", time: "4:00 PM", venue: "Main Auditorium", coordinator: "Mr. Karthik V", icon: "🎤", description: "Solo and duet singing rounds." },
    { id: 5, name: "Inter-Department Cricket", category: "Sports", date: "2026-11-22", time: "8:30 AM", venue: "College Ground", coordinator: "Mr. Suresh P", icon: "🏏", description: "Ten-over knock-out matches." },
    { id: 6, name: "Chess Championship", category: "Sports", date: "2026-11-21", time: "9:30 AM", venue: "Indoor Stadium", coordinator: "Mr. Arun M", icon: "♟️", description: "Rapid chess open to all years." },
    { id: 7, name: "AI & ML Workshop", category: "Workshop", date: "2026-11-20", time: "9:30 AM", venue: "Seminar Hall 2", coordinator: "Dr. Priya Menon", icon: "🧠", description: "Hands-on introduction to machine learning in Python." },
    { id: 8, name: "Poetry Slam", category: "Literary", date: "2026-11-21", time: "2:00 PM", venue: "Library Hall", coordinator: "Dr. Meera Iyer", icon: "✍️", description: "Perform original poetry in a three-minute slot." },
    { id: 9, name: "Battle of Bands", category: "Entertainment", date: "2026-11-22", time: "6:00 PM", venue: "Open Air Theatre", coordinator: "Mr. Vikram S", icon: "🎸", description: "Closing night concert with college bands." }
];

const announcements = [
    { date: "2026-10-05", title: "Registration deadline extended", short: "Registration now closes on 15 November.", more: "Teams can edit member names until 17 November through their event coordinator." },
    { date: "2026-10-03", title: "Battle of Bands venue changed", short: "Now at the Open Air Theatre.", more: "Gates open at 5:30 PM. College ID cards are required for entry." }
];

// Get HTML elements
const eventList = document.getElementById("eventList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const eventSelect = document.getElementById("eventSelect");
const regForm = document.getElementById("regForm");
const success = document.getElementById("success");

// Format a date like "Fri, 20 Nov"
function formatDate(d) {
    return new Date(d + "T00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

// Show events after applying search, category filter and sorting
function renderEvents() {

    const text = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;

    const list = events
        .filter(e => (category === "All" || e.category === category) &&
            (e.name + e.venue + e.coordinator + e.description).toLowerCase().includes(text))
        .sort((a, b) => sortSelect.value === "name"
            ? a.name.localeCompare(b.name)
            : a.date.localeCompare(b.date));

    if (list.length === 0) {
        eventList.innerHTML = '<p class="empty">No events found. Try another search or category.</p>';
        return;
    }

    eventList.innerHTML = list.map(e => `
        <div class="event-card" id="card${e.id}">
            <div class="event-icon">${e.icon}</div>
            <h3>${e.name}</h3>
            <span class="category">${e.category}</span>
            <p>📅 ${formatDate(e.date)} · 🕒 ${e.time}</p>
            <p>📍 ${e.venue}</p>
            <p>👤 ${e.coordinator}</p>
            <div class="details"><p>${e.description}</p></div>
            <div class="buttons">
                <button class="secondary" data-details="${e.id}">View Details</button>
                <button class="primary" data-register="${e.id}">Register Now</button>
            </div>
        </div>`).join("");
}

// Handle View Details / Register Now clicks on the cards
eventList.addEventListener("click", function (event) {

    const detailsBtn = event.target.closest("[data-details]");
    const registerBtn = event.target.closest("[data-register]");

    if (detailsBtn) {
        const card = document.getElementById("card" + detailsBtn.dataset.details);
        const open = card.classList.toggle("open");
        detailsBtn.textContent = open ? "Hide Details" : "View Details";
    }

    if (registerBtn) {
        eventSelect.value = registerBtn.dataset.register;
        document.getElementById("registerTitle").scrollIntoView({ behavior: "smooth" });
        document.getElementById("name").focus({ preventScroll: true });
    }
});

// Set up filters and dropdowns
categoryFilter.innerHTML = ["All", ...new Set(events.map(e => e.category))]
    .map(c => `<option value="${c}">${c === "All" ? "All categories" : c}</option>`).join("");

eventSelect.innerHTML = '<option value="">Select an event</option>' +
    events.map(e => `<option value="${e.id}">${e.name} (${formatDate(e.date)})</option>`).join("");

[searchInput, categoryFilter, sortSelect].forEach(el => el.addEventListener("input", renderEvents));
renderEvents();

// Announcements with Read More
const annBox = document.getElementById("announcements");
annBox.innerHTML = announcements.map(a => `
    <div class="announcement">
        <small>${formatDate(a.date)}</small>
        <h3>${a.title}</h3>
        <p>${a.short}</p>
        <p class="more">${a.more}</p>
        <button>Read More</button>
    </div>`).join("");

annBox.addEventListener("click", function (event) {
    const btn = event.target.closest("button");
    if (!btn) return;
    const open = btn.parentElement.classList.toggle("open");
    btn.textContent = open ? "Show Less" : "Read More";
});

// Countdown to the festival
function updateCountdown() {
    const box = document.getElementById("countdown");
    const diff = FESTIVAL_DATE - new Date();

    if (diff <= 0) {
        box.innerHTML = "<strong>🎊 The festival is on!</strong>";
        return;
    }

    const parts = [["Days", diff / 864e5], ["Hours", diff / 36e5 % 24], ["Mins", diff / 6e4 % 60], ["Secs", diff / 1e3 % 60]];
    box.innerHTML = parts.map(([label, n]) =>
        `<div><strong>${String(Math.floor(n)).padStart(2, "0")}</strong><span>${label}</span></div>`).join("");
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Form validation: each rule returns an error message, or "" if valid
const rules = {
    name: v => /^[A-Za-z .]{3,}$/.test(v) ? "" : "Enter your full name (letters only, at least 3 characters).",
    regNo: v => /^[A-Za-z0-9]{6,15}$/.test(v) ? "" : "Enter 6 to 15 letters or digits.",
    dept: v => v ? "" : "Select your department.",
    year: v => v ? "" : "Select your year.",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Enter a valid email address.",
    phone: v => /^[6-9]\d{9}$/.test(v) ? "" : "Enter a 10-digit mobile number.",
    eventSelect: v => v ? "" : "Choose an event.",
    college: v => v.length >= 3 ? "" : "Enter your college name."
};

function validateField(id) {
    const input = document.getElementById(id);
    const message = rules[id](input.value.trim());
    const wrapper = input.closest(".field");
    wrapper.classList.toggle("invalid", message !== "");
    wrapper.querySelector(".msg").textContent = message;
    return message === "";
}

Object.keys(rules).forEach(id =>
    document.getElementById(id).addEventListener("blur", () => validateField(id)));

regForm.addEventListener("submit", function (event) {

    event.preventDefault();

    let valid = Object.keys(rules).map(validateField).every(Boolean);

    const gender = regForm.querySelector('input[name="gender"]:checked');
    document.getElementById("genderMsg").textContent = gender ? "" : "Select a gender option.";

    const terms = document.getElementById("terms");
    document.getElementById("termsMsg").textContent = terms.checked ? "" : "Please accept the terms to continue.";

    if (!valid || !gender || !terms.checked) return;

    // Show a success message
    const chosen = events.find(e => e.id == eventSelect.value);
    success.innerHTML = `<h3>✅ Registration successful!</h3>
        <p>Thank you, ${document.getElementById("name").value.trim()}. You are registered for <strong>${chosen.name}</strong> on ${formatDate(chosen.date)} at ${chosen.time}.</p>
        <p>Reference: UTS26-${Math.floor(10000 + Math.random() * 90000)}</p>`;
    success.style.display = "block";
    success.scrollIntoView({ behavior: "smooth", block: "center" });
    regForm.reset();
});

// Hide the success message and clear errors when the form is reset
regForm.addEventListener("reset", function () {
    success.style.display = "none";
    regForm.querySelectorAll(".msg").forEach(m => m.textContent = "");
    regForm.querySelectorAll(".invalid").forEach(f => f.classList.remove("invalid"));
});
