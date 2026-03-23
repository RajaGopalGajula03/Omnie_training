const countriesAPI = 'https://restcountries.com/v3.1/all';
const catsAPI = 'https://api.thecatapi.com/v1/breeds';

// fetch(countriesAPI)
// .then(res => res.json())
// .then(data => {
//     console.log(data)
//     data.forEach(country =>{
//         console.log(
//             country.name,
//             country.capital,
//             country.languages.map(l => l.name),
//             country.population,
//             country.area
//         )
//     })
// })
// .catch(err => console.log(err));

fetch(catsAPI)
.then(res => res.json())
.then(data => {
    let catNames = data.map(cat => cat.name);
    console.log(catNames);
})

fetch(catsAPI)
.then(res => res.json())
.then(data => {
    let total = 0;
    let count = 0;

    data.forEach(cat =>{
        if(cat.weight.metric){
            let [min,max] = cat.weight.metric.split(" - ").map(Number);
            let avg = (min + max) / 2;

            total +=avg;
            count++;
        }
    })
    console.log("Average Weight:",(total/count).toFixed(2));
});