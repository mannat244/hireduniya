document.addEventListener("DOMContentLoaded", () => {
  const jobDetailContainer = document.getElementById("jobDetail");
  const job = JSON.parse(localStorage.getItem("selectedJob"));

  if (!job) {
    jobDetailContainer.innerHTML =
      "<p>No job details available. Please go back and select a job.</p>";
  } else {
    let html = `
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <img
            class="w-16 h-16 object-contain rounded-full mr-4"
            src="${job.employer_logo ? job.employer_logo : 'default-logo.png'}"
            alt="${job.employer_name || 'Company'} Logo"
          />
          <div>
            <h2 class="text-2xl font-bold text-orange-500">
              ${job.job_title || "No Title"}
            </h2>
            <p class="text-gray-600">
              ${job.employer_name || "Unknown Employer"}
            </p>
          </div>
        </div>
        <a
          href="index.html"
          class="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full px-4 py-2 text-sm flex items-center"
        >
          <i class="material-icons mr-1">arrow_back</i> Back to Search
        </a>
      </div>

      <p class="text-sm text-gray-500 mb-2">
        <i class="material-icons mr-1">location_on</i>
        ${job.job_city || ""} ${job.job_state || ""} ${job.job_country || ""}
      </p>
      <div class="border-t border-gray-200 pt-4 mt-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Job Description</h3>
        <p class="text-gray-700 whitespace-pre-line">
          ${job.job_description || "No description available."}
        </p>
      </div>
    `;

    if (job.apply_options && job.apply_options.length > 0) {
      html += `
        <div class="relative inline-block mt-4">
          <button class="dropdown-toggle bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition inline-flex items-center">
            <i class="material-icons mr-2">send</i> Apply Now
            <i class="material-icons ml-2">arrow_drop_down</i>
          </button>
          <div class="dropdown-content hidden absolute bg-white shadow rounded-lg mt-2 w-48 z-10">
      `;
      job.apply_options.forEach((option) => {
        html += `
          <a
            href="${option.apply_link}"
            target="_blank"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            ${option.publisher}
          </a>
        `;
      });
      html += `
          </div>
        </div>
      `;
    } else if (job.job_apply_link) {
      html += `
        <a
          class="inline-flex items-center mt-4 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition"
          href="${job.job_apply_link}"
          target="_blank"
        >
          <i class="material-icons mr-2">send</i> Apply Now
        </a>
      `;
    } else {
      html += `<p class="mt-4 text-gray-500">No apply link available.</p>`;
    }

    jobDetailContainer.innerHTML = html;

    const dropdownToggle = document.querySelector(".dropdown-toggle");
    if (dropdownToggle) {
      dropdownToggle.addEventListener("click", () => {
        const dropdownContent = document.querySelector(".dropdown-content");
        dropdownContent.classList.toggle("hidden");
      });
    }
  }
});
