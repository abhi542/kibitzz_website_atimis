import { useState } from 'react';
import { api } from './api';
import { ErrorText } from './ui';

const AWARDS = [['best_game', 'Best game'], ['brilliant_move', 'Brilliant move'], ['comeback', 'Comeback'], ['clean_game', 'Clean game']];
const GROUPS = [
  ['category', 'Age categories (U10, U12…)'],
  ['girls', "Girls' categories (F09, F11…)"],
  ['women', 'Women'],
  ['rating_band', 'Rating bands'],
];

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

  // Girls' boards are age categories too: they need Age categories on
  const list = (field, items, allOff) => (
    <div className="bb-switches">
      {items.map(([key, label]) => {
        const disabled = allOff || (key === 'girls' && state.group_types.category === false);
        return (
          <label key={key} className={`bb-switch${disabled ? ' off' : ''}`}>
            <input type="checkbox" checked={state[field][key] ?? true} disabled={disabled || !!busy} onChange={() => toggle(field, key)} />
            <span className="bb-switch-track" aria-hidden="true" />
            {label}
          </label>
        );
      })}
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
          <h4 className="bb-switch-head">Best game and Brilliant move boards</h4>
          {list('group_types', GROUPS, state.awards.best_game === false && state.awards.brilliant_move === false)}
          <p className="bb-muted" style={{ marginTop: 8 }}>
            Open (players without an age category, seniors included) is always kept. Turning age categories off hides those
            players from these two awards, as they are not in Open. Girls in F09, F11… are also on the mixed U09, U11…
            boards, so turning girls' categories off only removes the girls-only boards. Comeback and Clean game are one
            board for everyone.
          </p>
        </div>
      </div>
      <ErrorText error={error} />
    </div>
  );
}
