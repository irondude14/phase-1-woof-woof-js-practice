document.addEventListener('DOMContentLoaded', () => {
  fetchPups();
  toggleDog();
});

let goodPups = [];
let badPups = [];

//* Function removes all Children from Parent node

function removeDog(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

//* Function that filters dogs based on isGoodDog key

function filterPups(pup) {
  if (pup.isGoodDog === true) {
    goodPups.push(pup);
  } else {
    badPups.push(pup);
  }
}

//* GET request

function fetchPups() {
  fetch(`http://localhost:3000/pups`)
    .then((res) => res.json())
    .then((pups) =>
      pups.forEach((pup) => {
        showPups(pup);
        filterPups(pup);
      })
    );
}

//* PATCH request

function goodDogBadDog(pup) {
  fetch(`http://localhost:3000/pups/${pup.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(pup),
  }).then((res) => res.json());
}

//* Function that renders buttons and dog's info; Changes isGoodDog true/false and PATCHes .json

function showPups(pup) {
  const dogBar = document.getElementById('dog-bar');
  const btn = document.createElement('button');
  const dogInfoDiv = document.querySelector('#dog-info');
  btn.id = 'dog';
  btn.innerHTML = `
        <span>${pup.name}</span>
    `;
  dogBar.append(btn);
  btn.addEventListener('click', () => {
    let dogInfo = document.createElement('div');
    let btnGoodBad = document.createElement('button');
    btnGoodBad.id = 'good-bad';
    btnGoodBad.addEventListener('click', () => {
      if (pup.isGoodDog === true) {
        pup.isGoodDog = false;
        goodDogBadDog(pup);
      } else {
        pup.isGoodDog = true;
        goodDogBadDog(pup);
      }
    });

    if (pup.isGoodDog === true) {
      btnGoodBad.innerText = 'Good Dog!';
    } else {
      btnGoodBad.innerText = 'Bad Dog!';
    }

    dogInfo.innerHTML = `
            <img src='${pup.image}'/>
            <h2>${pup.name}</h2>
        `;
    removeDog(dogInfoDiv);
    dogInfo.append(btnGoodBad);
    dogInfoDiv.append(dogInfo);
  });
}

//* Function that renders only Good or Bad dog's buttons

function toggleDog() {
  const dogBar = document.getElementById('dog-bar');
  const dogFilterBtn = document.querySelector('#good-dog-filter');
  let goodDog = false;
  dogFilterBtn.addEventListener('click', () => {
    removeDog(dogBar);
    goodDog = !goodDog;
    if (goodDog) {
      for (const pup of badPups) {
        dogFilterBtn.innerText = 'Filter good dogs: OFF';
        showPups(pup);
      }
    } else {
      for (const pup of goodPups) {
        dogFilterBtn.innerText = 'Filter good dogs: ON';
        showPups(pup);
      }
    }
  });
}
