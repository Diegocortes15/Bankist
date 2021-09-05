'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Diego Cortes',
    movements: [
        [200, '2020-11-18T21:31:17.178Z'],
        [455.23, '2020-12-23T07:42:02.383Z'],
        [-306.5, '2021-01-28T09:15:04.904Z'],
        [25000, '2021-04-01T10:17:24.185Z'],
        [-642.21, '2021-05-08T14:11:59.604Z'],
        [-133.9, '2021-08-27T17:01:17.194Z'],
        [79.97, '2021-08-29T23:36:17.929Z'],
        [1300, '2021-08-30T10:51:36.790Z'],
    ],
    interestRate: 1.2, // %
    pin: 1111 /*
    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2020-07-11T23:36:17.929Z',
        '2020-07-12T10:51:36.790Z',
    ], */,
    currency: 'COP',
    locale: 'en-US', // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [
        [5000, '2020-11-01T13:15:33.035Z'],
        [3400, '2020-11-30T09:48:16.867Z'],
        [-150, '2020-12-25T06:04:23.907Z'],
        [-790, '2021-01-25T14:18:46.235Z'],
        [-3210, '2021-02-05T16:33:06.386Z'],
        [-1000, '2021-04-10T14:43:26.374Z'],
        [8500, '2021-06-25T18:49:59.371Z'],
        [-30, '2021-07-26T12:01:20.894Z'],
    ],
    interestRate: 1.5,
    pin: 2222,
    /* movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ], */
    currency: 'EUR',
    locale: 'pt-PT',
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [
        [200, '2020-11-18T21:31:17.178Z'],
        [200, '2020-12-23T07:42:02.383Z'],
        [340, '2021-01-28T09:15:04.904Z'],
        [-300, '2021-04-01T10:17:24.185Z'],
        [-20, '2021-05-08T14:11:59.604Z'],
        [50, '2021-08-27T17:01:17.194Z'],
        [400, '2021-08-29T23:36:17.929Z'],
        [-460, '2021-08-30T10:51:36.790Z'],
    ],
    interestRate: 0.7,
    pin: 3333,
    currency: 'COP',
    locale: 'en-US', // de-DE
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [
        [430, '2020-11-01T13:15:33.035Z'],
        [1000, '2020-11-30T09:48:16.867Z'],
        [700, '2020-12-25T06:04:23.907Z'],
        [50, '2021-01-25T14:18:46.235Z'],
        [90, '2021-02-05T16:33:06.386Z'],
    ],
    interestRate: 1,
    pin: 4444,
    currency: 'EUR',
    locale: 'pt-PT',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements__content');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
    const calcDaysPassed = (date1, date2) => Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

    const daysPassed = calcDaysPassed(new Date(), date);

    if (daysPassed < 1) return 'Today';
    if (daysPassed >= 1 && daysPassed < 2) return 'Yesterday';
    if (daysPassed >= 2 && daysPassed <= 7) return `${+daysPassed.toFixed(0)} days ago`;

    // const day = `${date.getDate()}`.padStart(2, '0');
    // const month = `${date.getMonth() + 1}`.padStart(2, '0');
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = function (value, locale, currency) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(value);
};

const displayMovements = function ({ movements, sortMov = false, locale = 'en-US', currency }) {
    containerMovements.innerHTML = '';

    const movs = sortMov ? movements.slice().sort((a, b) => a[0] - b[0]) : movements;

    movs.forEach((mov, i) => {
        const type = mov[0] > 0 ? 'deposit' : 'withdrawal';

        const date = new Date(mov[1]);
        const displayDate = formatMovementDate(date, locale);

        const formattedMov = formatCurrency(mov[0], locale, currency);

        const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${formattedMov}</div>
        </div>`;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

const calcDisplayBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, move) => acc + move[0], 0);
    labelBalance.textContent = formatCurrency(acc.balance, acc.locale, acc.currency);
};

const caclDisplaySummary = function ({ movements, interestRate, locale = 'en-US', currency }) {
    const incomes = movements.filter(mov => mov[0] > 0).reduce((acc, mov) => acc + mov[0], 0);
    labelSumIn.textContent = formatCurrency(incomes, locale, currency);

    const out = movements.filter(mov => mov[0] < 0).reduce((acc, mov) => acc + mov[0], 0);
    labelSumOut.textContent = formatCurrency(out, locale, currency);

    const interest = movements
        .filter(mov => mov[0] > 0)
        .map(deposit => (deposit[0] * interestRate) / 100)
        .filter(interest => interest >= 1)
        .reduce((acc, deposit) => acc + deposit, 0);
    labelSumInterest.textContent = formatCurrency(interest, locale, currency);
};

const createUsernames = function (accs) {
    accs.forEach(acc => {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');
    });
};
createUsernames(accounts);

const intlDate = function () {
    const now = new Date();
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        // weekday: 'long',
    };

    // const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
};

const updateUI = function (acc) {
    // Display movements
    displayMovements(acc);
    // Display balance
    calcDisplayBalance(acc);
    // Display summary
    caclDisplaySummary(acc);
};

const startLogOutTimer = function () {
    // Se time to 5 minutes
    let time = 300;

    const tick = function () {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const second = String(Math.trunc(time % 60)).padStart(2, 0);
        // In each call, print the remaining time to UI
        labelTimer.textContent = `${min}:${second}`;
        // Decrese 1s
        time--;
        // When 0 seconds, stop timer and log out user
        if (time < 0) {
            clearInterval(timer);
            containerApp.style.opacity = 0;
            labelWelcome.textContent = `Log in to get started`;
            cuteAlert({
                type: 'success',
                title: 'Log out',
                message: 'Your account has been disconnected',
                buttonText: 'Okay',
            });
        }
    };

    // Call the timer every second
    tick();
    const timer = setInterval(tick, 1000);
    return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// FAKE ALWAYS LOGGED IN
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 1;

btnLogin.addEventListener('click', function (e) {
    // Prevent form from submiting
    e.preventDefault();

    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

    if (currentAccount?.pin === +inputLoginPin.value) {
        // Display UI and message
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
        containerApp.style.opacity = 1;

        // Display current date
        intlDate();

        // Clear input fields
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginUsername.blur();
        inputLoginPin.blur();

        // Timer
        if (timer) clearInterval(timer);
        timer = startLogOutTimer();

        // Update UI
        updateUI(currentAccount);
    } else {
        cuteAlert({
            type: 'error',
            title: 'Error',
            message: 'User or Password do not match',
            buttonText: 'Okay',
        });
    }
});

btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();

    const amount = +inputTransferAmount.value;
    const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value);

    if (
        amount > 0 &&
        receiverAccount &&
        currentAccount.balance >= amount &&
        receiverAccount?.username !== currentAccount.username
    ) {
        cuteAlert({
            type: 'question',
            title: 'Transfer money',
            message: `Are you sure you want to <b>transfer ${formatCurrency(
                amount,
                currentAccount.locale,
                currentAccount.currency
            )}</b> to <b>${receiverAccount.username}</b>?`,
            confirmText: 'Yes, I sure',
            cancelText: 'No, cancel',
        }).then(e => {
            if (e == 'confirm') {
                {
                    // Doing the transfer
                    currentAccount.movements.push([-amount, new Date().toISOString()]);
                    receiverAccount.movements.push([amount, new Date().toISOString()]);
                    // Update UI
                    updateUI(currentAccount);
                    // Reset Timer
                    clearInterval(timer);
                    timer = startLogOutTimer();

                    cuteAlert({
                        type: 'success',
                        title: 'Transfer money',
                        message: `You transfered <b>${formatCurrency(
                            amount,
                            currentAccount.locale,
                            currentAccount.currency
                        )}</b> to <b>${receiverAccount.username}</b>`,
                        buttonText: 'Okay',
                    });
                }
            } else {
                cuteAlert({
                    type: 'info',
                    title: 'Transfer money',
                    message: 'The money was <b>NOT</b> transferred',
                    buttonText: 'Okay',
                });
            }
        });
    } else {
        cuteAlert({
            type: 'error',
            title: 'Error',
            message: 'Please fill in the blanks correctly',
            buttonText: 'Okay',
        });
    }
    // Clear input fields
    inputTransferTo.value = inputTransferAmount.value = '';
});

btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Math.floor(inputLoanAmount.value);
    if (amount > 0 && currentAccount.movements.some(mov => mov[0] >= amount * 0.1)) {
        cuteAlert({
            type: 'question',
            title: 'Request Loan',
            message: `Are you sure you want to apply for a <b>loan</b> for <b>${formatCurrency(
                amount,
                currentAccount.locale,
                currentAccount.currency
            )}</b>?`,
            confirmText: 'Yes, I sure',
            cancelText: 'No, cancel',
        }).then(e => {
            if (e == 'confirm') {
                cuteAlert({
                    type: 'info',
                    title: 'Request Loan',
                    message: `Your loan request for <b>${formatCurrency(
                        amount,
                        currentAccount.locale,
                        currentAccount.currency
                    )}</b> will be sent for review`,
                    buttonText: 'Okay',
                });
                // Reset Timer
                clearInterval(timer);
                timer = startLogOutTimer();
                setTimeout(function () {
                    // Add loan date
                    currentAccount.movements.push([amount, new Date().toISOString()]);
                    // Update UI
                    updateUI(currentAccount);
                    cuteAlert({
                        type: 'success',
                        title: 'Request Loan',
                        message: `Your <b>${formatCurrency(
                            amount,
                            currentAccount.locale,
                            currentAccount.currency
                        )} loan</b> has been successful`,
                        buttonText: 'Okay',
                    });
                }, 5000);
            } else {
                cuteAlert({
                    type: 'info',
                    title: 'Request Loan',
                    message: 'The loan application was <b>NOT</b> applied',
                    buttonText: 'Okay',
                });
            }
        });
    } else {
        cuteAlert({
            type: 'error',
            title: 'Error',
            message: 'Please fill in the blanks correctly',
            buttonText: 'Okay',
        });
    }
    // Clear input fields
    inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
    e.preventDefault();
    const currentUser = currentAccount.username;

    if (inputCloseUsername.value === currentUser && +inputClosePin.value === currentAccount.pin) {
        cuteAlert({
            type: 'question',
            title: 'Close account',
            message: `Are you sure you want to <b>DELETE ${currentUser} account</b>?`,
            confirmText: 'Yes, I sure',
            cancelText: 'No, cancel',
        }).then(e => {
            if (e == 'confirm') {
                const userIndex = accounts.findIndex(acc => acc.username === currentUser);
                accounts.splice(userIndex, 1);
                labelWelcome.textContent = `Log in to get started`;
                containerApp.style.opacity = 0;
                // Reset Timer
                clearInterval(timer);
                cuteAlert({
                    type: 'success',
                    title: 'Close account',
                    message: `<b>${currentUser}</b> account has been <b>deleted</b>`,
                    buttonText: 'Okay',
                });
            } else {
                cuteAlert({
                    type: 'info',
                    title: 'Account',
                    message: `The <b>${currentUser}</b> account has <b>NOT</b> been deleted`,
                    buttonText: 'Okay',
                });
            }
        });
    } else {
        cuteAlert({
            type: 'error',
            title: 'Error',
            message: 'User or Password do not match',
            buttonText: 'Okay',
        });
    }

    // Clear input fields
    inputCloseUsername.blur();
    inputClosePin.blur();
    inputCloseUsername.value = inputClosePin.value = '';
});

btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    currentAccount.sortMov = currentAccount.sortMov === true ? false : true;
    displayMovements(currentAccount);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/* // CodingChallenge #1

const checkDogs = function (...args) {
    const juliaCopy = [...args[0]].slice(1, 3);
    const dogsAge = [...juliaCopy, ...args[1]];

    dogsAge.forEach((age, index) => {
        const checkAge =
            age >= 3 ? `is an adult, 🐕 and is ${age} years old` : 'is still a puppy 🐶';
        console.log(`Dog number ${index + 1} ${checkAge}, `);
    });
    console.log(dogsAge);
};
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]); */

const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
]);
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/* let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE METHOD
console.log(arr.slice(2));
console.log(arr.slice(1, 3));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -1));
console.log(arr.slice(0));
console.log([...arr]);
console.log('//////////////////////////');
// SPLICE
// arr.splice(-1);
console.log(arr.splice(1, 3));
console.log(arr);

// REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr.reverse());
console.log(arr2.reverse());
console.log(arr2);

// CONCAT
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// JOIN
console.log(letters.join(' - '));
console.log(letters); */

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/* for (const movement of movements) {
    if (movement > 0) {
        console.log(`You deposited ${movements}`);
    } else {
        console.log(`You withdrew ${movements}`);
    }
} */

/* for (const [key, value] of movements.entries()) {
    console.log(`${key} => ${value}`);
} */

/* console.log('=======================================');
// movements.forEach(movement => console.log(movement));
movements.forEach((element, index, array) => {
    if (element > 0) {
        console.log(`Movement ${index} => You deposited ${element}`);
    } else {
        console.log(`Movement ${index} => You withdrew ${element}`);
    }
    // console.log(array);
}); */

/* const newMovements = [...movements.entries()];
console.log(newMovements);

newMovements.forEach(([key, value]) => {
    console.log(`${key} => ${value}`);
}); */
/* console.log('=======================================');

// MAP
const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
]);

currencies.forEach((currency, index) => {
    console.log(`${index} => ${currency}`);
});

// SET
const currenciesUnique = new Set(['USD', 'USD', 'GBP', 'EUR', 'EUR', 'EUR']);

console.log(currenciesUnique);

currenciesUnique.forEach((currency, index) => {
    console.log(`${index} => ${currency}`);
}); */

/* const euroToUsd = 1.1;

const movementsUSD = movements.map(movement => Math.trunc(movement * euroToUsd));

console.log(movements);
console.log(movementsUSD);

const movementsDescriptions = movements.map((movement, i, array) => {
    return `Movement ${i + 1} => You ${movement > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
        movement
    )}`;
});

console.log(movementsDescriptions); */

/* const deposits = movements.filter(movement => movement > 0);
const withdrawal = movements.filter(movement => movement < 0);
console.log(deposits, withdrawal); */

/* console.log(movements);

// accumulator -> SNOWBALL
const balance = movements.reduce((acc, curr, i, arr) => {
    const sum = acc + curr;
    console.log(`Iteration Number ${i + 1}: ${sum}`);
    return sum;
}, 0);
console.log(balance);

// Maximum number

const maxValue = movements.reduce((acc, curr) => {
    return acc > curr ? acc : curr;
}, movements[0]);

console.log(maxValue); */

/* const calcAverageHumanAge = function (ages) {
    const humanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
    const adults = humanAge.filter(age => age > 18);
    const averageAge = adults.reduce((acc, curr, _, { length }) => acc + curr / length, 0);

    console.log(humanAge);
    console.log(adults);

    return averageAge;
};

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2); */

/* const eurToUsd = 1.1;

// PIPELINE
const totalDepositsUSD = movements
    .filter(mov => mov > 0)
    .map(mov => mov * eurToUsd)
    .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositsUSD); */

/* const calcAverageHumanAge = function (ages) {
    return ages
        .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
        .filter(age => age > 18)
        .reduce((acc, curr, _, { length }) => acc + curr / length, 0);
};

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2); */

/* console.log(movements);

const firstWithDrawal = movements.find(mov => mov < 0);
console.log(firstWithDrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

let accountFinded;
for (const account of accounts) {
    if (account.owner === 'Jessica Davis') {
        accountFinded = account;
        break;
    }
}
console.log(accountFinded);
 */

/* console.log(movements);

// EQUALITY
console.log(movements.includes(-130));

// CONTIDION
console.log(movements.some(movement => movement === -130));

const anyDeposits = movements.some(movement => movement > 0);
console.log(anyDeposits);

// EVERY
console.log(account1.movements.every(movement => movement > 0));
 */

/* const arr = [[1, 2, 3], [4, 5, 6], 7, 8].flat();
console.log(arr);

const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());

console.log(movements);

const number = [1, 2];
console.log(movements);

// movements.sort((a, b) => {
//     if (a > b) return 1;
//     if (a < b) return -1;
// });

console.log(movements);

const quickSort = function (arr, order) {
    if (arr.length < 1) return [];

    let leftArr = [];
    let rightArr = [];
    const pivot = arr[0];

    for (let i = 1; i < arr.length; i++) {
        if (order === 'up' ? arr[i] > pivot : arr[i] < pivot) {
            leftArr.push(arr[i]);
        } else {
            rightArr.push(arr[i]);
        }
    }

    return [].concat(quickSort(leftArr, order), pivot, quickSort(rightArr, order));
};
quickSort(movements);
console.log(movements.slice()); */

/* console.log([1, 2, 3, 4, 5, 6, 7].map(() => 5));
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7);

console.log(x);

// Array.from

const y = Array.from({ lenght: 7 }, () => 1);

const z = Array.from({ length: 7 }, (_, i) => i + 1);

console.log(z);

const randomDiceRoll = Array.from({ length: 100 }, () => Math.floor(Math.random() * 6) + 1);

console.log(randomDiceRoll);

labelBalance.addEventListener('click', function () {
    const movementsUI = Array.from(document.querySelectorAll('.movements__value'), el =>
        Number(el.textContent.replace('€', ''))
    );

    console.log(movementsUI);
}); */

///////////////////////
// Array Methods Practice

/* // 1.
const backDepositSum = accounts
    .flatMap(account => account.movements)
    .filter(movement => movement > 0)
    .reduce((sum, movement) => sum + movement, 0);
console.log(backDepositSum);

// 2.

console.log(accounts.flatMap(account => account.movements).filter(movement => movement >= 1000));

// const numDeposits1000 = accounts
//     .flatMap(account => account.movements)
//     .filter(movement => movement >= 1000).length;

// const numDeposits1000 = accounts
//     .flatMap(account => account.movements)
//     .filter(movement => movement >= 1000)
//     .reduce((_, __, index) => index + 1, 0);

const numDeposits1000 = accounts
    .flatMap(account => account.movements)
    .reduce((acc, movement) => (movement >= 1000 ? ++acc : acc), 0);

console.log(numDeposits1000);

// 3.

const { deposits, withdrawals } = accounts
    .flatMap(account => account.movements)
    .reduce(
        (sums, curr) => {
            // curr > 0 ? (sums.deposits += curr) : (sums.withdrawals += curr);
            sums[curr > 0 ? 'deposits' : 'withdrawals'] += curr;
            return sums;
        },
        { deposits: 0, withdrawals: 0 }
    );

console.log(deposits, withdrawals);

// 4.
// this is a nice title -> This Is a Nice title
const convertTitleCase = function (title) {
    const capitalize = str => str[0].toUpperCase() + str.slice(1);

    const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];

    const titleCase = title
        .toLowerCase()
        .split(' ')
        .map(word => (exceptions.includes(word) ? word : capitalize(word)))
        .join(' ');
    return titleCase;
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('aNd HeRE is AnOtHer tItLe wItH aN ExAmPlE'));
 */

/* //Challenge 4
const dogs = [
    { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
    { weight: 8, curFood: 200, owners: ['Matilda'] },
    { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
    { weight: 32, curFood: 340, owners: ['Michael'] },
];

const recommendFood = dogs.forEach(
    dog => (dog.recommendedFood = Number((dog.weight ** 0.75 * 28).toFixed(2)))
);

const sarahsDog = dogs.find(dog => dog.owners.find(owner => owner === 'Sarah'));
// console.log(sarahsDog);
console.log(
    `Her dog is eating ${
        sarahsDog.curFood > sarahsDog.recommendedFood * 0.9 &&
        sarahsDog.curFood < sarahsDog.recommendedFood * 1.1
            ? 'okay'
            : sarahsDog.curFood < sarahsDog.recommendedFood * 0.9
            ? 'too litte'
            : 'too much'
    }`
);

const ownersEatTooMuch = dogs
    .filter(dog => dog.curFood > dog.recommendedFood)
    .flatMap(owner => owner.owners);

const ownersEatTooLittle = dogs
    .filter(dog => dog.curFood < dog.recommendedFood)
    .flatMap(owner => owner.owners);

// console.log(ownersEatTooMuch);
// console.log(ownersEatTooLittle);

console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat so little`);

console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat so much`);

dogs.forEach(dog => console.log(dog.curFood === dog.recommendedFood));

dogs.forEach(dog =>
    console.log(dog.curFood > dog.recommendedFood * 0.9 && dog.curFood < dog.recommendedFood * 1.1)
);

console.log(
    dogs.filter(
        dog => dog.curFood > dog.recommendedFood * 0.9 && dog.curFood < dog.recommendedFood * 1.1
    )
);

console.log(dogs.slice().sort((a, b) => a.recommendedFood - b.recommendedFood));

console.log(dogs);
 */

/*
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(typeof 14222222222222222222222222223333333333333333333n); */

// Create Dates
// const now = new Date();
// console.log(new Date());

// console.log(new Date('Tue Aug 24 2021 01:14:35'));

// console.log(new Date('December 24, 2015'));

// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037, 10, 19, 15, 23, 5));
// // Year, month, day, hour, minute, second

// console.log(new Date(0));

// console.log(new Date(3 * 24 * 60 * 60 * 1000));
// console.log(BigInt(3 * 24 * 60 * 60 * 1000));

/* // Working with dates

const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());

const now = new Date().toISOString();
console.log(now);

const newNow = new Date(now);
console.log(newNow);
console.log(new Date()); */

/* const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(+future);

const calcDaysPassed = (date1, date2) => Math.abs((date2 - date1) / (1000 * 60 * 60 * 24));

const days1 = calcDaysPassed(new Date(2037, 3, 24), new Date(2037, 3, 14));

console.log(days1); */

/* const num = 3884764.23;

const options = {
    style: 'currency',
    currency: 'EUR',
    useGrouping: false,
};

console.log('US: ', new Intl.NumberFormat('en-US', options).format(num)); */

/* const ingredients = ['olives', ''];
const pizzaTimer = setTimeout(
    (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
    2000,
    ...ingredients
);
if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

console.log('Waiting...'); */

/* setInterval(function () {
    const now = new Date();
    console.log(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
}, 1000); */
