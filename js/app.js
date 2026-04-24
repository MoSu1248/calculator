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

  if (state.justEvaluated && (action === "number" || action === "decimal")) {
    clear();
  }

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
  const acButton = document.querySelector(`[data-value="clear"]`);
  const displayExpression = document.querySelector(".display__expression");

  if (state.isError) {
    display.value = "You Broke It.";
    displayOperator.innerHTML = "";
    if (displayExpression) displayExpression.innerText = "";
    acButton.classList.add("ac-active");
    return;
  }

  acButton.classList.remove("ac-active");

  if (displayExpression) {
    displayExpression.innerText = getExpression(state);
  }

  display.value = state.value_2 !== "" ? state.value_2 : state.value_1 || "0";

  const opPretty =
    { "*": "×", "/": "÷", "-": "−" }[state.operator] || state.operator;
  displayOperator.innerHTML = state.operator ? opPretty : "";
}

function getExpression(state) {
  if (state.isError) return "";

  const parts = [];

  if (state.value_1 !== "") parts.push(state.value_1);

  if (state.operator) {
    const opPretty =
      {
        "*": "×",
        "/": "÷",
        "-": "−",
        "+": "+",
      }[state.operator] || state.operator;

    parts.push(opPretty);
  }

  if (state.value_2 !== "") parts.push(state.value_2);

  return parts.join(" ");
}

// Math Function
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;

const divide = (a, b) => {
  return a / b;
};

const operate = (op, a, b) => {
  const parseValue = (val) => {
    if (val === "-" || val === "" || val == null) return 0;
    return parseFloat(val);
  };

  const valA = parseValue(a);
  const valB = parseValue(b);

  let result;

  switch (op) {
    case "+":
      result = valA + valB;
      break;
    case "-":
      result = valA - valB;
      break;
    case "*":
      result = valA * valB;
      break;
    case "/":
      result = valB === 0 ? NaN : valA / valB;
      break;
  }

  return Number.isFinite(result) ? result : NaN;
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
  if (state.justEvaluated) {
    clear();
    return;
  }

  if (state.operator !== null) {
    if (state.value_2 !== "" && state.value_2 !== "0") {
      state.value_2 = state.value_2.slice(0, -1);

      if (state.value_2 === "" || state.value_2 === "-") {
        state.value_2 = "0";
      }
    } else {
      state.operator = null;
      state.value_2 = "";
    }
    return;
  }

  if (state.value_1 !== "" && state.value_1 !== "0") {
    state.value_1 = state.value_1.slice(0, -1);

    if (state.value_1 === "" || state.value_1 === "-") {
      state.value_1 = "0";
    }
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
  if (state.justEvaluated) {
    state.justEvaluated = false;
    state.operator = null;
    state.value_2 = "";
  }
  if (state.value_1 === "" && value === "-") {
    state.value_1 = "-";
    return;
  }

  if (state.value_1 === "") return;
  if (state.value_1 === "-") return;

  if (canCompute()) {
    if (state.operator === "/" && Number(state.value_2) === 0) {
      state.isError = true;
      render();
      return;
    }

    const result = operate(state.operator, state.value_1, state.value_2);

    state.value_1 = formatResult(result);
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

  state.value_1 = formatResult(result);
  state.value_2 = "";
  state.operator = null;
  state.justEvaluated = true;
}

// Decimal Function
function handleDecimal() {
  if (state.justEvaluated) {
    clear();
    state.justEvaluated = false;
  }

  let current = !state.operator ? state.value_1 : state.value_2;

  if (current.includes(".")) return;

  if (current === "" || current === "-") {
    if (!state.operator) {
      state.value_1 = current + "0.";
    } else {
      state.value_2 = "0.";
    }
  } else {
    if (!state.operator) {
      state.value_1 += ".";
    } else {
      state.value_2 += ".";
    }
  }
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
  if (!state.isError) return false;

  if (action === "clear") return false;

  return true;
}

// Check fucntion
function canCompute() {
  return state.operator && state.value_1 !== "" && state.value_2 !== "";
}

// Formatting fucntion
function formatResult(number) {
  if (!Number.isFinite(number)) {
    state.isError = true;
    return "You Broke It.";
  }

  let result = number.toString();

  if (result.includes(".")) {
    result = Number(number.toFixed(10)).toString();
  }

  if (result.length > 11) {
    result = Number(number).toExponential(6);
  }

  return result;
}
