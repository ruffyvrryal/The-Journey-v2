// Authentic Login & Sign Up View matching Reference Photo 1
import { store } from '../state.js';
import { firebaseService } from '../firebase-config.js';
import { showToast } from './auth-modal.js';

export function renderLoginView(container) {
  container.innerHTML = `
    <div class="auth-page-screen">
      <!-- Top Branding Headers -->
      <div class="auth-top-branding">
        <div class="auth-brand-left">
          <span class="arcade-yellow-title">THE<br>JOURNEY</span>
        </div>
        <div class="auth-brand-right">
          <span class="arcade-yellow-title">FOOTBALL<br>MANAGER</span>
        </div>
      </div>

      <!-- Center White Login Card (Exact Replica of Photo 1) -->
      <div class="auth-card-container">
        <div class="auth-card-inner">
          <h2 class="auth-card-title">WELCOME, MANAGER!</h2>

          <form id="fm-login-form" class="auth-form-body" onsubmit="return false;">
            <!-- Email Address Field -->
            <div class="auth-field-group">
              <label for="auth-email-input" class="auth-field-label">Email Address</label>
              <input 
                type="email" 
                id="auth-email-input" 
                class="auth-input-control" 
                placeholder="manager@thejourney.fm" 
                required 
                autocomplete="email"
              />
            </div>

            <!-- Password Field -->
            <div class="auth-field-group">
              <label for="auth-password-input" class="auth-field-label">Password</label>
              <input 
                type="password" 
                id="auth-password-input" 
                class="auth-input-control" 
                placeholder="••••••••" 
                required 
                autocomplete="current-password"
              />
            </div>

            <!-- Forgot Password Link -->
            <div class="auth-forgot-row">
              <a href="#" id="link-forgot-password" class="auth-forgot-link">Forgot Password?</a>
            </div>

            <!-- Google Account Row -->
            <div class="auth-google-row">
              <span class="auth-google-text">Login with Google account:</span>
              <button type="button" id="btn-google-login" class="btn-google-icon-circle" title="Sign in with Google">
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
              </button>
            </div>

            <!-- Action Buttons (Solid Blue) -->
            <div class="auth-actions-stack">
              <button type="submit" id="btn-submit-login" class="btn-auth-solid-blue">
                LOGIN
              </button>
              <button type="button" id="btn-submit-signup" class="btn-auth-solid-blue">
                SIGN UP
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Bottom Arcade Yellow Footer -->
      <div class="auth-bottom-footer">
        <span class="arcade-yellow-footer">SAVE YOUR JOURNEY <span class="footer-dot">●</span> TRACK YOUR JOURNEY</span>
      </div>
    </div>
  `;

  // Bind Login Submission
  const form = container.querySelector('#fm-login-form');
  const emailInput = container.querySelector('#auth-email-input');
  const passInput = container.querySelector('#auth-password-input');
  const btnLogin = container.querySelector('#btn-submit-login');
  const btnSignUp = container.querySelector('#btn-submit-signup');
  const btnGoogle = container.querySelector('#btn-google-login');
  const linkForgot = container.querySelector('#link-forgot-password');

  const executeLogin = async () => {
    const email = emailInput.value.trim();
    const pass = passInput.value;

    if (!email || !pass) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    try {
      btnLogin.disabled = true;
      btnLogin.textContent = 'LOGGING IN...';
      const user = await firebaseService.signIn(email, pass);
      showToast(`Welcome back, ${user.displayName || user.email}!`);
      store.setAppMode('manager_vault');
    } catch (err) {
      showToast(err.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
      btnLogin.disabled = false;
      btnLogin.textContent = 'LOGIN';
    }
  };

  const executeSignUp = async () => {
    const email = emailInput.value.trim();
    const pass = passInput.value;

    if (!email || !pass) {
      showToast('Please enter email and password to sign up', 'error');
      return;
    }

    if (pass.length < 6) {
      showToast('Password should be at least 6 characters', 'error');
      return;
    }

    try {
      btnSignUp.disabled = true;
      btnSignUp.textContent = 'CREATING ACCOUNT...';
      const user = await firebaseService.signUp(email, pass);
      showToast(`Account created successfully! Welcome, ${user.displayName || user.email}`);
      store.setAppMode('manager_vault');
    } catch (err) {
      showToast(err.message || 'Sign up failed.', 'error');
    } finally {
      btnSignUp.disabled = false;
      btnSignUp.textContent = 'SIGN UP';
    }
  };

  const executeGoogleSignIn = async () => {
    try {
      const user = await firebaseService.signInWithGoogle();
      if (user) {
        showToast(`Signed in with Google as ${user.displayName || user.email}!`);
        store.setAppMode('manager_vault');
      }
    } catch (err) {
      showToast(err.message || 'Google sign-in cancelled or failed.', 'error');
    }
  };

  if (form) form.onsubmit = executeLogin;
  if (btnLogin) btnLogin.onclick = executeLogin;
  if (btnSignUp) btnSignUp.onclick = executeSignUp;
  if (btnGoogle) btnGoogle.onclick = executeGoogleSignIn;

  if (linkForgot) {
    linkForgot.onclick = async (e) => {
      e.preventDefault();
      const email = prompt('Enter your registered email address for password reset:', emailInput.value || '');
      if (email && email.trim()) {
        try {
          await firebaseService.resetPassword(email.trim());
          showToast(`Password reset instructions sent to ${email.trim()}!`);
        } catch (err) {
          showToast(err.message || 'Could not send password reset email.', 'error');
        }
      }
    };
  }
}
