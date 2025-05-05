// Cards
const workCard = document.getElementById("work-card");
const playCard = document.getElementById("play-card");
const studyCard = document.getElementById("study-card");
const exerciseCard = document.getElementById("exercise-card");
const socialCard = document.getElementById("social-card");
const selfCareCard = document.getElementById("self-care-card");

const cards = [
  workCard,
  playCard,
  studyCard,
  exerciseCard,
  socialCard,
  selfCareCard,
];

// Mapping the element id to the 'title' property in the JSON file for easier lookup
const categoryMap = {
  "work-card": "Work",
  "play-card": "Play",
  "study-card": "Study",
  "exercise-card": "Exercise",
  "social-card": "Social",
  "self-care-card": "Self Care",
};

// Radio buttons
const radioButtons = document.querySelectorAll('input[name="timeFilter"]');
const initialSelectedRadio = document.querySelector(
  'input[name="timeFilter"]:checked'
);

// Trigger initial data load with selected filter (weekly is checked in HTML)
cards.forEach(async (card) => {
  const title = categoryMap[card.id];
  const timeFrames = await getStats(initialSelectedRadio.value, title);
  updateStats(card, initialSelectedRadio.value, timeFrames);
});

/**
 * Gets all JSON data from './data.json'
 *
 * @return {JSON}
 */
async function getAllData() {
  const res = await fetch("./data.json");
  const data = await res.json();
  return data;
}

/**
 * Gets the time stats for a given category and time filter
 *
 * @param {String} timeFilter daily | weekly | monthly
 * @param {String} title Work | Play | Study | Exercise | Social | Self Care
 * @return {JSON} Current and previous time stats
 */
async function getStats(timeFilter, title) {
  const data = await getAllData();
  const currObj = data.filter((obj) => obj.title === title)[0];
  const timeFrames = currObj.timeframes[timeFilter];
  return timeFrames;
}

/**
 * Updates the stats for the times displayed on the cards when the filter changes.
 *
 * @param {HTMLElement} element Card element
 * @param {String} filterValue Value of the filter daily | weekly | monthly
 * @param {JSON} timeFrames JSON object with current and previous time values
 */
function updateStats(element, filterValue, timeFrames) {
  // Update current time
  const unchangedHTML = `<span class="visually-hidden">Current:</span>`;
  element.querySelector(".card-summary__time").innerHTML = `${unchangedHTML} ${
    timeFrames.current
  }${timeFrames.current > 1 ? "hrs" : "hr"}`;

  // Update previous time
  let previousTimeSuffix = `${timeFrames.previous}${
    timeFrames.previous > 1 ? "hrs" : "hr"
  }`;
  let previousTime;

  switch (filterValue) {
    case "daily":
      previousTime = `Yesterday - ${previousTimeSuffix}`;
      break;
    case "weekly":
      previousTime = `Last Week - ${previousTimeSuffix}`;
      break;
    case "monthly":
      previousTime = `Last Month - ${previousTimeSuffix}`;
      break;

    default:
      previousTime = "N/A";
      break;
  }

  element.querySelector(".card-summary__comparison").textContent = previousTime;
}

// Handle time filter changes to update stats when filter changes
radioButtons.forEach((radio) => {
  radio.addEventListener("change", function () {
    const filterValue = this.value;
    console.log("Selected value:", this.value);

    cards.forEach(async (card) => {
      const title = categoryMap[card.id];
      const timeFrames = await getStats(filterValue, title);
      updateStats(card, filterValue, timeFrames);
    });
  });
});
