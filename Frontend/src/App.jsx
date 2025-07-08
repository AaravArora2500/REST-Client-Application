import { useState, useEffect } from 'react';
import { Send, History, Code, Globe, Zap, Check, X, Clock } from 'lucide-react';
import { getHistory, sendRequestLog } from './api';

function RequestForm({ onResponse }) {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const res = await fetch(url, {
        method,
        headers: JSON.parse(headers),
        body: ['POST', 'PUT'].includes(method) ? body : undefined,
      });
      const data = await res.json();

      const response = { status: res.status, data };
      onResponse(response);

      await sendRequestLog({
        method,
        url,
        headers: JSON.parse(headers),
        body: JSON.parse(body),
        response: data,
        statusCode: res.status,
      });
    } catch (err) {
      onResponse({ status: 500, data: 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Send className="w-5 h-5" />
          Send Request
        </h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Method and URL */}
        <div className="flex gap-3">
          <select 
            value={method} 
            onChange={e => setMethod(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
          
          <input 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            placeholder="Enter request URL" 
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Headers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Headers</label>
          <textarea 
            value={headers} 
            onChange={e => setHeaders(e.target.value)} 
            placeholder="Headers (JSON format)"
            className="w-full h-24 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
          />
        </div>

        {/* Body for POST/PUT */}
        {['POST', 'PUT'].includes(method) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Request Body</label>
            <textarea 
              value={body} 
              onChange={e => setBody(e.target.value)} 
              placeholder="Request body (JSON format)"
              className="w-full h-32 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        )}

        {/* Send Button */}
        <button 
          onClick={handleSend}
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              Send Request
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function ResponseViewer({ response }) {
  if (!response) return null;

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-emerald-600 bg-emerald-50';
    if (status >= 300 && status < 400) return 'text-blue-600 bg-blue-50';
    if (status >= 400 && status < 500) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusIcon = (status) => {
    if (status >= 200 && status < 300) return <Check className="w-4 h-4" />;
    if (status >= 400) return <X className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Code className="w-5 h-5" />
          Response
        </h2>
      </div>
      
      <div className="p-6">
        {/* Status Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium mb-4 ${getStatusColor(response.status)}`}>
          {getStatusIcon(response.status)}
          Status: {response.status}
        </div>
        
        {/* Response Data */}
        <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
            {JSON.stringify(response.data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

function RequestHistory() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const res = await getHistory(page, limit);
        setLogs(prev => [...prev, ...res.data]);
        if (logs.length + res.data.length >= res.total) {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error loading history:', error);
      }
    };
    loadLogs();
  }, [page]);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        if (hasMore) setPage(p => p + 1);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasMore]);

  const getMethodColor = (method) => {
    const colors = {
      GET: 'bg-emerald-100 text-emerald-800',
      POST: 'bg-blue-100 text-blue-800',
      PUT: 'bg-amber-100 text-amber-800',
      DELETE: 'bg-red-100 text-red-800'
    };
    return colors[method] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-emerald-600';
    if (status >= 300 && status < 400) return 'text-blue-600';
    if (status >= 400 && status < 500) return 'text-amber-600';
    return 'text-red-600';
  };

  // const formatTime = (timestamp) => {
  //   return new Date(timestamp).toLocaleString();
  // };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5" />
          Request History
        </h2>
      </div>
      
      <div className="p-6">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No requests yet. Send your first request to see history!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map(log => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMethodColor(log.method)}`}>
                    {log.method}
                  </span>
                  <span className="font-mono text-sm text-gray-700 truncate max-w-md">
                    {log.url}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-medium ${getStatusColor(log.statusCode)}`}>
                    {log.statusCode}
                  </span>
                  {/* <span className="text-xs text-gray-500">
                    {formatTime(log.timestamp)}
                  </span> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [response, setResponse] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              REST Client
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            A beautiful, modern REST API client for testing and debugging
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-8">
          <RequestForm onResponse={setResponse} />
          {response && <ResponseViewer response={response} />}
          <RequestHistory />
        </div>
      </div>
    </div>
  );
}