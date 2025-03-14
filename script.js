const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');
const historyList = document.getElementById('history-list');
const historySection = document.getElementById('history');
const clearHistoryButton = document.getElementById('clear-history');

let currentOperation = '';
let history = [];

// Load history from localStorage
function loadHistory() {
  const savedHistory = localStorage.getItem('calculatorHistory');
  if (savedHistory) {
    history = JSON.parse(savedHistory);
    updateHistory();
  }
}

// Save history to localStorage
function saveHistory() {
  localStorage.setItem('calculatorHistory', JSON.stringify(history));
}

// Clear history
function clearHistory() {
  history = [];
  localStorage.removeItem('calculatorHistory');
  updateHistory();
}

// Update history UI
function updateHistory() {
  historyList.innerHTML = '';
  history.forEach((entry, index) => {
    const li = document.createElement('li');
    li.textContent = entry;
    historyList.appendChild(li);
  });
}

// Handle button clicks
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.getAttribute('data-value');
    if (value === 'H') {
      // Toggle history with animation
      historySection.classList.toggle('active');
    } else {
      handleInput(value);
    }
  });
});

// Handle physical keyboard input
document.addEventListener('keydown', (e) => {
  const key = e.key;
  if (key === 'Backspace') {
    handleInput('C');
  } else if (key === 'Enter' || key === '=') {
    handleInput('=');
  } else if (/[0-9+\-*/%.^()ij]/.test(key)) {
    handleInput(key);
  } else if (key === 's' || key === 'S') {
    handleInput('√');
  } else if (key === 'l' || key === 'L') {
    handleInput('log');
  } else if (key === 'n' || key === 'N') {
    handleInput('ln');
  } else if (key === 't' || key === 'T') {
    handleInput('tan');
  }
});

// Handle input
function handleInput(value) {
  if (value === 'C') {
    // Clear the calculator
    currentOperation = '';
    display.value = '';
  } else if (value === '=') {
    // Evaluate the operation
    try {
      let expression = currentOperation
        .replace(/√(\d+)/g, 'Math.sqrt($1)') // √x → Math.sqrt(x)
        .replace(/(\d+)\^(\d+)/g, 'Math.pow($1, $2)') // x^y → Math.pow(x, y)
        .replace(/(\d+)%/g, '($1/100)') // x% → (x/100)
        .replace(/log\((\d+)\)/g, 'Math.log10($1)') // log(x) → Math.log10(x)
        .replace(/ln\((\d+)\)/g, 'Math.log($1)') // ln(x) → Math.log(x)
        .replace(/sin\((\d+)\)/g, 'Math.sin($1)') // sin(x) → Math.sin(x)
        .replace(/cos\((\d+)\)/g, 'Math.cos($1)') // cos(x) → Math.cos(x)
        .replace(/tan\((\d+)\)/g, 'Math.tan($1)'); // tan(x) → Math.tan(x)

      // Handle complex numbers (e.g., 3 + 2i)
      if (expression.includes('i')) {
        expression = expression.replace(/i/g, '*Math.sqrt(-1)');
      }

      const result = eval(expression);
      if (isNaN(result) || !isFinite(result)) {
        throw new Error('Invalid Input');
      }
      display.value = result;
      currentOperation = result.toString();

      // Add to history
      history.push(`${currentOperation} = ${result}`);
      if (history.length > 10) history.shift(); // Keep only the last 10 entries
      updateHistory();
      saveHistory();
    } catch (error) {
      display.value = error.message === 'Invalid Input' ? 'Invalid Input' : 'Error';
      currentOperation = '';
    }
  } else {
    // Append the value to the current operation
    currentOperation += value;
    display.value = currentOperation;
  }
}

// Clear history button
clearHistoryButton.addEventListener('click', clearHistory);

// Load history when the page loads
loadHistory();