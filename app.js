const STORAGE_KEY = "personal-finance-transactions-v1";

function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveTransactions(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function formatCurrency(value) {
  const amount = Number(value) || 0;
  return `${amount.toLocaleString("sr-RS", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} RSD`;
}

function sameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function sameMonth(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth()
  );
}

function sameYear(dateA, dateB) {
  return dateA.getFullYear() === dateB.getFullYear();
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

const state = {
  transactions: [],
  viewMode: "daily", // daily | monthly | yearly | all
  viewDate: new Date(),
};

function init() {
  const today = new Date();
  const dateInput = document.getElementById("date");
  const viewDateInput = document.getElementById("view-date");

  const isoToday = today.toISOString().slice(0, 10);
  if (dateInput) dateInput.value = isoToday;
  if (viewDateInput) viewDateInput.value = isoToday;

  state.transactions = loadTransactions();

  const viewModeSelect = document.getElementById("view-mode");
  if (viewModeSelect) {
    viewModeSelect.value = state.viewMode;
    viewModeSelect.addEventListener("change", () => {
      state.viewMode = viewModeSelect.value;
      render();
    });
  }

  if (viewDateInput) {
    viewDateInput.addEventListener("change", () => {
      const val = viewDateInput.value;
      if (val) {
        state.viewDate = new Date(val);
        render();
      }
    });
  }

  const form = document.getElementById("transaction-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleAddTransaction();
    });
  }

  render();
}

function handleAddTransaction() {
  const dateEl = document.getElementById("date");
  const typeEl = document.getElementById("type");
  const categoryEl = document.getElementById("category");
  const descriptionEl = document.getElementById("description");
  const amountEl = document.getElementById("amount");

  const dateVal = dateEl.value;
  const typeVal = typeEl.value;
  const categoryVal = categoryEl.value.trim();
  const descriptionVal = descriptionEl.value.trim();
  const amountVal = parseFloat(amountEl.value.replace(",", "."));

  if (!dateVal || !typeVal || Number.isNaN(amountVal) || amountVal <= 0) {
    alert("Molim unesite ispravan datum, tip i pozitivan iznos.");
    return;
  }

  const transaction = {
    id: generateId(),
    date: dateVal,
    type: typeVal === "income" ? "income" : "expense",
    category: categoryVal || (typeVal === "income" ? "Ostalo" : "Ostalo"),
    description: descriptionVal,
    amount: amountVal,
  };

  state.transactions.push(transaction);
  saveTransactions(state.transactions);
  amountEl.value = "";
  descriptionEl.value = "";

  render();
}

function handleDeleteTransaction(id) {
  if (!confirm("Da li sigurno želite da obrišete ovaj unos?")) return;
  state.transactions = state.transactions.filter((t) => t.id !== id);
  saveTransactions(state.transactions);
  render();
}

function getFilteredTransactions() {
  if (state.viewMode === "all") return [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1));

  const baseDate = state.viewDate || new Date();

  return state.transactions
    .filter((t) => {
      const d = new Date(t.date);
      if (Number.isNaN(d.getTime())) return false;

      if (state.viewMode === "daily") return sameDay(d, baseDate);
      if (state.viewMode === "monthly") return sameMonth(d, baseDate);
      if (state.viewMode === "yearly") return sameYear(d, baseDate);
      return true;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function renderSummary(list) {
  const incomeEl = document.getElementById("summary-income");
  const expenseEl = document.getElementById("summary-expense");
  const balanceEl = document.getElementById("summary-balance");

  const totals = list.reduce(
    (acc, t) => {
      if (t.type === "income") acc.income += t.amount;
      else acc.expense += t.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const balance = totals.income - totals.expense;

  if (incomeEl) incomeEl.textContent = formatCurrency(totals.income);
  if (expenseEl) expenseEl.textContent = formatCurrency(totals.expense);
  if (balanceEl) balanceEl.textContent = formatCurrency(balance);
}

function renderTable(list) {
  const tbody = document.getElementById("transactions-body");
  if (!tbody) return;

  if (!list.length) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align:center; padding:14px; color:#9ca3af;">Nema unosa za izabrani period.</td></tr>';
    return;
  }

  tbody.innerHTML = "";

  for (const t of list) {
    const tr = document.createElement("tr");
    tr.className = t.type === "income" ? "income-row" : "expense-row";

    const dateCell = document.createElement("td");
    dateCell.textContent = new Date(t.date).toLocaleDateString("sr-RS");

    const typeCell = document.createElement("td");
    typeCell.textContent = t.type === "income" ? "Prihod" : "Rashod";

    const catCell = document.createElement("td");
    catCell.textContent = t.category || "—";

    const descCell = document.createElement("td");
    descCell.textContent = t.description || "—";

    const amountCell = document.createElement("td");
    amountCell.className = "right";
    amountCell.textContent = formatCurrency(t.amount);

    const actionCell = document.createElement("td");
    actionCell.style.textAlign = "right";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn icon";
    btn.textContent = "Obriši";
    btn.addEventListener("click", () => handleDeleteTransaction(t.id));
    actionCell.appendChild(btn);

    tr.appendChild(dateCell);
    tr.appendChild(typeCell);
    tr.appendChild(catCell);
    tr.appendChild(descCell);
    tr.appendChild(amountCell);
    tr.appendChild(actionCell);

    tbody.appendChild(tr);
  }
}

function render() {
  const list = getFilteredTransactions();
  renderSummary(list);
  renderTable(list);
}

document.addEventListener("DOMContentLoaded", init);

