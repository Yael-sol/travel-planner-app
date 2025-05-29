import { useState } from "react";
function Search({ setIsChange, options, data, setData }) {
  const [searchParams, setSearchParams] = useState({
    type: "All",
    value: ""
  });

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value
    }));
  };

  function searchFunc(e) {
    e.preventDefault();
    if (searchParams.type === "All" || searchParams.value.trim() === "") {
      setIsChange(1);
      return;
    }
    if (searchParams.type === "ID" && !/^\d+$/.test(searchParams.value)) {
      alert("Please enter numbers only for ID");
      return;
    }
    if (
      searchParams.type === "Completed" &&
      searchParams.value !== "true" &&
      searchParams.value !== "false"
    ) {
      alert("Please enter 'true' or 'false' for Completed");
      return;
    }

    const type = searchParams.type.toLowerCase();
    let searchValue = searchParams.value;

    if (type === "completed") {
      searchValue = searchValue.toLowerCase() === "true" ? 1 : 0;
    }

    setData(
      data.filter((item) => {
        const result = item[type];
        return String(result).toLowerCase().includes(String(searchValue).toLowerCase());
      })
    );

    e.target.reset();
    setSearchParams({ type: "All", value: "" });
  }

  return (
    <div className="search-container">
      <form onSubmit={searchFunc}>
        <input
          name="value"
          className="search"
          placeholder="search"
          onChange={handleSearchChange}
        />

        <select
          name="type"
          value={searchParams.type}
          onChange={handleSearchChange}
        >
          <option value="All">All</option> 
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default Search;
