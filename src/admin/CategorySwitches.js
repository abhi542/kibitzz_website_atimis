import { useState } from 'react';
import { api } from './api';
import { ErrorText } from './ui';

const AWARDS = [['best_game', 'Best game'], ['brilliant_move', 'Brilliant move'], ['comeback', 'Comeback'], ['clean_game', 'Clean game']];
const GROUPS = [['category', 'Age categories (U11, F13…)'], ['women', 'Women'], ['rating_band', 'Rating bands']];

export default function CategorySwitches({ tour }) {
  const [state, setState] = useState({
    awards: tour.award_config_effective?.awards || {},
    group_types: tour.award_config_effective?.group_types || {},
  });
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);

  const toggle = async (field, key) => {
    const value = !(state[field][key] ?? true);
    setBusy(key);
    setError(null);
    try {
      setState(await api.post(`/api/admin/t/${tour.id}/award-switches`, { [field]: { [key]: value } }));
    } catch (e) {
      setError(e);
    } finally {
      setBusy(null);
    }
  };

  const list = (field, items, disabled) => (
    <div className="bb-switches">
      {items.map(([key, label]) => (
        <label key={key} className={`bb-switch${disabled ? ' off' : ''}`}>
          <input type="checkbox" checked={state[field][key] ?? true} disabled={disabled || !!busy} onChange={() => toggle(field, key)} />
          <span className="bb-switch-track" aria-hidden="true" />
          {label}
        </label>
      ))}
    </div>
  );

  return (
    <div className="bb-card">
      <h3>Leaderboard categories</h3>
      <p className="bb-muted">
        Turn these on or off at any time. Nothing is deleted: the public leaderboard follows within about a minute, for every
        round, and anything you turn back on returns as it was.
      </p>
      <div className="bb-grid2" style={{ marginTop: 10 }}>
        <div>
          <h4 className="bb-switch-head">Awards</h4>
          {list('awards', AWARDS)}
        </div>
        <div>
          <h4 className="bb-switch-head">Best game groups</h4>
          {list('group_types', GROUPS, state.awards.best_game === false)}
          <p className="bb-muted" style={{ marginTop: 8 }}>The open list is always kept while Best game is on.</p>
        </div>
      </div>
      <ErrorText error={error} />
    </div>
  );
}
