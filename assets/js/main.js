document.addEventListener("DOMContentLoaded", () => {
  const userInput = document.getElementById("date");
  const result = document.getElementById("result");
  const calculateButton = document.querySelector("button");

  // Set the maximum date to today
  userInput.max = new Date().toISOString().split("T")[0];

  // Function to calculate the age
  function calculateAge() {
    const birthDateValue = userInput.value;
    if (!birthDateValue) {
      result.innerHTML = "Please enter a valid birth date.";
      return;
    }

    const birthDate = new Date(birthDateValue);
    const today = new Date();

    // Ensure the birth date is not in the future
    if (birthDate > today) {
      result.innerHTML = "Please select a valid birth date.";
      return;
    }

    const ageDetails = getAgeDetails(birthDate, today);
    result.innerHTML = `<span>${ageDetails.years}</span> Years, <span>${ageDetails.months}</span> Months, <span>${ageDetails.days}</span> Days.`;
  }

  // Function to get the age details
  function getAgeDetails(birthDate, currentDate) {
    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();
    let days = currentDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      days += getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  }

  // Function to get the number of days in a month
  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  // Attach the calculateAge function to the button click event
  calculateButton.addEventListener("click", calculateAge);
});

// API CODE
/**
 * This file contains functions for fetching and displaying random quotes from the
 * api-ninjas API. It also contains functions for copying, tweeting, and speech
 * synthesis of quotes.
 */

/**
 * @typedef {Object} QuoteObject
 * @property {string} quote - The quote
 * @property {string} author - The author of the quote
 * @property {string} category - The category of the quote
 */
const API_KEY = "OsUGNOpvFnJ8ZB3I3tY57A==Rhqy2uKdm0hss8iX";
const API_URL = "https://api.api-ninjas.com/v1/quotes?category";
/**
 * Fetches a random quote from the API
 * @returns {Promise<QuoteObject[]>} A promise that resolves to an array of quote objects
 */
const getRandomQuote = async () => {
  // Adds a loading class to the button and sets the text to 'Please Wait'
  btnNewQuote.classList.add("loading");
  btnNewQuote.textContent = "Please Wait";
  // Sets the quote text to 'Loading Quote...'
  quoteEl.textContent = "Loading Quote...";

  try {
    // Makes a GET request to the api-ninjas API
    const response = await fetch(API_URL, {
      headers: {
        // Adds the API key as a header to the request
        "X-Api-Key": API_KEY,
      },
    });
    // Parses the response as JSON
    const result = await response.json();
    // Generates a random index between 0 and the length of the result array
    const randomIndex = Math.floor(Math.random() * result.length);
    // Gets the quote object at the random index
    const randomQuote = result[randomIndex];
    // Displays the quote
    displayQuote([randomQuote]);
    // Returns the result array (containing all the quote objects)
    return result;
  } catch (error) {
    // Logs the error to the console
    console.error("Error: ", error);
    quoteEl.textContent = "Failed to load quote. Please try again.";
    btnNewQuote.classList.remove("loading");
    btnNewQuote.textContent = "New Quote";
  }
};

/**
 * Displays a quote on the page
 * @param {QuoteObject[]} result - An array of quote objects
 */
const displayQuote = (result) => {
  // Gets the first quote object from the result array
  const quote = result[0];
  // Sets the quote text to the quote property of the quote object
  quoteEl.textContent = quote.quote;
  // Sets the author name to the author property of the quote object
  authorName.textContent = quote.author;
  categoryEL.textContent = "- " + quote.category + " -";
  // Removes the loading class from the button and sets the text to 'New Quote'
  btnNewQuote.classList.remove("loading");
  btnNewQuote.textContent = "New Quote";
};

/**
 * Speaks the quote
 */
function speakQuote() {
  let utterance = new SpeechSynthesisUtterance(
    quoteEl.innerText + " by " + authorName.innerText
  );

  // Event when speech starts
  utterance.onstart = function () {
    speechBtn.classList.add("active");
  };

  // Event when speech ends
  utterance.onend = function () {
    speechBtn.classList.remove("active");
  };

  synth.speak(utterance);
}

/**
 * Copies the quote to the clipboard
 */
const copyQuote = () => {
  // Writes the quote text to the clipboard
  navigator.clipboard.writeText(quoteEl.textContent);
};

/**
 * Tweets the quote
 */
const tweetQuote = () => {
  // Creates a URL to tweet the quote
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    quoteEl.textContent
  )}`;
  // Opens a new tab with the tweet URL
  window.open(tweetUrl, "_blank");
};

// Querying the DOM
const quoteEl = document.querySelector(".quote");
const authorName = document.querySelector(".name");
const btnNewQuote = document.getElementById("btn-quote");
const speechBtn = document.querySelector(".speech");
const copyBtn = document.querySelector(".copy");
const twitterBtn = document.querySelector(".twitter");
const categoryEL = document.querySelector(".category");
const synth = window.speechSynthesis;
const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
// const synth = window.speechSynthesis;

// Adding event listeners
speechBtn.addEventListener("click", speakQuote);
copyBtn.addEventListener("click", copyQuote);
twitterBtn.addEventListener("click", tweetQuote);
btnNewQuote.addEventListener("click", getRandomQuote);

// Initialize with a random quote on page load
getRandomQuote();
