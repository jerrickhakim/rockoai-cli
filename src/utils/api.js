const fetch = require("node-fetch");
const FormData = require("form-data");
const { getToken } = require("./token");

// API base URL - replace with actual API endpoint
const API_BASE_URL = "http://localhost:3000";
// const API_BASE_URL = "https://api.rockoai.com";

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - Parsed response data
 * @throws {Error} If the request fails or returns non-OK status
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required. Please run `rockoai login` first.");
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  // Set up default headers with authentication
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Merge provided options with default options
  const requestOptions = {
    ...options,
    headers,
  };

  const response = await fetch(url, requestOptions);

  // Check if response is OK
  if (!response.ok) {
    let errorMessage;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || `Request failed with status ${response.status}`;
    } catch (e) {
      errorMessage = `Request failed with status ${response.status}`;
    }

    throw new Error(errorMessage);
  }

  // Parse and return JSON response
  return await response.json();
};

/**
 * Get project details from the API
 * @param {string} projectName - Name of the project to fetch
 * @returns {Promise<Object>} - Project data
 */
const getProject = async (projectName) => {
  return apiRequest(`/projects/${encodeURIComponent(projectName)}`);
};

/**
 * Pull project files
 * @param {string} projectName - Name of the project to pull
 * @returns {Promise<Object>} - Project files data
 */
const pullProject = async (projectName) => {
  return apiRequest(`/api/projects/${encodeURIComponent(projectName)}/cli`, { method: "GET" });
};

/**
 * Push project files
 * @param {string} projectName - Name of the project to push
 * @param {Object} data - Project data to push (can contain zipFile or files)
 * @returns {Promise<Object>} - Response from the server
 */
const pushProject = async (projectName, data) => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required. Please run `rockoai login` first.");
  }

  const url = `${API_BASE_URL}/api/projects/${encodeURIComponent(projectName)}/cli`;

  // If we have a zip file, send it as form data
  if (data.zipFile) {
    const formData = new FormData();
    formData.append("file", data.zipFile.buffer, {
      filename: data.zipFile.filename,
      contentType: "application/zip",
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || `Request failed with status ${response.status}`;
      } catch (e) {
        errorMessage = `Request failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } else {
    // Fallback to original JSON method for backward compatibility
    return apiRequest(`/api/projects/${encodeURIComponent(projectName)}/cli`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
};

module.exports = {
  apiRequest,
  getProject,
  pullProject,
  pushProject,
};
