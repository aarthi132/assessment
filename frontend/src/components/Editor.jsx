import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios';

const Editor = () => {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Untitled Document');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      alert('Please upload a valid .txt file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const userEmail = localStorage.getItem('userEmail');
    formData.append('owner', userEmail);

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      window.location.href = `/document/${res.data._id}`;
    } catch (err) {
      console.error(err);
      alert('Error uploading file');
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/documents/${id}`);
            setContent(res.data.content);
            setTitle(res.data.title);
        } catch(err) {
            if(err.response && err.response.status === 404) {
                setError('Document not found. You can save to create it.');
            } else {
                setError('Error fetching document: ' + err.message);
            }
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    if (id !== 'default') {
      fetchDocument();
    } else {
      setLoading(false);
    }
  }, [id]);

  const [justSaved, setJustSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (id === 'default' || error) {
         const res = await axios.post(`http://localhost:5000/api/documents`, {
             title,
             content,
             owner: userEmail
         });
         window.location.href = `/document/${res.data._id}`;
      } else {
         await axios.put(`http://localhost:5000/api/documents/${id}`, {
             title,
             content
         });
         setJustSaved(true);
         setTimeout(() => setJustSaved(false), 2000);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving document');
    }
    setSaving(false);
  };

  const handleShare = async () => {
    if (id === 'default') {
      alert('Please save the document first before sharing.');
      return;
    }
    const emailToShare = prompt('Enter email to share with:');
    if (!emailToShare) return;
    
    try {
      await axios.post(`http://localhost:5000/api/documents/${id}/share`, { email: emailToShare.trim() });
      alert(`Shared successfully with ${emailToShare}`);
    } catch (err) {
      console.error(err);
      alert('Error sharing document: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      <div className="w-full bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => window.location.href = '/'} className="text-gray-500 hover:text-blue-600 transition-colors" title="Back to Dashboard">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <div className="text-blue-500">
            <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.5 3.33334H9.16667C8.28261 3.33334 7.43476 3.68453 6.80964 4.30965C6.18452 4.93478 5.83333 5.78262 5.83333 6.66668V33.3333C5.83333 34.2174 6.18452 35.0652 6.80964 35.6904C7.43476 36.3155 8.28261 36.6667 9.16667 36.6667H30.8333C31.7174 36.6667 32.5652 36.3155 33.1904 35.6904C33.8155 35.0652 34.1667 34.2174 34.1667 33.3333V15L22.5 3.33334Z" fill="#2684FC"/>
              <path d="M22.5 3.33334V15H34.1667" fill="#005A9E"/>
              <path d="M12.5 21.6667H27.5M12.5 26.6667H27.5M12.5 16.6667H17.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg text-gray-800 font-medium px-2 py-1 border border-transparent hover:border-gray-300 focus:border-blue-500 rounded outline-none transition-colors"
              placeholder="Untitled Document"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {id !== 'default' && !error && (
            <button
              onClick={handleShare}
              className="text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium py-2 px-4 rounded shadow-sm border border-gray-300 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
              Share
            </button>
          )}
          <input 
            type="file" 
            accept=".txt" 
            ref={fileInputRef} 
            onChange={handleImport} 
            style={{ display: 'none' }} 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded shadow-sm border border-gray-300 transition-colors"
          >
            Import File
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`${justSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2 px-6 rounded shadow-sm transition-colors disabled:opacity-50`}
          >
            {saving ? 'Saving...' : justSaved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="w-full max-w-4xl mt-4 px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl mt-6 px-4 pb-12">
        <div className="bg-white rounded-lg shadow-sm">
          <ReactQuill 
            theme="snow" 
            value={content} 
            onChange={setContent}
            className="h-full"
            placeholder="Type your content here..."
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
