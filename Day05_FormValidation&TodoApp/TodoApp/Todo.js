const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

addBtn.addEventListener('click',()=>{
    const taskText = taskInput.value;

    if(taskText.trim() === "")
    {
        alert("Please Enter a Task");
        return;
    }

    const li = document.createElement("li");

    li.innerText = taskText;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";

    deleteBtn.onclick = () =>{
        li.remove();
    };

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
    taskInput.value = "";
})