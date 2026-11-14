import { useState } from 'react';
import { api } from './api';
import { ErrorText } from './ui';

const SWITCHES = [
  ['self_claims', 'Players linking themselves', 'Approved at once unless another account asks for the same player. Parent and coach links always wait for you.'],
  ['submissions', 'Game uploads that pass every check', 'Become official at once; anything with a problem still waits for review.'],
];

export default function AutoApprove({ tour }) {
  const [state, setState] = useState(tour.auto_approve_effective || {});
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);

  const toggle = async (key) => {
    setBusy(key);
    setError(null);
    try {
      setState(await api.post(`/api/admin/t/${tour.id}/auto-approve`, { [key]: !(state[key] ?? true) }));
    } catch (e) {
      setError(e);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="bb-card">
      <h3>Auto-approve</h3>
      <p className="bb-muted">Skip the queue for the routine cases. Changes apply to new requests straight away.</p>
      <div className="bb-switches" style={{ marginTop: 10 }}>
        {SWITCHES.map(([key, label, hint]) => (
          <div key={key}>
            <label className="bb-switch">
              <input type="checkbox" checked={state[key] ?? true} disabled={!!busy} onChange={() => toggle(key)} />
              <span className="bb-switch-track" aria-hidden="true" />
              {label}
            </label>
            <p className="bb-hint" style={{ margin: '4px 0 0 46px' }}>{hint}</p>
          </div>
        ))}
      </div>
      <ErrorText error={error} />
    </div>
  );
}
