const weather = document.querySelector(".weather-report");
const news = document.querySelector(".news-articles");
const img = document.querySelectorAll("img");
const spr = document.querySelectorAll(".swiper-slide")
const fullNews = document.querySelector(".related-news");
async function getweather(){
    let data = await fetch("https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=1fdea15c7ada2cd5b2e2602e13c30ba5",{
        method:"GET"
    }).then((res)=>res.json()).then((json)=>{return json});
    console.log(data);

    let temp = document.createElement("h2")
    let city = document.createElement("h2");
    let wtr = document.createElement("h2");
    let icon = document.createElement("img")

    // Convert temperature from Kelvin to Celsius
    let celsius = (data.main.temp - 273.15).toFixed(2); // Rounding to 2 decimal places

    wtr.innerText = data.weather[0].description;
    city.innerText = data.name;
    temp.innerText = `${celsius} °C`; // Display temperature in Celsius
    weather.appendChild(temp);
    weather.appendChild(city);
    weather.appendChild(wtr);
}
// async function getNews(){
//     let data =await  fetch("http://127.0.0.1:3000/getNews",{
//         method:"GET"
//     }).then((res)=>
//         res.json()
//     ).then((json)=>json);
    
//     const articles = news.querySelectorAll('article');
//     console.log(data);
//     fullNews.querySelector('p').innerHTML=data[0].Discription;
//     console.log(articles);
//     console.log(img);
//     console.log(spr);
// // Loop through each article and do something
//         for (let i = 0; i < articles.length; i++) {

//             const ankor = spr[i].querySelector("a");
//             ankor.href = data[i].url;
//       const article = articles[i];
//     // Access elements within each article
//              const a = article.querySelector('a');
//              a.href = data[i].url;
//              const title = a.querySelector('h3');
             

//             img[i].src=data[i].urlToImage;
//             console.log(title);
//             title.innerText = data[i].title;
            
      
// }
//     console.log(data);
// }
async function fetchNews() {
    const apiKey = "8c93bd23b2b84816b9cd268dc68493e0"; // Replace with your News API key
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const articles = data.articles.slice(0, 3); // Limit to the first 3 articles

        const newsContainer = document.querySelector(".news-articles");

        articles.forEach((article) => {
            const articleLink = document.createElement("a");
            articleLink.href = article.url;
            articleLink.target = "_blank"; // Open link in new tab
            const articleTitle = document.createElement("h3");
            articleTitle.textContent = article.title;
            articleLink.appendChild(articleTitle);

            const articleItem = document.createElement("article");
            articleItem.appendChild(articleLink);

            newsContainer.appendChild(articleItem);
        });
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}
getweather();
fetchNews();
// getNews();

