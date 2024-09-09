'use client';
import React, { ChangeEvent, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function Home() {
  const [images, setFiles] = useState<string[]>([]);
  const [context, setContext] = useState('');
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileArray: string[] = [];
      for (const file of event.target.files) {
        const base64String = await convertFileToBase64(file);
        fileArray.push(base64String);
      }
      setFiles(fileArray);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    const data = { images, context };
    setLoading(true); // Show the spinner
    try {
      const response = await axios.post(
        'http://localhost:5000/api/analyze',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setInstructions(response.data.message);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error uploading files:', error);
      setError('Failed to upload files. Please try again.');
    } finally {
      setLoading(false); // Hide the spinner
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 font-sans'>
      <h2 className='text-3xl font-bold text-gray-800 mb-6'>
        Upload Screenshots for Testing Instructions
      </h2>

      <input
        type='file'
        multiple
        onChange={handleFileChange}
        className='mb-4 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500'
      />
      <textarea
        className='mb-4 w-full md:w-96 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500'
        placeholder='Optional context for the screenshots'
        value={context}
        onChange={(e) => setContext(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className='mb-4 bg-gray-700 text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition duration-300 flex items-center justify-center'
      >
        {loading ? (
          <div className='animate-spin border-4 border-gray-200 border-t-transparent rounded-full w-6 h-6'></div>
        ) : (
          'Describe Testing Instructions'
        )}
      </button>

      {error && <p className='text-red-600'>{error}</p>}

      {instructions && (
        <div className='mt-6 w-full md:w-3/4 lg:w-1/2'>
          <ReactMarkdown className='text-gray-800 bg-white p-4 rounded-lg shadow-sm'>
            {instructions}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default Home;
