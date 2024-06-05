document.addEventListener("DOMContentLoaded", () => {
  const incomeForm = document.getElementById("income-form");
  const expenseForm = document.getElementById("expense-form");
  const incomeList = document.getElementById("income-list");
  const expenseList = document.getElementById("expense-list");
  const budgetSummary = document.getElementById("budget-summary");
  const incomesSummary = document.getElementById("incomes-summary");
  const expenseSummary = document.getElementById("expenses-summary");

  let incomes = [];
  let expenses = [];

  const updateSummary = () => {
    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    const balance = totalIncome - totalExpense;

    if (balance > 0) {
      budgetSummary.textContent = `Nadal możesz wydać PLN ${balance}`;
      budgetSummary.className = "alert alert-info";
      incomesSummary.textContent = `Suma przyhodów: ${totalIncome}zł`;
      expenseSummary.textContent = `Suma wydatków: ${totalExpense}zł`;
    } else if (balance === 0) {
      budgetSummary.textContent = "Bilans wynosi zero.";
      budgetSummary.className = "alert alert-warning";
    } else {
      budgetSummary.textContent = `Bilans jest ujemny. Jesteś na minusie. ${Math.abs(
        balance
      )}.`;
      budgetSummary.className = "alert alert-danger";
    }
  };

  const addItemToList = (list, item, items) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `
            ${item.name} - ${item.amount} PLN
            <div>
                <button class="btn btn-warning edit-btn">Edytuj</button>
                <button class="btn btn-danger delete-btn">Usuń</button>
            </div>
        `;

    list.appendChild(li);

    const editButton = li.querySelector(".edit-btn");
    const deleteButton = li.querySelector(".delete-btn");

    editButton.addEventListener("click", () => {
      const newName = prompt("Wprowadź nową nazwę", item.name);
      const newAmount = parseFloat(prompt("Wprowadź nową kwotę", item.amount));

      if (newName && !isNaN(newAmount)) {
        item.name = newName;
        item.amount = newAmount;
        li.innerHTML = `
                    ${item.name} - ${item.amount} PLN
                    <div>
                        <button class="btn btn-warning edit-btn">Edytuj</button>
                        <button class="btn btn-danger delete-btn">Usuń</button>
                    </div>
                `;

        editButton.addEventListener("click", () => {
          editButton.click();
        });

        deleteButton.addEventListener("click", () => {
          deleteButton.click();
        });

        updateSummary();
      }
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
