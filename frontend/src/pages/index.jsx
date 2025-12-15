import { useEffect, useState } from 'react';

export default function Home() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [raw, setRaw] = useState(null);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
    const token = process.env.NEXT_PUBLIC_API_TOKEN;

    (async () => {
      try {
        const res = await fetch(`${api}/api/articles?populate=*`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setStatus(res.status);
        const text = await res.text();
        setRaw(text);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
        }

        const json = JSON.parse(text);

        // Normalize to { id, title, content }
        const normalized =
          Array.isArray(json?.data)
            ? json.data.map((item) => {
                const id = item.id;
                // Support both shapes: attributes.title vs direct title
                const title =
                  item?.attributes?.title ?? item?.title ?? 'Untitled';
                const content =
                  item?.attributes?.content ?? item?.content ?? '';
                return { id, title, content };
              })
            : [];

        setItems(normalized);
      } catch (err) {
        setError(err.message || String(err));
      }
    })();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Articles</h1>
      {status && <p>Status: {status}</p>}
      {error && <p style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{error}</p>}

      <h2>List</h2>
      {items.length === 0 ? (
        <p>No articles yet.</p>
      ) : (
        <ul>
          {items.map((a) => (
            <li key={a.id}>
              <li> {a.id} </li>
              <li> {a.title} </li>
              <li> {a.content} </li>
              <button onClick={() => navigator.clipboard.writeText(a.id)}>{a.title}</button>
            </li>
          ))}
        </ul>
      )}

      <h2>Raw API Response</h2>
      <pre style={{ background: '#f5f5f5', padding: 12, overflowX: 'auto' }}>
        {raw}
      </pre>
    </main>
  );
}
