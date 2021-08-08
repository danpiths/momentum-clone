// VARIABLES
let goalFromLS = JSON.parse(localStorage.getItem("Goal"));
let hourFromLS = JSON.parse(localStorage.getItem("Hour"));
let themeFromLS = JSON.parse(localStorage.getItem("Theme"));
let date = new Date();

// FUNCTIONS
const getBgImg = async () => {
  let theme = "Minimal";
  if (themeFromLS) {
    theme = themeFromLS;
  }
  const res = await fetch(
    `https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=${theme}`
  );
  const data = await res.json();
  return data;
};

const getTime = () => {
  const date = new Date();
  document.querySelector(".time").textContent = date.toLocaleTimeString(
    "en-us",
    { timeStyle: "short" }
  );
};

const getWeather = async (position) => {
  const res = await fetch(
    `https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`
  );
  if (!res.ok) {
    throw Error("Weather data not available");
  }
  const data = await res.json();
  return data;
};

const renderWeather = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    getWeather(position)
      .then((data) => {
        const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        document.querySelector(".weather").innerHTML = `
      <img src="${iconUrl}" />
      <p class="weather-temp">${Math.round(data.main.temp)}º</p>
      <p class="weather-city">${data.name}</p>
    `;
      })
      .catch((err) => console.log(err));
  });
};

// PROGRAM STARTS HERE
if (!hourFromLS) {
  localStorage.setItem("Hour", JSON.stringify(date.getHours()));
}
if (themeFromLS) {
  document.getElementById("theme").textContent = themeFromLS;
}

if (goalFromLS) {
  if (date.getDate() != goalFromLS[1]) {
    localStorage.removeItem("Goal");
    location.reload();
  }
  document.getElementById("goal").style.display = "none";
  document.querySelector(".goal-label").textContent = goalFromLS[0];
  document.getElementById("clear-goal").style.display = "block";
}

if (hourFromLS != date.getHours()) {
  localStorage.setItem("Hour", JSON.stringify(date.getHours()));
  getBgImg()
    .then((data) => {
      const bgForHour = [data.urls.full, `rbg(150, 150, 150)`, data.user.name];
      localStorage.setItem("bgForHour", JSON.stringify(bgForHour));
      document.body.style.backgroundImage = `url(${bgForHour[0]})`;
      document.body.style.backgroundColor = bgForHour[1];
      document.querySelector(".author").textContent = `By: ${bgForHour[2]}`;
    })
    .catch(() => {
      document.body.style.backgroundImage = `url("https://images.unsplash.com/photo-1525206223438-2c58961645ae?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjgzNDc3ODg&ixlib=rb-1.2.1&q=85")`;
      document.body.style.backgroundColor = `rgb(150, 150, 150)`;
      document.querySelector(".author").textContent = `By: Simon Berger`;
    });
} else {
  const bgForHourFromLS = JSON.parse(localStorage.getItem("bgForHour"));
  document.body.style.backgroundImage = `url(${bgForHourFromLS[0]})`;
  document.body.style.backgroundColor = bgForHourFromLS[1];
  document.querySelector(".author").textContent = `By: ${bgForHourFromLS[2]}`;
}

getTime();
setInterval(getTime, 1000);
renderWeather();
setInterval(renderWeather, 900000);

document.getElementById("goal").addEventListener("keyup", (e) => {
  if (e.code === "Enter" || e.code === "NumpadEnter") {
    const goal = document.getElementById("goal").value;
    const date = new Date();
    const goalArr = [goal, date.getDate()];
    localStorage.setItem("Goal", JSON.stringify(goalArr));
    location.reload();
  }
});

document.getElementById("clear-goal").addEventListener("click", () => {
  localStorage.removeItem("Goal");
  location.reload();
});

document.getElementById("theme-input").addEventListener("keyup", (e) => {
  if (e.code === "Enter" || e.code === "NumpadEnter") {
    const theme = document.getElementById("theme-input").value;
    localStorage.setItem("Theme", JSON.stringify(theme));
    localStorage.removeItem("Hour");
    localStorage.removeItem("bgForHour");
    location.reload();
  }
});
