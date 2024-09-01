import React, { useEffect, useState } from 'react';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: () => <Home />
});

const Home = () => {
  const [input, setInput] = useState<string>('');
  const [hash, setHash] = useState<{
    md5: string;
    original: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const search = useSearch({ strict: false});  
  const navigate = useNavigate();

  useEffect(() => {
    if (search.data?.input) {
      setInput(search.data.input);
      handleFetchHash(search.data.input);
    }
  }, [search]);

  const handleFetchHash = (text: string) => {
    setLoading(true);
    
    fetch(`http://md5.jsontest.com/?text=${text}`)
      .then((response) => response.json())
      .then((data) => setHash(data))
      .catch((error) => {
        alert(error);
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (input.trim() === "") {
      alert('Input field is empty');
      return;
    }

    setLoading(true);
    setHash(null);

    navigate({
      search: { data: { input } },
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

      {hash && !loading && (
        <div className='hash'>
          <h4>
            <span style={{ color: '#000080' }}>Original Text : </span> 
            <span style={{ color: "#DD1144" }}>{hash.original}</span>
          </h4>
          <h4>
            <span style={{ color: '#000080' }}>MD5 : </span> 
            <span style={{ color: "#DD1144" }}>{hash.md5}</span>
          </h4>
        </div>
      )}
    </div>
  );
};
