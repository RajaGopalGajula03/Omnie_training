let count = 0;

function increase() {
    count++;
    document.getElementById("count").innerText = count;
}
function decrease() {
    if (count <= 0) {
        alert("Can not decrease count value below zero");
    }
    else {
        count--;
        document.getElementById("count").innerText = count;
    }
}

function reset() {
    count = 0;
    document.getElementById("count").innerText = count;
}

function increaseMultiple(){
    for(let i=1; i<=5 ; i++)
    {
        count++;
    }
    document.getElementById("count").innerText = count;
}