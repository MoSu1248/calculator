// GLOBAL SCOPE
let value_1 = "";
let value_2 = "";
let operater = null;

const btnsContainer = document.querySelector(".calculator__btns");
const display = document.querySelector(".calculator__display");

btnsContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".calculator__btn");
  if (!btn) return;

  handleInput(btn.dataset.action, btn.dataset.value);
});

function handleInput(action, value) {
  if (action === "number") {
    if (!operater) {
      value_1 += value;
      display.value = value_1;
    } else {
      value_2 += value;
      display.value = value_2;
    }
  }

  if (action === "operator") {
    if (value_1 !== "" && operater && value_2 !== "") {
      const result = operate(operater, value_1, value_2);

      value_1 = result.toString();
      value_2 = "";

      display.value = value_1;
    }

    operater = value;
    display.value = value_1;
  }

  if (action === "equals") {
    if (!operater || value_1 === "" || value_2 === "") return;

    const result = operate(operater, value_1, value_2);

    display.value = result;

    value_1 = result.toString();
    value_2 = "";
    operater = null;
  }

  if (action === "clear") {
    clear();
  }

  if (action === "backspace") {
    backspace();
  }
}

// Math Operations
const add = (a, b) => a + b;

const subtract = (a, b) => a - b;

const multiply = (a, b) => a * b;

const divide = (a, b) => {
  if (b === 0) return "Error";
  return a / b;
};

const operate = (operator, num1, num2) => {
  const a = parseFloat(num1);
  const b = parseFloat(num2);

  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
    default:
      return null;
  }
};

// Clear Function
const clear = () => {
  value_1 = "";
  value_2 = "";
  operater = null;
  display.value = "0";
};

// Backspace Function
const backspace = () => {
  if (!operater) {
    value_1 = value_1.slice(0, -1);
    display.value = value_1 || "0";
  } else {
    value_2 = value_2.slice(0, -1);
    display.value = value_2 || "0";
  }
};

// Keyboard functionality
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (!isNaN(key)) {
    handleInput("number", key);
  }

  if (["+", "-", "*", "/"].includes(key)) {
    handleInput("operator", key);
  }

  if (key === "Enter" || key === "=") {
    handleInput("equals", "=");
  }

  if (key === "Backspace") {
    handleInput("backspace");
  }

  if (key === "Escape") {
    handleInput("clear");
  }
});
