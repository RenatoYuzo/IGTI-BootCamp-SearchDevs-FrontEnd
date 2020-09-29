let devs = [];
let devsSearch = [];
let inputSearchByName = null;
let inputJava = null;
let inputJS = null;
let inputPY = null;
let inputE = null;
let inputOU = null;
let searchHTML = null;
let searchCount = null;

window.addEventListener('load', start);

function start() {
  searchHTML = document.querySelector('#searchHTML');
  searchCount = document.querySelector('#searchCount');
  inputSearchByName = document.querySelector('#inputSearch');
  inputJava = document.querySelector('#inputJava');
  inputJS = document.querySelector('#inputJS');
  inputPY = document.querySelector('#inputPY');
  inputE = document.querySelector('#inputE');
  inputOU = document.querySelector('#inputOU');

  inputSearchByName.addEventListener('change', fetchDevs);
  inputJava.addEventListener('change', fetchDevs);
  inputJS.addEventListener('change', fetchDevs);
  inputPY.addEventListener('change', fetchDevs);
  inputE.addEventListener('change', fetchDevs);
  inputOU.addEventListener('change', fetchDevs);

  fetchDevs();
}

async function fetchDevs() {
  const res = await fetch('http://localhost:3001/devs');
  const json = await res.json();

  devs = json.map((dev) => {
    const { id, name, email, age, picture, programmingLanguages } = dev;
    // console.log(programmingLanguages);

    return {
      id,
      name,
      email,
      age,
      picture,
      programmingLanguages,
    };
  });

  renderSearch();
}

function renderSearch() {
  //   console.log(inputSearchByName.value);
  //   console.log(inputJava.checked);

  devsSearch = devs.filter((dev) => {
    const { name, programmingLanguages } = dev;

    const newName = name
      .replaceAll(' ', '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const nameToSearch = inputSearchByName.value
      .replaceAll(' ', '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    let nameBoolean = newName.includes(nameToSearch);

    if (inputSearchByName.value === '') nameBoolean = true;

    let java = programmingLanguages.some((l) => l.language === 'Java');
    let js = programmingLanguages.some((l) => l.language === 'JavaScript');
    let python = programmingLanguages.some((l) => l.language === 'Python');

    let booleanLanguage = false;
    if (inputE.checked) {
      if (inputJava.checked && inputJS.checked && inputPY.checked)
        booleanLanguage = java && js && python;
      else if (!inputJava.checked && inputJS.checked && inputPY.checked)
        booleanLanguage = js && python;
      else if (inputJava.checked && !inputJS.checked && inputPY.checked)
        booleanLanguage = java && python;
      else if (inputJava.checked && inputJS.checked && !inputPY.checked)
        booleanLanguage = java && js;
      else if (!inputJava.checked && !inputJS.checked && inputPY.checked)
        booleanLanguage = python;
      else if (!inputJava.checked && inputJS.checked && !inputPY.checked)
        booleanLanguage = js;
      else if (inputJava.checked && !inputJS.checked && !inputPY.checked)
        booleanLanguage = java;
      else if (!inputJava.checked && !inputJS.checked && !inputPY.checked)
        booleanLanguage = false;
    } else if (inputOU.checked)
      booleanLanguage =
        (inputJava.checked && java) ||
        (inputJS.checked && js) ||
        (inputPY.checked && python);

    return nameBoolean && booleanLanguage;
    // return nameBoolean;
  });

  searchCount.innerHTML = `
    <h3>${devsSearch.length} dev(s) encontrado(s)</h3>
  `;

  let returnHTML = '';
  devsSearch.forEach((dev) => {
    const { name, picture, programmingLanguages } = dev;

    let htmlLanguages = '';
    programmingLanguages.forEach((l) => {
      htmlLanguages += `
      <p>
        <img src="./img/${l.language}.png" class="circle" width="30" height="30">
        <span class="black-text center">${l.language} </span>
      </p>`;
    });

    const html = `
            <div class="col xl3 l3 m4 s6">
                <div class="card grey lighten-3 z-depth-1 row">
                    <div class="card-content black-text">
                        <span class="card-title">${name}</span>
                        <div class="col s3">
                            <img src="${picture}" alt="" class="circle responsive-img"> 
                        </div>
                        <div class="col s9">
                            ${htmlLanguages}
                        </div>
                    </div>
                </div>
            </div>
        `;
    returnHTML += html;
  });

  searchHTML.innerHTML = returnHTML;
}
