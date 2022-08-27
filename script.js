'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Bala Siva',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Surender E',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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
const containerMovements = document.querySelector('.movements');

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


const displayMovements = function (movements, sort = false) { 
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, index, arr) {
  

    const type = mov > 0 ? "deposit" : "withdrawal";

    const finalHTML = `   <div class="movements__row">
          <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
          <div class="movements__value">${mov}₹</div>
        </div>`;
    
    containerMovements.insertAdjacentHTML("afterbegin", finalHTML);
  });
};
// displayMovements(account1.movements);

const calcDisplayBalance = function (acc) { 
  acc.balance = acc.movements.reduce(function (accumulatorValue, currentValue) { 
    return accumulatorValue + currentValue;
  }, 0);
  labelBalance.textContent = `${acc.balance}₹`
};

// calcDisplayBalance(account4.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}₹`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}₹`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate)/ 100)
    .filter((int, i, arr) => {
      //  console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}₹`;
};

// calcDisplaySummary(account1.movements);


const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner.toLowerCase().split(" ").map(name => name[0]).join("");
    // console.log(account.username);
  });
}

createUsernames(accounts);
// console.log(accounts);

let currentAccount;
btnLogin.addEventListener("click", function (event) {
  event.preventDefault();
  // currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  // console.log(currentAccount);
  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  })
  // console.log(currentAccount.username);

  if (currentAccount.username === inputLoginUsername.value && currentAccount.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(" ")[0]} !`;

    // clearing input values
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // to display movements
    displayMovements(currentAccount.movements);
    // to display balance
    calcDisplayBalance(currentAccount);
    // to display summary 
    calcDisplaySummary(currentAccount);
  }
  else {
    labelWelcome.textContent = `You have entered incorrect Username/PIN!`;
    containerApp.style.opacity = 0;
  }
});
 
btnTransfer.addEventListener("click", function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // to display movements
    displayMovements(currentAccount.movements);
    // to display balance
    calcDisplayBalance(currentAccount);
    // to display summary 
    calcDisplaySummary(currentAccount);
   
  }
 });

 //closing account function

// btnClose.addEventListener("click", function (e) {
//   e.preventDefault();
//   console.log("click");
//   if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value )=== currentAccount.pin) {
//     const index = accounts.findIndex(acc => acc.username === currentAccount.username);
//     console.log(index);
//     accounts.splice(index, 1);
//     containerApp.style.opacity = 0;
//   }
//     inputCloseUsername.value = inputClosePin.value = "";
  
// });
//request loan functionality

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    displayMovements(currentAccount.movements);
    // to display balance
    calcDisplayBalance(currentAccount);
    // to display summary 
    calcDisplaySummary(currentAccount);
  }
  inputLoanAmount.value = '';
});

//close account functionality
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});


// sort event handler

let sorted = false;
btnSort.addEventListener("click", function (e) { 
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// /////////////////////////////////////////////////

// // map method will not mutate the original array

// const movementsUSD = movements.map(function (mov) {
//   return mov * 1.1
// });

// // console.log(movements);
// // console.log(movementsUSD);

// const deposits = movements.filter(function (mov) {
   
//   return mov > 0;
// });

// const withdrawals = movements.filter(function (mov) {
  
//   return mov < 0;
// });

// console.log(movements);
// console.log(deposits);
// console.log(withdrawals);

// //reuce method

// // const balance = movements.reduce(function (accumulatorValue, currentValue, index, currentArray) {
// //   return accumulatorValue + currentValue
// // }, 0);
  
// // console.log(balance);


// function calcAverageHumanAge(ages) {
//   let newDogAge = ages.filter(function (curr) {
//     if (curr <= 2) return 2 * curr;
//     else if (curr > 2) return 16 + curr * 4;
//   });
//   let newDogAge2 = newDogAge.filter(function (curr) {
//     return curr >= 18
//   });
//   let averageHumanAge = newDogAge2.reduce(function (accumulatorValue, currentValue) {
//     return (accumulatorValue + currentValue / newDogAge2.length)
//   },0);
//   return averageHumanAge;
// };

// let ages = [5, 2, 4, 1, 15, 8, 3]
// calcAverageHumanAge(ages);

