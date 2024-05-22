const analyseRecipeBtn = document.querySelector(".search-btn");

const baseURL = "https://api.calorieninjas.com/v1/";

const options = {
  method: "GET",
  headers: {
    "X-Api-Key": "otwN11CyK793zyZWAPVYxw==1duRAouoQBu4a844",
    "Content-Type": "application/json",
  },
};

analyseRecipeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const url = buildUrl();
  analyseRecipe(url, options);
});

function buildUrl() {
  let url = baseURL + "nutrition?query=";
  const query = document.querySelector("#recipeToAnalyse").value;
  return (url += query);
}

async function analyseRecipe(url, options) {
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      const result = await response.json();
      console.log(result);
    } else {
      throw new Error(response.status);
    }
  } catch (error) {
    console.error("Fetch", error);
    window.alert("Sorry, there was a problem.");
  }
}
