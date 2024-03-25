const handleSubmit = () => {
                                //need to resubmit query
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
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);

  const reFetch = () => {
    fetchData();  
  };
  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};




// App that gets data from Chuck Norris API url
function App() {
  const { Fragment, useState, useEffect, useReducer } = React;

  const [query, setQuery] = useState("death");
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
 
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    (`https://api.chucknorris.io/jokes/search?query=${query}`),
    {
      result: [],
    }
  );
  const handlePageChange = (e) => {
    setCurrentPage(Number(e.target.textContent));
  };
  
  const handleSearchBoxChange = (e) => {
    setQuery(e.target.value);
  };
  
  console.log(data.result);
  let page = data.result;
  if (page.length >= 1) {
    page = paginate(page, currentPage, pageSize);
    console.log(`currentPage: ${currentPage}`);
  }
  return (
    
    <Fragment>
        {isLoading ? ( //if loading is true
            <div>Loading ...</div>
        ) : (  // else show when loading is false (ie done loading)       
            
            <div>
            <div className="input-group mb-3">
            <input onChange={handleSearchBoxChange} value={query} type="text" id="myQuery" className="form-control" placeholder="Enter your search...">
            </input>
            <div className="input-group-append">
                <button className="btn btn-outline-secondary" onClick={handleSubmit}>Search</button>
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
        ></Pagination>
    </Fragment>

  );
}

// ========================================
ReactDOM.render(<App />, document.getElementById("root"));
