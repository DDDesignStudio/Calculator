let displayValue = '';
let firstNumber = null;
let secondNumber = null;
let currentOperator = null;
let waitingForSecondNumber = false;

const display = document.getElementById('display');

function updateDisplay() {
    display.value = displayValue || '0';
}

function clear() {
    displayValue = '';
    firstNumber = null;
    secondNumber = null;
    currentOperator = null;
    waitingForSecondNumber = false;
    updateDisplay();
}

function handleNumber(number) {
    if (waitingForSecondNumber) {
        displayValue = number;
        waitingForSecondNumber = false;
    } else {
        displayValue = displayValue === '' ? number : displayValue + number;
    }
    updateDisplay();
}

function handleOperator(operator) {
    if (!waitingForSecondNumber) {
        if (firstNumber === null && displayValue !== '') {
            firstNumber = parseFloat(displayValue);
        } else if (currentOperator) {
            const result = operate(firstNumber, parseFloat(displayValue), currentOperator);
            displayValue = `${parseFloat(result.toFixed(10))}`; // round off to prevent overflow
            firstNumber = result;
        }
    }
    currentOperator = operator;
    waitingForSecondNumber = true;
    updateDisplay();
}

function operate(number1, number2, operator) {
    if (operator === '+') return number1 + number2;
    if (operator === '-') return number1 - number2;
    if (operator === '*') return number1 * number2;
    if (operator === '/') {
        if (number2 === 0) {
            alert("Error: Division by zero");
            return number1;
        } else {
            return number1 / number2;
        }
    }
    return number2;
}

function handleEqual() {
    if (currentOperator && !waitingForSecondNumber) {
        secondNumber = parseFloat(displayValue);
        const result = operate(firstNumber, secondNumber, currentOperator);
        displayValue = `${parseFloat(result.toFixed(10))}`; // round off to prevent overflow
        firstNumber = result;
        secondNumber = null;
        currentOperator = null;
        updateDisplay();
    }
}

function handleDecimal() {
    if (!displayValue.includes('.')) {
        displayValue += '.';
        updateDisplay();
    }
}

function handleBackspace() {
    displayValue = displayValue.slice(0, -1);
    updateDisplay();
}

document.querySelectorAll('.number').forEach(button => {
    button.addEventListener('click', () => handleNumber(button.textContent));
});

document.querySelectorAll('.operand').forEach(button => {
    button.addEventListener('click', () => handleOperator(button.textContent));
});

document.getElementById('equal').addEventListener('click', handleEqual);
document.getElementById('clear').addEventListener('click', clear);
document.getElementById('decimal').addEventListener('click', handleDecimal);
document.getElementById('backspace').addEventListener('click', handleBackspace);

document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') {
        handleNumber(event.key);
    } else if (['+', '-', '*', '/'].includes(event.key)) {
        handleOperator(event.key);
    } else if (event.key === 'Enter') {
        handleEqual();
    } else if (event.key === 'Escape') {
        clear();
    } else if (event.key === '.') {
        handleDecimal();
    } else if (event.key === 'Backspace') {
        handleBackspace();
    }
});