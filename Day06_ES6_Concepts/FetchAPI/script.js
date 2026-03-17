const tbody = document.getElementById("tbody");

const fetchUsers = () =>{
    fetch("https://jsonplaceholder.typicode.com/users")
    .then(res => res.json())
    .then(data => displayUser(data));
}

fetchUsers();

const displayUser = (data)=>{
    tbody.innerHTML = "";

    data.forEach(user=>{
        const tr = document.createElement("tr");

        const td1 = document.createElement("td");
        td1.innerText = user.id;

        const td2 = document.createElement("td");
        td2.innerText = user.name;

        const td3 = document.createElement("td");
        td3.innerText = user.username;

        const td4 = document.createElement("td");
        td4.innerText = user.address.city;

        tr.append(td1,td2,td3,td4);
        tbody.appendChild(tr);
    })
}