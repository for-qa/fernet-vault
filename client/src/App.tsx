import React, { useEffect, useState } from 'react';
import './index.css';

const API_BASE = 'http://localhost:8102/api';

type Tab = 'generate' | 'create' | 'decode';

type SecretOption = { name: string; value: string };

type SecretOptionsResponse = {
  options?: SecretOption[];
};

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  
  // State
  const [secret, setSecret] = useState('');
  const [secretKeyEnv, setSecretKeyEnv] = useState<string>('');
  const [secretKeyOptions, setSecretKeyOptions] = useState<SecretOption[]>([]);
  const [message, setMessage] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  
  // Handlers
  const [result, setResult] = useState<string | null>(null);
  const [resultLabel, setResultLabel] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSecretOptions = async () => {
      try {
        const res = await fetch(`${API_BASE}/secret/options`);
        if (!res.ok) return;
        const data = (await res.json()) as SecretOptionsResponse;
        if (Array.isArray(data.options) && data.options.length) {
          setSecretKeyOptions(data.options);
        }
      } catch {
        // If the options endpoint is unavailable, fall back to defaults.
      }
    };

    loadSecretOptions();
  }, []);

  const clearResults = () => {
    setResult(null);
    setError(null);
  };

  const handleDoAnother = () => {
    clearResults();
    setMessage('');
    setTokenInput('');
    if (!secretKeyEnv) {
      setSecret('');
    }
  };

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    clearResults();
  };

  const handleGenerateSecret = async () => {
    setLoading(true);
    clearResults();
    try {
      const res = await fetch(`${API_BASE}/secret/generate`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate secret');
      
      setResult(data.secret);
      setResultLabel('NEW SECRET KEY');
      setSecretKeyEnv(''); // switching back to manual input
      setSecret(data.secret); // auto-fill for convenience
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateToken = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    clearResults();
    try {
      const res = await fetch(`${API_BASE}/token/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, secretKeyEnv, message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create token');
      
      setResult(data.token);
      setResultLabel('ENCODED TOKEN');
      setTokenInput(data.token); // auto-fill
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDecodeToken = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    clearResults();
    try {
      const res = await fetch(`${API_BASE}/token/decode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, secretKeyEnv, token: tokenInput })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to decode token');
      
      setResult(data.decodedMessage);
      setResultLabel('DECODED MESSAGE');
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
    }
  };

  return (
    <div className="glass-container fade-in">
      <h1 className="app-title">
        <span className="app-logo" aria-hidden="true">FV</span>
        <span>Fernet Vault</span>
      </h1>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => switchTab('generate')}
        >
          Generate Secret
        </button>
        <button 
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => switchTab('create')}
        >
          Encode Token
        </button>
        <button 
          className={`tab ${activeTab === 'decode' ? 'active' : ''}`}
          onClick={() => switchTab('decode')}
        >
          Decode Token
        </button>
      </div>

      <div className="tab-content fade-in" key={activeTab}>
        {activeTab === 'generate' && (
          <div className="form-group slide-up">
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Generate a secure 32-byte base64-encoded URL-safe secret key for your Ferent tokens.
            </p>
            <button 
              className="btn-primary" 
              onClick={handleGenerateSecret}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Secret Key'}
            </button>
          </div>
        )}

        {activeTab === 'create' && (
          <form className="slide-up" onSubmit={handleCreateToken}>
            <div className="form-group">
              <label htmlFor="create-secret-env">Secret Key Source</label>
              <select
                id="create-secret-env"
                value={secretKeyEnv}
                onChange={(e) => {
                  const selectedName = e.target.value;
                  setSecretKeyEnv(selectedName);
                  if (selectedName) {
                    const opt = secretKeyOptions.find(o => o.name === selectedName);
                    if (opt) setSecret(opt.value);
                  } else {
                    setSecret('');
                  }
                }}
              >
                <option value="">Manual entry</option>
                {secretKeyOptions.map((opt) => (
                  <option key={opt.name} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="create-secret">Secret Key</label>
              <input 
                id="create-secret"
                type="text" 
                value={secret} 
                onChange={(e) => setSecret(e.target.value)} 
                placeholder={secretKeyEnv ? `Using ${secretKeyEnv} on the server...` : 'Enter your base-64 encoded secret...'}
                required={!secretKeyEnv}
                disabled={!!secretKeyEnv}
              />
            </div>
            <div className="form-group">
              <label htmlFor="create-message">Message to Encode</label>
              <textarea 
                id="create-message"
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Enter sensitive data to protect..."
                required 
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Encoding...' : 'Encode Token'}
            </button>
          </form>
        )}

        {activeTab === 'decode' && (
          <form className="slide-up" onSubmit={handleDecodeToken}>
            <div className="form-group">
              <label htmlFor="decode-secret-env">Secret Key Source</label>
              <select
                id="decode-secret-env"
                value={secretKeyEnv}
                onChange={(e) => {
                  const selectedName = e.target.value;
                  setSecretKeyEnv(selectedName);
                  if (selectedName) {
                    const opt = secretKeyOptions.find(o => o.name === selectedName);
                    if (opt) setSecret(opt.value);
                  } else {
                    setSecret('');
                  }
                }}
              >
                <option value="">Manual entry</option>
                {secretKeyOptions.map((opt) => (
                  <option key={opt.name} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="decode-secret">Secret Key</label>
              <input 
                id="decode-secret"
                type="text" 
                value={secret} 
                onChange={(e) => setSecret(e.target.value)} 
                placeholder={secretKeyEnv ? `Using ${secretKeyEnv} on the server...` : 'Enter the secret key used for encoding...'}
                required={!secretKeyEnv}
                disabled={!!secretKeyEnv}
              />
            </div>
            <div className="form-group">
              <label htmlFor="decode-token">Token to Decode</label>
              <textarea 
                id="decode-token"
                value={tokenInput} 
                onChange={(e) => setTokenInput(e.target.value)} 
                placeholder="Paste the fernet token here..."
                required 
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Decoding...' : 'Decode Token'}
            </button>
          </form>
        )}
      </div>

      {error && <div className="error-msg fade-in">{error}</div>}

      {result && (
        <div className="result-box fade-in">
          <div style={{ display: 'flex', gap: '0.5rem', position: 'absolute', top: '1rem', right: '1rem' }}>
            <button type="button" className="copy-btn" style={{ position: 'relative', top: 0, right: 0 }} onClick={copyToClipboard} title="Copy to clipboard">
              Copy
            </button>
            <button type="button" className="copy-btn" style={{ position: 'relative', top: 0, right: 0 }} onClick={handleDoAnother} title="Start another operation">
              Do Another
            </button>
          </div>
          <div className="label">{resultLabel}</div>
          <div className="value">{result}</div>
        </div>
      )}
    </div>
  );
}

export default App;
