import React, { useEffect, useState } from 'react';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: () => <Home />
})

const Home = () => {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const search = useSearch({}); 
  const navigate = useNavigate();

  useEffect(() => {
    if (search.input) {
      setInput(search.input);
      setLoading(true);  // Set loading when fetching from URL param
      handleFetchHash(search.input);
    }
  }, [search]);

  const handleFetchHash = (text: string) => {
    fetch(`http://md5.jsontest.com/?text=${text}`)
      .then((response) => response.json())
      .then((data) => setHash(data.md5))
      .catch((error) => console.error('Error fetching MD5 hash:', error))
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (input.trim() === "") return;  // Avoid empty inputs

    setLoading(true);
    setHash(null); // Reset hash on new submit
    navigate({
      search: { input },
    });
    handleFetchHash(input);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className='container'>
      <h1>Welcome To MD5 Hash Converter</h1>
      <div className="">
        <input onChange={handleInputChange} type="text" value={input} placeholder='Enter a text' />
      </div>
      <button onClick={handleSubmit} disabled={!input}>
        {loading ? 'Loading..' : 'Convert'}
      </button>

      {
        hash && !loading && (
          <div className='hash'>
            <h4><span style={{ color: '#000080'}}>Original Text :</span> <span style={{ color: "#DD1144"}}>{input}</span></h4>
            <h4 ><span style={{ color: '#000080'}}>MD5 :</span> <span style={{ color: "#DD1144"}}>{hash}</span></h4>
          </div>
        )
      }
    </div>
  );
};
