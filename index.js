document.addEventListener("DOMContentLoaded", () => {
  const incomeForm = document.getElementById("income-form");
  const expenseForm = document.getElementById("expense-form");
  const incomeList = document.getElementById("income-list");
  const expenseList = document.getElementById("expense-list");
  const budgetSummary = document.getElementById("budget-summary");
  const incomesSummary = document.getElementById("incomes-summary");
  const expensesSummary = document.getElementById("expenses-summary");
  const editModal = new bootstrap.Modal(document.getElementById('editModal'));
  const editForm = document.getElementById('edit-form');
  const editName = document.getElementById('edit-name');
  const editAmount = document.getElementById('edit-amount');

  let incomes = [];
  let expenses = [];
  let currentItem = null;
  let currentList = null;

  const updateSummary = () => {
      const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
      const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
      const balance = totalIncome - totalExpense;

      if (balance > 0) {
          budgetSummary.textContent = `Nadal możesz wydać PLN ${balance.toFixed(2)}`;
          budgetSummary.className = "alert alert-info text-center display-4";
          incomesSummary.textContent = `Suma przychodów: ${totalIncome.toFixed(2)} zł`;
          expensesSummary.textContent = `Suma wydatków: ${totalExpense.toFixed(2)} zł`;
      } else if (balance === 0) {
          budgetSummary.textContent = "Bilans wynosi zero.";
          budgetSummary.className = "alert alert-warning text-center display-4";
      } else {
          budgetSummary.textContent = `Bilans jest ujemny. Jesteś na minusie. ${Math.abs(balance).toFixed(2)} zł.`;
          budgetSummary.className = "alert alert-danger text-center display-4";
      }
  };

  const addItemToList = (list, item, items) => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.innerHTML = `
          ${item.name} - ${item.amount.toFixed(2)} PLN
          <div>
              <button class="btn btn-warning edit-btn">Edytuj</button>
              <button class="btn btn-danger delete-btn">Usuń</button>
          </div>
      `;

      list.appendChild(li);

      const editButton = li.querySelector(".edit-btn");
      const deleteButton = li.querySelector(".delete-btn");

      editButton.addEventListener("click", () => {
          currentItem = item;
          currentList = list;
          editName.value = item.name;
          editAmount.value = item.amount;
          editModal.show();
      });

      deleteButton.addEventListener("click", () => {
          list.removeChild(li);
          const index = items.indexOf(item);
          if (index !== -1) {
              items.splice(index, 1);
          }
          updateSummary();
      });
  };

  editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newName = editName.value;
      const newAmount = parseFloat(editAmount.value);

      if (newName && !isNaN(newAmount) && newAmount > 0) {
          currentItem.name = newName;
          currentItem.amount = newAmount;
          currentList.innerHTML = '';
          currentList === incomeList ? incomes.forEach(item => addItemToList(currentList, item, incomes)) : expenses.forEach(item => addItemToList(currentList, item, expenses));
          updateSummary();
          editModal.hide();
      } else {
          alert("Wprowadź kwotę większą niż 0.");
      }
  });

  incomeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("income-name").value;
      const amount = parseFloat(document.getElementById("income-amount").value);

      if (amount <= 0) {
          alert("Wprowadź kwotę większą niż 0.");
          return;
      }

      if (name && !isNaN(amount)) {
          const income = { name, amount };
          incomes.push(income);
          addItemToList(incomeList, income, incomes);
          updateSummary();
          incomeForm.reset();
      }
  });

  expenseForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("expense-name").value;
      const amount = parseFloat(document.getElementById("expense-amount").value);

      if (amount <= 0) {
          alert("Wprowadź kwotę większą niż 0.");
          return;
      }

      if (name && !isNaN(amount)) {
          const expense = { name, amount };
          expenses.push(expense);
          addItemToList(expenseList, expense, expenses);
          updateSummary();
          expenseForm.reset();
      }
  });
});