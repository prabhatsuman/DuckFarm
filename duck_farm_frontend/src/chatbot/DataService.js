// DataService.js

const fetchDataFromAPI = async (selectedType, selectedPeriod) => {
    const token = localStorage.getItem("accessToken");
  
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/chatbot/${selectedType}/${selectedPeriod}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  
  export { fetchDataFromAPI };
  