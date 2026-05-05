import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myDocuments, setMyDocuments] = useState([]);
  const [sharedWithMe, setSharedWithMe] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      setIsLoggedIn(true);
      fetchDocuments(storedEmail);
    }
  }, []);

  const fetchDocuments = async (userEmail) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/documents/user/${userEmail}`);
      setMyDocuments(res.data.myDocuments);
      setSharedWithMe(res.data.sharedWithMe);
    } catch (err) {
      console.error('Error fetching documents', err);
    }
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (email.trim()) {
      localStorage.setItem('userEmail', email.trim());
      setIsLoggedIn(true);
      fetchDocuments(email.trim());
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setEmail('');
    setIsLoggedIn(false);
    setMyDocuments([]);
    setSharedWithMe([]);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <svg className="w-12 h-12 mx-auto mb-4" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.5 3.33334H9.16667C8.28261 3.33334 7.43476 3.68453 6.80964 4.30965C6.18452 4.93478 5.83333 5.78262 5.83333 6.66668V33.3333C5.83333 34.2174 6.18452 35.0652 6.80964 35.6904C7.43476 36.3155 8.28261 36.6667 9.16667 36.6667H30.8333C31.7174 36.6667 32.5652 36.3155 33.1904 35.6904C33.8155 35.0652 34.1667 34.2174 34.1667 33.3333V15L22.5 3.33334Z" fill="#2684FC"/>
              <path d="M22.5 3.33334V15H34.1667" fill="#005A9E"/>
              <path d="M12.5 21.6667H27.5M12.5 26.6667H27.5M12.5 16.6667H17.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">Welcome to Docs</h2>
            <p className="text-gray-500 mt-2">Enter your email to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const DocumentList = ({ docs, emptyMessage }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {docs.length === 0 ? (
        <p className="text-gray-500 col-span-full py-4">{emptyMessage}</p>
      ) : (
        docs.map(doc => (
          <Link to={`/document/${doc._id}`} key={doc._id} className="block group">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all overflow-hidden flex flex-col h-48">
              <div className="bg-gray-50 h-32 flex items-center justify-center border-b border-gray-100 group-hover:bg-blue-50 transition-colors">
                <svg className="w-12 h-12 text-blue-500 opacity-50" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.5 3.33334H9.16667C8.28261 3.33334 7.43476 3.68453 6.80964 4.30965C6.18452 4.93478 5.83333 5.78262 5.83333 6.66668V33.3333C5.83333 34.2174 6.18452 35.0652 6.80964 35.6904C7.43476 36.3155 8.28261 36.6667 9.16667 36.6667H30.8333C31.7174 36.6667 32.5652 36.3155 33.1904 35.6904C33.8155 35.0652 34.1667 34.2174 34.1667 33.3333V15L22.5 3.33334Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-center">
                <h3 className="font-medium text-gray-900 truncate">{doc.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(doc.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-blue-500">
              <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.5 3.33334H9.16667C8.28261 3.33334 7.43476 3.68453 6.80964 4.30965C6.18452 4.93478 5.83333 5.78262 5.83333 6.66668V33.3333C5.83333 34.2174 6.18452 35.0652 6.80964 35.6904C7.43476 36.3155 8.28261 36.6667 9.16667 36.6667H30.8333C31.7174 36.6667 32.5652 36.3155 33.1904 35.6904C33.8155 35.0652 34.1667 34.2174 34.1667 33.3333V15L22.5 3.33334Z" fill="#2684FC"/>
                <path d="M22.5 3.33334V15H34.1667" fill="#005A9E"/>
              </svg>
            </div>
            <h1 className="text-xl font-medium text-gray-800">Docs Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline-block">{email}</span>
            <button
              onClick={() => navigate('/document/default')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow-sm transition-colors text-sm"
            >
              + New Document
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading your documents...</div>
        ) : (
          <div className="space-y-12">
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">My Documents</h2>
              <DocumentList docs={myDocuments} emptyMessage="You haven't created any documents yet." />
            </section>
            
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Shared with Me</h2>
              <DocumentList docs={sharedWithMe} emptyMessage="No documents have been shared with you." />
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
