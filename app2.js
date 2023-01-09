let body = document.querySelector("body");
let todos = document.querySelector(".todos");
let wrapperPage = document.querySelector(".wrapperPage");
let data = [];
let isLoaded = false;
let currPage = 1;
let p = 20;

let getData = async () => {
  try {
    let response = await fetch("https://jsonplaceholder.typicode.com/todos");
    isLoaded = true;
    return await response.json();
  } catch (error) {
    alert("error with getting server data");
  }
};

function displayData(currPage, data, p) {
  let pageNum = data.length / p;
  console.log(pageNum);
  for (let i = 0; i < pageNum; i++) {
    let button = document.createElement("button");
    button.classList.add("page");
    button.innerHTML += i + 1;
    console.log(button);
    wrapperPage.appendChild(button);

    button.addEventListener("click", (e) => {
      const activePage = e.target.innerText;
      console.log(activePage);
      currPage = activePage;
      todos.innerHTML = "";
      wrapperPage.childNodes[activePage - 1].classList.add("active");
      wrapperPage.innerHTML = "";

      displayData(currPage, data, p);
    });
  }
  wrapperPage.childNodes[currPage - 1].classList.add("active");

  let end = currPage * p;
  let contentArr = data.slice(end - p, end);
  contentArr.forEach((el) => {
    let containerEl = document.createElement("div");
    containerEl.classList.add("containerEl");
    containerEl.setAttribute("id", el.id);
    todos.appendChild(containerEl);
    let elem = document.createElement("div");
    elem.classList.add("elem");
    containerEl.appendChild(elem);
    let del = document.createElement("button");
    del.classList.add("delete");
    del.innerText = "Delete";
    containerEl.appendChild(del);
    del.addEventListener("click", deleteFunc);
    let change = document.createElement("button");
    change.classList.add("change");
    change.innerText = "Change";
    containerEl.appendChild(change);
    change.addEventListener("click", changeFunc);
    // elem.innerHTML += `userId: ${el.userId}, id: ${el.id}, title: ${el.title}, completed: ${el.completed} `;
    elem.innerHTML += `<h3>${el.title}</h3> <input type="checkbox" ${
      el.completed ? "checked" : ""
    } disabled/>`;
  });
}

async function start() {
  try {
    data = await getData();
    displayData(currPage, data, p);
  } catch (error) {
    console.log("Error in start" + error);
  }
}
start();

itemsPerPage = document.querySelector(".itemsPerPage");
itemsPerPage.addEventListener("change", (event) => {
  todos.innerHTML = "";
  wrapperPage.innerHTML = "";
  p = event.target.value;
  console.log(p);
  displayData(currPage, data, p);
});

async function askToDel(id) {
  try {
    let response1 = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      {
        method: "DELETE",
      }
    );
    let delRes = await response1.json();
    console.log(delRes);
    return delRes;
  } catch (error) {
    console.log("error in askToDel " + error);
  }
}

async function deleteFunc() {
  try {
    let delEl = this.parentElement;
    console.log(delEl);
    let delElId = delEl.getAttribute("id");
    console.log(delElId);
    await askToDel(delElId);
    delEl.remove();
  } catch (error) {
    console.log(error);
  }
}

function changeFunc() {
  let changeEl = this.parentElement.childNodes[0].childNodes[0];
  let changeElObj = this.parentElement.childNodes[0];
  console.log(changeElObj);
  let changeElId = this.parentElement.getAttribute("id");
  // console.log(changeElId);
  let inp = document.createElement("input");
  inp.classList.add("inp");
  const ok = document.createElement("button");
  ok.classList.add("ok");
  ok.innerHTML = "ok";
  // console.log(changeEl);
  inp.value = changeEl.innerText;
  this.parentElement.appendChild(inp);
  this.parentElement.appendChild(ok);
  const inpEl = this.parentElement.querySelector("input");
  inpEl.removeAttribute("disabled");
  ok.addEventListener("click", () =>
    newRes(inp, ok, changeEl, changeElId, inpEl)
  );
  changeEl.style.display = "none";
}

async function newRes(inp, ok, changeEl, changeElId, inpEl) {
  try {
    let InfoInpEl = inpEl.checked;
    console.log(InfoInpEl);
    let response2 = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${changeElId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          title: inp.value,
          completed: InfoInpEl,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    let changeRes = await response2.json();
    console.log(changeRes);
    changeEl.innerText = inp.value;
    console.log(changeEl);
    inp.remove();
    ok.remove();
    changeEl.style.display = "inline-block";
    inpEl.setAttribute("disabled", "disabled");
  } catch (err) {
    console.log("Err" + err);
  }
}
