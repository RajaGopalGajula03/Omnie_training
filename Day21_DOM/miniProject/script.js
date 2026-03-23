function getRandomColor(){
    const letters = '0123456789abcdef';
    let color = '#';

    for(let i = 0; i < 6; i++){
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const yaer = document.getElementById("year");

setInterval(()=>{
    yaer.style.color = getRandomColor();
},1000);

const dateTime = document.getElementById("date-time");

function updateTime(){
    const now = new Date();

    dateTime.textContent = now.toLocaleString();
    dateTime.style.background = getRandomColor();
    dateTime.style.padding = '10px';
    // dateTime.style.display = 'inline-block';
    dateTime.style.textAlign = 'center';
}

setInterval(updateTime,1000);

const listItems = document.querySelectorAll("li");

listItems.forEach(li =>{
    const text = li.textContent;

    if(text.includes("Done"))
    {
        li.style.background = 'green';
    }
    else if(text.includes("Ongoing"))
    {
        li.style.background = 'yellow';
    }
    else
    {
        li.style.background = 'red';
    }

    li.style.padding = '10px';
    li.style.margin = '5px';
    li.style.listStyle = 'none';
})