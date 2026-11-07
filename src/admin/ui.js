import { useCallback, useEffect, useState } from 'react';

// Loads data on mount and whenever deps change; reload() refetches.
export function useLoad(fn, deps) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(fn, deps);
  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: true }));
    return load().then(
      (data) => setState({ data, error: null, loading: false }),
      (error) => setState({ data: null, error, loading: false }),
    );
  }, [load]);
  useEffect(() => {
    reload();
  }, [reload]);
  return { ...state, reload };
}

export function ErrorText({ error }) {
  if (!error) return null;
  return (
    <div className="bb-error" role="alert">
      {error.code && <strong>{error.code}</strong>} {error.message}
    </div>
  );
}

export function Loading({ state, children }) {
  if (state.loading && !state.data) return <p className="bb-muted">Loading…</p>;
  if (state.error) return <ErrorText error={state.error} />;
  return children(state.data);
}

// A button that runs an async action, shows progress and reports its own error.
export function Action({ run, children, kind = 'primary', confirm, disabled, onDone, small }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const click = async () => {
    if (confirm && !window.confirm(confirm)) return;
    setBusy(true);
    setError(null);
    try {
      const result = await run();
      onDone && onDone(result);
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  };
  return (
    <span className="bb-action">
      <button type="button" className={`bb-btn bb-btn-${kind}${small ? ' bb-btn-sm' : ''}`} onClick={click} disabled={busy || disabled}>
        {busy ? 'Working…' : children}
      </button>
      {error && <ErrorText error={error} />}
    </span>
  );
}

const TONES = {
  live: 'good', approved: 'good', published: 'good', usable: 'good', done: 'good', confirmed: 'good',
  pending: 'warn', uploaded: 'warn', reviewing: 'warn', queued: 'warn', running: 'warn', closed: 'warn', paired: 'info',
  draft: 'info', finished: 'info',
  rejected: 'bad', revoked: 'bad', disputed: 'bad', failed: 'bad', excluded: 'bad',
};

export function Badge({ value }) {
  if (value == null) return null;
  return <span className={`bb-badge bb-${TONES[value] || 'info'}`}>{String(value)}</span>;
}

export function Field({ label, hint, children }) {
  return (
    <label className="bb-field">
      <span className="bb-label">{label}</span>
      {children}
      {hint && <span className="bb-hint">{hint}</span>}
    </label>
  );
}

export function Counts({ counts }) {
  if (!counts) return null;
  return (
    <div className="bb-counts">
      {Object.entries(counts).map(([k, v]) => (
        <div key={k} className="bb-count">
          <span className="bb-count-n">{typeof v === 'object' && v ? Object.entries(v).map(([a, b]) => `${a}: ${b}`).join(', ') : String(v)}</span>
          <span className="bb-count-k">{k.replace(/_/g, ' ')}</span>
        </div>
      ))}
    </div>
  );
}

export function Warnings({ items, title = 'Warnings', tone = 'warn' }) {
  if (!items || items.length === 0) return null;
  return (
    <div className={`bb-note bb-note-${tone}`}>
      <strong>{title}</strong>
      <ul>
        {items.map((w, i) => (
          <li key={i}>{typeof w === 'string' ? w : JSON.stringify(w)}</li>
        ))}
      </ul>
    </div>
  );
}

// Excel import in two steps: upload for a preview, then confirm with the preview id.
export function ImportFlow({ title, hint, previewUpload, renderPreview, confirm, confirmLabel = 'Confirm import', onDone, extraValid = true }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const doPreview = async () => {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      setPreview(await previewUpload(file));
    } catch (e) {
      setError(e);
      setPreview(null);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="bb-card">
      <h3>{title}</h3>
      {hint && <p className="bb-muted">{hint}</p>}
      {!preview && (
        <div className="bb-row">
          <input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files[0] || null)} />
          <button type="button" className="bb-btn bb-btn-primary" disabled={!file || busy} onClick={doPreview}>
            {busy ? 'Reading…' : 'Upload and preview'}
          </button>
        </div>
      )}
      <ErrorText error={error} />
      {preview && (
        <>
          {renderPreview(preview)}
          {preview.blocked ? (
            <Warnings title="Blocked: fix the file and upload again" items={preview.blocking} tone="bad" />
          ) : null}
          <div className="bb-row">
            <Action
              run={() => confirm(preview)}
              disabled={preview.blocked || !extraValid}
              onDone={(r) => {
                setResult(r);
                reset();
                onDone && onDone(r);
              }}
            >
              {confirmLabel}
            </Action>
            <button type="button" className="bb-btn bb-btn-ghost" onClick={reset}>
              Cancel
            </button>
          </div>
        </>
      )}
      {result && (
        <div className="bb-note bb-note-good">
          <strong>Done.</strong> <code>{JSON.stringify(result).slice(0, 300)}</code>
        </div>
      )}
    </div>
  );
}

export const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString() : '—');
