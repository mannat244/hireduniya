document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const locationFilter = document.getElementById("locationFilter");
  const jobTypeFilter = document.getElementById("jobTypeFilter");
  const dateFilter = document.getElementById("dateFilter");
  const jobListings = document.getElementById("jobListings");
  const loading = document.getElementById("loading");

  const defaultQuery = "tech india";

  async function fetchJobs() {
    loading.style.display = "block";
    jobListings.innerHTML = "";

    let query = searchInput.value.trim() || defaultQuery;
    const locationVal = locationFilter.value;
    if (locationVal) query += ` in ${locationVal}`;
    
    const jobTypeVal = jobTypeFilter.value;
    if (jobTypeVal && jobTypeVal !== "Any") query += ` ${jobTypeVal.toLowerCase()}`;

    const baseUrl = "https://jsearch.p.rapidapi.com/search";
    const urlParams = new URLSearchParams({
      query,
      page: "1",
      num_pages: "1",
      country: "in"
    });

    if (dateFilter.value !== "all") urlParams.append("date_posted", dateFilter.value);
    if (jobTypeVal && jobTypeVal !== "Any") urlParams.append("employment_types", jobTypeVal);

    const url = `${baseUrl}?${urlParams.toString()}`;

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "58a163cacdmshf7e39595bcdb146p1ae645jsn2d5062a6e4cb",
        "x-rapidapi-host": "jsearch.p.rapidapi.com"
      }
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const data = await response.json();
      console.log("Full API response:", data); // Debugging: Log full response

      // Validate response structure
      if (!data || typeof data !== "object") {
        throw new Error("Invalid API response: Expected an object");
      }

      if (!Array.isArray(data.data)) {
        console.error("Unexpected API response structure:", data);
        jobListings.innerHTML = "<p class='text-red-500'>Unexpected API response format.</p>";
        return;
      }

      const jobs = data.data;
      if (jobs.length === 0) {
        jobListings.innerHTML = "<p>No jobs found.</p>";
        return;
      }

      localStorage.setItem("cachedJobs", JSON.stringify(jobs));
      displayJobs(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      jobListings.innerHTML = "<p class='text-red-500'>Error fetching jobs. Please try again later.</p>";
    } finally {
      loading.style.display = "none";
    }
  }

  function displayJobs(jobs) {
    jobListings.innerHTML = "";
    if (!Array.isArray(jobs) || jobs.length === 0) {
      jobListings.innerHTML = "<p>No jobs found.</p>";
      return;
    }

    jobs.forEach((job) => {
      const card = document.createElement("div");
      card.className = "job-card bg-white rounded-lg shadow p-4 cursor-pointer transition hover:shadow-xl";
      card.innerHTML = `
        <div class="job-card-header mb-3">
          <img class="employer-logo w-12 h-12 object-contain rounded-full" src="${job.employer_logo || 'default-logo.png'}" alt="${job.employer_name || "Company"} Logo">
        </div>
        <h3 class="text-lg font-semibold text-orange-500 mb-1">${job.job_title || "No Title"}</h3>
        <p class="text-sm text-gray-700 mb-2">
          <i class="material-icons align-middle">business</i> ${job.employer_name || "Unknown Employer"}
        </p>
        <p class="text-sm text-gray-700">
          <i class="material-icons align-middle">location_on</i> ${job.job_city || ""} ${job.job_state || ""}
        </p>
      `;
      card.addEventListener("click", () => {
        localStorage.setItem("selectedJob", JSON.stringify(job));
        window.location.href = "job-detail.html";
      });
      jobListings.appendChild(card);
    });
  }

  const cachedJobs = localStorage.getItem("cachedJobs");
  if (cachedJobs) {
    displayJobs(JSON.parse(cachedJobs));
  } else {
    fetchJobs();
  }

  searchBtn.addEventListener("click", fetchJobs);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") fetchJobs();
  });
});
