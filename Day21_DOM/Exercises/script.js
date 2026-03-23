let firstPara = document.querySelector("p");
console.log(firstPara);

let p1 = document.querySelector("#p1");
let p2 = document.querySelector("#p2");
let p3 = document.querySelector("#p3");
let p4 = document.querySelector("#p4");

console.log(p1,p2,p3,p4);

let allParas = document.querySelectorAll("p");
console.log(allParas);

allParas.forEach(p =>{
    console.log(p.innerText);
})

p4.textContent = "This is Fourth Paragraph";
console.log(p4)

p1.id = 'first';
p1.className = "para";

p2.id = 'second';
p2.className = 'para';

p3.setAttribute('id','third');
p3.setAttribute('class','para');

p4.setAttribute('id','fourth');
p4.setAttribute('class','para');

allParas.forEach(p=>{
    p.style.fontSize = '18px';
    p.style.fontFamily = 'Sans-Serif';
    p.style.color = "yellow";
    p.style.border = '1px solid black';
})

allParas.forEach((p,index) =>{
    if(index === 0 || index === 2)
    {
        p.style.color = 'green';
    }
    else
    {
        p.style.color = 'red';
    }
})


allParas.forEach((p,index)=>{
    p.textContent = `Paragraph ${index + 1}`;
    p.id = `para${index + 1}`;
    p.className = 'paragraphs';
    console.log(p);
})