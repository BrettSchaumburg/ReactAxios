const handleSubmit = (event, setUrl, query) => {
    setUrl(`https://api.chucknorris.io/jokes/search?query=${query}`);
    console.log("Submitting search query");
    event.preventDefault();
  };
  
  function Pagination({ items, pageSize, onPageChange }) {
    const { Button } = ReactBootstrap;
    if (items.length <= 1) return null;
  
    let num = Math.ceil(items.length / pageSize);
    let pages = range(1, num);
    const list = pages.map((page) => {
      return (
        <Button key={page} onClick={onPageChange} className="page-item">
          {page}
        </Button>
      );
    });
    return (
      <nav>
        <ul className="pagination">{list}</ul>
      </nav>
    );
  }
  
  const range = (start, end) => {
    return Array(end - start + 1)
      .fill(0)
      .map((item, i) => start + i);
  };
  
  function paginate(items, pageNumber, pageSize) {
    const start = (pageNumber - 1) * pageSize;
    let page = items.slice(start, start + pageSize);
    return page;
  }
  
  const useDataApi = (initialUrl, initialData) => {
    const { useState, useEffect } = React;
    const [url, setUrl] = useState(initialUrl);
    const [data, setData] = useState(initialData);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      let didCancel = false;
  
      const fetchData = async () => {
        setLoading(true);
        setError(null);
  
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const result = await response.json();
          setData(result);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
  
      return () => {
        didCancel = true;
      };
    }, [url]);
  
    return [{ data, isLoading, error }, setUrl];
  };
  
  const App = () => {
    const { Fragment, useState } = React;
  
    const [query, setQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
  
    const [{ data, isLoading, isError }, setUrl] = useDataApi(
      `https://api.chucknorris.io/jokes/search?query=death`,
      { result: [] }
    );
  
    const handlePageChange = (e) => {
      setCurrentPage(Number(e.target.textContent));
    };
  
    const handleSearchBoxChange = (e) => {
      setQuery(e.target.value);
    };
  
    console.log(`Line 135 query value: ${query}`);
    console.log(data.result);
  
    let page = data.result;
    if (page.length >= 1) {
      page = paginate(page, currentPage, pageSize);
      console.log(`currentPage: ${currentPage}`);
    }
  
    const handleSubmitForm = (event) => {
      handleSubmit(event, setUrl, query);
      console.log(`Line 149 query value: ${query}`);
      event.preventDefault();
    };
  
    return (
      <form onSubmit={handleSubmitForm}>
        <Fragment>
          {isLoading ? (
            <div>Loading ...</div>
          ) : (
            <div>
              <div className="input-group mb-3">
                <input
                  onChange={handleSearchBoxChange}
                  value={query}
                  type="text"
                  id="myQuery"
                  className="form-control"
                  placeholder="Enter your search..."
                />
                <div className="input-group-append">
                  <button className="btn btn-outline-secondary" type="submit">
                    Search
                  </button>
                </div>
              </div>
              <ul className="list-group">
                {page.map((item) => (
                  <li key={item.objectID} className="list-group-item">
                    <a href={item.url}>{item.value}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Pagination
            items={data.result}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </Fragment>
      </form>
    );
  };
  
  ReactDOM.render(<App />, document.getElementById("root"));