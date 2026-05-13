import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export default function AuthPage() {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialMode = params.get('mode') === 'signup' ? 'signup' : 'signin';
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.remove('landing');
    document.body.classList.add('app');
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/app', { replace: true });
    }
  }, [user, navigate]);

  const title = useMemo(() => (mode === 'signup' ? 'Create your account' : 'Welcome back'), [mode]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        pushToast('Account created. Check your email if confirmation is enabled.');
        navigate('/app', { replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/app', { replace: true });
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">✦</div>
          <h1>{title}</h1>
          <p>Sign in to your AI document workspace.</p>
        </div>
        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </label>
          <label>
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
          </label>
          {error && <div className="auth-error">{error}</div>}
          <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
            {loading ? 'Working…' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>
        <div className="auth-footer">
          {mode === 'signup' ? (
            <button type="button" onClick={() => setMode('signin')}>
              Already have an account? Sign in
            </button>
          ) : (
            <button type="button" onClick={() => setMode('signup')}>
              New here? Create an account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
