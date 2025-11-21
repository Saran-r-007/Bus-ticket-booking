const state = {
    from: "",
    to: "",
    date: "",
    routeKey: "",
    seats: [],
    farePerSeat: 600,
    passenger: {
        name: "",
        phone: "",
        email: ""
    },
    boardingTime: "",
    dropTime: ""
};

const routes = {
    "Coimbatore-Pudukkottai": {
        boardingPoint: "Coimbatore",
        dropPoint: "Pudukkottai",
        boardingTime: "09:30 PM",
        dropTime: "04:00 AM"
    },
    "Pudukkottai-Coimbatore": {
        boardingPoint: "Pudukkottai",
        dropPoint: "Coimbatore",
        boardingTime: "09:00 AM",
        dropTime: "04:00 PM"
    }
};

const sections = {
    booking: document.getElementById("bookingPanel"),
    seat: document.getElementById("seatPanel"),
    pickup: document.getElementById("pickupPanel"),
    passenger: document.getElementById("passengerPanel"),
    payment: document.getElementById("paymentPanel")
};

const els = {
    goBtn: document.getElementById("ctaGo"),
    bookingForm: document.getElementById("bookingForm"),
    fromSelect: document.getElementById("fromSelect"),
    toSelect: document.getElementById("toSelect"),
    dateInput: document.getElementById("journeyDate"),
    bookingMsg: document.getElementById("bookingMessage"),
    seatGrid: document.getElementById("seatGrid"),
    seatSummary: document.getElementById("seatSummary"),
    seatContinue: document.getElementById("seatContinue"),
    pickupNext: document.getElementById("pickupNext"),
    boardingPoint: document.getElementById("boardingPoint"),
    boardingTime: document.getElementById("boardingTime"),
    dropPoint: document.getElementById("dropPoint"),
    dropTime: document.getElementById("dropTime"),
    fareSummary: document.getElementById("fareSummary"),
    passengerForm: document.getElementById("passengerForm"),
    paymentAmount: document.getElementById("paymentAmount"),
    payBtn: document.getElementById("payNow"),
    paymentStatus: document.getElementById("paymentStatus"),
    printTicket: document.getElementById("printTicket"),
    ticketFields: {
        passenger: document.getElementById("ticketPassenger"),
        contact: document.getElementById("ticketContact"),
        email: document.getElementById("ticketEmail"),
        date: document.getElementById("ticketDate"),
        seats: document.getElementById("ticketSeats"),
        route: document.getElementById("ticketRoute"),
        timing: document.getElementById("ticketTiming"),
        points: document.getElementById("ticketPoints"),
        fare: document.getElementById("ticketFare")
    }
};

const formatDate = (value) => {
    if (!value) return "--";
    const date = new Date(value);
    return date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

const scrollToSection = (el) => {
    if (!el) return;
    el.classList.remove("hidden");
    el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const clearPaymentState = () => {
    els.paymentStatus.textContent = "";
    els.printTicket.disabled = true;
};

const updateSeatSummary = () => {
    els.seatSummary.textContent = state.seats.length
        ? `${state.seats.length} seat(s): ${state.seats.join(", ")}`
        : "None";
    els.seatContinue.disabled = state.seats.length === 0;
};

const buildSeatLayout = () => {
    const createSeat = (number) => {
        const seatBtn = document.createElement("button");
        seatBtn.type = "button";
        seatBtn.className = "seat";
        seatBtn.textContent = number;
        seatBtn.dataset.seat = `S${number}`;
        seatBtn.addEventListener("click", () => toggleSeat(seatBtn.dataset.seat, seatBtn));
        return seatBtn;
    };

    const createSpacer = () => {
        const spacer = document.createElement("span");
        spacer.className = "spacer";
        return spacer;
    };

    let seatNumber = 1;

    const appendStandardRow = () => {
        for (let col = 0; col < 6; col++) {
            if (col === 3) {
                els.seatGrid.appendChild(createSpacer());
                continue;
            }
            els.seatGrid.appendChild(createSeat(seatNumber++));
        }
    };

    for (let i = 0; i < 9; i++) {
        appendStandardRow();
    }

    // Partial row with 3 seats (driver side) to reach 48 seats before rear bench
    for (let col = 0; col < 6; col++) {
        if (col < 3) {
            els.seatGrid.appendChild(createSeat(seatNumber++));
        } else {
            els.seatGrid.appendChild(createSpacer());
        }
    }

    // Rear bench with 6 seats (final six numbers)
    for (let col = 0; col < 6; col++) {
        els.seatGrid.appendChild(createSeat(seatNumber++));
    }
};

const toggleSeat = (seatId, btn) => {
    const index = state.seats.indexOf(seatId);
    if (index > -1) {
        state.seats.splice(index, 1);
        btn.classList.remove("selected");
    } else {
        state.seats.push(seatId);
        btn.classList.add("selected");
    }
    updateSeatSummary();
    clearPaymentState();
};

const updateRouteSummary = () => {
    const routeInfo = routes[state.routeKey];
    if (!routeInfo) return;

    els.boardingPoint.textContent = routeInfo.boardingPoint;
    els.dropPoint.textContent = routeInfo.dropPoint;
    els.boardingTime.textContent = `Boarding at ${routeInfo.boardingTime}`;
    els.dropTime.textContent = `Drop at ${routeInfo.dropTime}`;
    const fare = state.seats.length * state.farePerSeat;
    els.fareSummary.textContent = `₹${fare} (${state.seats.length} seat${state.seats.length === 1 ? "" : "s"})`;
    state.boardingTime = routeInfo.boardingTime;
    state.dropTime = routeInfo.dropTime;
    els.pickupNext.disabled = state.seats.length === 0;
};

const hydrateTicket = () => {
    const routeText = `${state.from} ➔ ${state.to}`;
    const timingText = `${state.boardingTime} / ${state.dropTime}`;
    const pointText = `${routes[state.routeKey].boardingPoint} / ${routes[state.routeKey].dropPoint}`;
    const fare = state.seats.length * state.farePerSeat;

    els.ticketFields.passenger.textContent = `Passenger: ${state.passenger.name}`;
    els.ticketFields.contact.textContent = `Contact: ${state.passenger.phone}`;
    els.ticketFields.email.textContent = `Email: ${state.passenger.email}`;
    els.ticketFields.date.textContent = `Date: ${formatDate(state.date)}`;
    els.ticketFields.seats.textContent = `Seats: ${state.seats.join(", ")}`;
    els.ticketFields.route.textContent = `Route: ${routeText}`;
    els.ticketFields.timing.textContent = `Boarding / Drop: ${timingText}`;
    els.ticketFields.points.textContent = `Boarding Point / Drop Point: ${pointText}`;
    els.ticketFields.fare.textContent = `Amount Paid: ₹${fare}`;
    els.paymentAmount.textContent = `₹${fare}`;
};

const handleBookingSubmit = (event) => {
    event.preventDefault();
    const from = els.fromSelect.value;
    const to = els.toSelect.value;
    const date = els.dateInput.value;
    els.bookingMsg.textContent = "";

    if (!from || !to || !date) {
        els.bookingMsg.textContent = "Please choose From, To, and Journey Date.";
        return;
    }

    if (from === to) {
        els.bookingMsg.textContent = "Origin and destination cannot be the same.";
        return;
    }

    const routeKey = `${from}-${to}`;
    if (!routes[routeKey]) {
        els.bookingMsg.textContent = "Route not available. Choose Coimbatore ↔ Pudukkottai.";
        return;
    }

    state.from = from;
    state.to = to;
    state.date = date;
    state.routeKey = routeKey;
    state.seats = [];
    updateSeatSummary();
    clearPaymentState();

    // Reset seats UI selections
    Array.from(document.querySelectorAll(".seat.selected")).forEach((seat) =>
        seat.classList.remove("selected")
    );

    scrollToSection(sections.seat);
};

const handleSeatContinue = () => {
    if (!state.seats.length) return;
    updateRouteSummary();
    scrollToSection(sections.pickup);
};

const handlePickupNext = () => {
    if (!state.seats.length) return;
    scrollToSection(sections.passenger);
};

const handlePassengerSubmit = (event) => {
    event.preventDefault();
    state.passenger = {
        name: document.getElementById("passengerName").value.trim(),
        phone: document.getElementById("passengerPhone").value.trim(),
        email: document.getElementById("passengerEmail").value.trim()
    };

    hydrateTicket();
    clearPaymentState();
    scrollToSection(sections.payment);
};

const handlePayment = () => {
    els.paymentStatus.textContent = "Payment successful! Thank you for choosing Amman Travels.";
    els.printTicket.disabled = false;
};

const init = () => {
    sections.booking.classList.remove("hidden");
    buildSeatLayout();

    els.goBtn.addEventListener("click", () => scrollToSection(sections.booking));
    els.bookingForm.addEventListener("submit", handleBookingSubmit);
    els.seatContinue.addEventListener("click", handleSeatContinue);
    els.pickupNext.addEventListener("click", handlePickupNext);
    els.passengerForm.addEventListener("submit", handlePassengerSubmit);
    els.payBtn.addEventListener("click", handlePayment);
    els.printTicket.addEventListener("click", () => window.print());
};

document.addEventListener("DOMContentLoaded", init);

