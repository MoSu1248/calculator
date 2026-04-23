// GLOBAL STATE
let state = {
  value_1: "",
  value_2: "",
  operator: null,
  isError: false,
  justEvaluated: false,
};

const btnsContainer = document.querySelector(".calculator__btns");
const display = document.querySelector(".calculator__display");
const displayOperator = document.querySelector(".calculator__operator--value");

// Keyboard Handler
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (e.repeat) return;

  let selectorKey = key;
  if (key === "Enter") {
    e.preventDefault();
    selectorKey = "=";
  } else if (key === "Backspace") {
    selectorKey = "backspace";
  } else if (key === "Escape") {
    selectorKey = "clear";
  }

  const button = document.querySelector(`[data-value="${selectorKey}"]`);
  if (button) button.classList.add("active");

  if (!isNaN(key)) {
    handleInput("number", key);
    return;
  }

  if (key === "+" || key === "-" || key === "*" || key === "/") {
    handleInput("operator", key);
    return;
  }

  if (key === "Enter" || key === "=") {
    handleInput("equals");
    return;
  }

  if (key === "Backspace") {
    handleInput("backspace");
    return;
  }

  if (key === "Escape") {
    handleInput("clear");
    return;
  }
});

document.addEventListener("keyup", (e) => {
  const key = e.key;

  let selectorKey = key;

  if (key === "Enter") selectorKey = "=";
  if (key === "Backspace") selectorKey = "backspace";
  if (key === "Escape") selectorKey = "clear";

  const button = document.querySelector(`[data-value="${selectorKey}"]`);

  if (button) button.classList.remove("active");
});

// Button Handler
btnsContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".calculator__btn");
  if (!btn) return;

  handleInput(btn.dataset.action, btn.dataset.value);
});

// Input Function
function handleInput(action, value) {
  if (blockIfError(action)) return;

  switch (action) {
    case "number":
      handleNumber(value);
      break;
    case "operator":
      handleOperator(value);
      break;
    case "equals":
      equals();
      break;
    case "clear":
      clear();
      break;
    case "backspace":
      backspace();
      break;
    case "decimal":
      handleDecimal();
      break;
    case "percentage":
      handlePercentage();
      break;
  }

  render();
}

// Rendering Function
function render() {
  if (state.isError) {
    display.value = "You Broke It :( ";
    displayOperator.innerHTML = "";
    display.classList.add("error-state");
    return;
  }

  display.classList.remove("error-state");

  display.value = state.value_2 !== "" ? state.value_2 : state.value_1 || "0";
  console.log(state);

  if (!state.operator) {
    displayOperator.innerHTML = "";
  } else if (state.operator === "*") {
    displayOperator.innerHTML = "×";
  } else if (state.operator === "/") {
    displayOperator.innerHTML = "÷";
  } else {
    displayOperator.innerHTML = state.operator;
  }
}

// Math Function
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;

const divide = (a, b) => {
  return a / b;
};

const operate = (op, a, b) => {
  a = parseFloat(a);
  b = parseFloat(b);

  switch (op) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
  }
};

// Clear Function
function clear() {
  state.value_1 = "";
  state.value_2 = "";
  state.operator = null;
  state.isError = false;
  state.justEvaluated = false;
}

// Backspace Function
function backspace() {
  if (state.operator && state.value_2 === "") {
    state.operator = null;
    return;
  }

  if (!state.operator) {
    state.value_1 = state.value_1.slice(0, -1);
  } else {
    state.value_2 = state.value_2.slice(0, -1);
  }
}

// Number Function
function handleNumber(value) {
  if (!state.operator) {
    if (state.justEvaluated) {
      clear();
      state.justEvaluated = false;
    }

    state.value_1 = (state.value_1 + value).slice(0, 10);
  } else {
    state.value_2 = (state.value_2 + value).slice(0, 10);
  }
}

// Operator Function
function handleOperator(value) {
  if (state.value_1 === "" && value === "-") {
    state.value_1 = "-";
    return;
  }

  if (state.value_1 === "") return;

  if (canCompute()) {
    const result = operate(state.operator, state.value_1, state.value_2);

    state.value_1 = result.toString();
    state.value_2 = "";
  }

  state.operator = value;
}

// Equals Function
function equals() {
  if (!state.operator || state.value_1 === "" || state.value_2 === "") return;

  if (state.operator === "/" && Number(state.value_2) === 0) {
    state.isError = true;
    return;
  }

  const result = operate(state.operator, state.value_1, state.value_2);

  state.value_1 = Number(result.toFixed(10)).toString();
  state.value_2 = "";
  state.operator = null;
  state.justEvaluated = true;
}

// Decimal Function
function handleDecimal() {
  let current = !state.operator ? state.value_1 : state.value_2;

  if (current.includes(".")) return;

  if (!state.operator) state.value_1 += ".";
  else state.value_2 += ".";
}

// Percentage Function
function handlePercentage() {
  if (!state.operator && state.value_1 !== "") {
    state.value_1 = (parseFloat(state.value_1) / 100).toString();
  } else if (state.operator && state.value_2 !== "") {
    state.value_2 = (parseFloat(state.value_2) / 100).toString();
  }
}

// Blocking Error
function blockIfError(action) {
  if (state.isError && action === "number") {
    clear();
    return false;
  }
  return state.isError && action !== "clear";
}

// Check fucntion
function canCompute() {
  return state.operator && state.value_1 !== "" && state.value_2 !== "";
}
