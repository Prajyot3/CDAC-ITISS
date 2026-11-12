import React, { useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/react/legacy';
import { isClerkAPIResponseError } from '@clerk/react/errors';
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-react';

type View = 'sign-in' | 'sign-up' | 'forgot';
type Step =
  | 'credentials'
  | 'second-factor'
  | 'client-trust'
  | 'verify-email'
  | 'reset-code'
  | 'new-password';

const MIN_PASSWORD_LENGTH = 8;

function clerkErrorMessage(error: unknown): string {
  if (isClerkAPIResponseError(error)) {
    const first = error.errors?.[0];
    return first?.longMessage || first?.message || 'Authentication failed. Please try again.';
  }
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong. Please try again.';
}

const fieldClass =
  'w-full rounded-lg bg-[#0C1014] border border-[#243240] px-3.5 py-2.5 text-sm text-white ' +
  'placeholder:text-[#556372] outline-none transition-colors focus:border-[#76B900] ' +
  'focus:ring-2 focus:ring-[#76B900]/20 disabled:opacity-60';

const labelClass = 'block text-[11px] font-mono uppercase tracking-wider text-[#8C98A6] mb-1.5';

const primaryButtonClass =
  'w-full flex items-center justify-center gap-2 rounded-lg bg-[#76B900] px-4 py-2.5 text-sm ' +
  'font-bold text-black transition-colors hover:bg-[#68a500] disabled:cursor-not-allowed disabled:opacity-60';

const linkButtonClass =
  'text-[11px] font-medium text-[#76B900] hover:text-[#88d100] transition-colors';

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  error?: boolean;
}

const Field: React.FC<FieldProps> = ({ label, icon, error, id, ...rest }) => (
  <div>
    <label className={labelClass} htmlFor={id}>
      {label}
    </label>
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#637282]">
        {icon}
      </span>
      <input
        id={id}
        className={`${fieldClass} pl-9 ${error ? 'border-red-500/60' : ''}`}
        aria-invalid={error || undefined}
        {...rest}
      />
    </div>
  </div>
);

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder?: string;
  error?: boolean;
  show: boolean;
  onToggle: () => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  error,
  show,
  onToggle,
}) => (
  <div>
    <label className={labelClass} htmlFor={id}>
      {label}
    </label>
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#637282]">
        <Lock className="w-4 h-4" />
      </span>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={event => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`${fieldClass} pl-9 pr-10 ${error ? 'border-red-500/60' : ''}`}
        aria-invalid={error || undefined}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#637282] hover:text-[#A2AFBD] transition-colors"
        tabIndex={-1}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  </div>
);

const ErrorBanner: React.FC<{ message: string | null }> = ({ message }) =>
  message ? (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-[12px] leading-relaxed text-red-200"
    >
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{message}</span>
    </div>
  ) : null;

/**
 * Custom, minimal credential UI on top of Clerk's headless sign-in / sign-up resources.
 * Supports: password sign-in (email or username), e-mail-code second factor, e-mail
 * verification on sign-up, and the password-reset code flow.
 */
export const SimpleAuthForm: React.FC = () => {
  const signInHook = useSignIn();
  const signUpHook = useSignUp();

  // The legacy hooks expose a discriminated union; narrow it once so the
  // resources are non-null inside the handlers below.
  const signIn = signInHook.isLoaded ? signInHook.signIn : null;
  const setActive = signInHook.isLoaded ? signInHook.setActive : null;
  const signUp = signUpHook.isLoaded ? signUpHook.signUp : null;
  const setSignUpActive = signUpHook.isLoaded ? signUpHook.setActive : null;

  const [view, setView] = useState<View>('sign-in');
  const [step, setStep] = useState<Step>('credentials');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // credentials
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // verification codes / new password
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pendingIdentifier, setPendingIdentifier] = useState('');

  const resetMessages = () => {
    setError(null);
    setNotice(null);
  };

  const switchView = (next: View) => {
    setView(next);
    setStep('credentials');
    setCode('');
    setNewPassword('');
    resetMessages();
  };

  const finish = async (sessionId: string | null) => {
    if (!sessionId) {
      setError('Sign-in finished without a session. Please try again.');
      return;
    }
    if (!setActive) {
      setError('Your session could not be activated. Please reload the page.');
      return;
    }
    setStep('credentials');
    await setActive({ session: sessionId });
  };

  /* ----------------------------- sign in ----------------------------- */

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!signIn || busy) return;
    resetMessages();
    if (!identifier.trim() || !password) {
      setError('Enter your email or username and your password.');
      return;
    }
    setBusy(true);
    try {
      const attempt = await signIn.create({
        identifier: identifier.trim(),
        password,
      });

      if (attempt.status === 'complete') {
        await finish(attempt.createdSessionId);
        return;
      }

      if (attempt.status === 'needs_second_factor') {
        const emailFactor = attempt.supportedSecondFactors?.find(
          factor => factor.strategy === 'email_code',
        );
        if (emailFactor) {
          await signIn.prepareSecondFactor({ strategy: 'email_code' });
          setNotice('We emailed you a verification code.');
        }
        setStep('second-factor');
        return;
      }

      if (attempt.status === 'needs_client_trust') {
        const emailFactor = attempt.supportedFirstFactors?.find(
          factor => factor.strategy === 'email_code' && 'emailAddressId' in factor,
        );
        if (emailFactor && 'emailAddressId' in emailFactor) {
          await signIn.prepareFirstFactor({
            strategy: 'email_code',
            emailAddressId: emailFactor.emailAddressId,
          });
          setPendingIdentifier(emailFactor.emailAddressId);
        }
        setNotice('New device detected — we emailed you a verification code.');
        setStep('client-trust');
        return;
      }

      if (attempt.status === 'needs_new_password') {
        setStep('new-password');
        return;
      }

      setError(
        `Your account needs another verification step (${attempt.status ?? 'unknown'}). ` +
          'Please continue in the Clerk account portal.',
      );
    } catch (err) {
      setError(clerkErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSecondFactor = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!signIn || busy) return;
    resetMessages();
    if (!code.trim()) {
      setError('Enter the verification code we sent you.');
      return;
    }
    setBusy(true);
    try {
      const attempt = await signIn.attemptSecondFactor({
        strategy: 'email_code',
        code: code.trim(),
      });
      if (attempt.status === 'complete') {
        await finish(attempt.createdSessionId);
      } else {
        setError('That code was not accepted. Request a new one and try again.');
      }
    } catch (err) {
      setError(clerkErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleClientTrust = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!signIn || busy) return;
    resetMessages();
    if (!code.trim()) {
      setError('Enter the verification code from your email.');
      return;
    }
    setBusy(true);
    try {
      const attempt = await signIn.attemptFirstFactor({
        strategy: 'email_code',
        code: code.trim(),
      });
      if (attempt.status === 'complete') {
        await finish(attempt.createdSessionId);
      } else {
        setError('That code was not accepted. Request a new one and try again.');
      }
    } catch (err) {
      setError(clerkErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  /* -------------------------- create account ------------------------- */
  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!signUp || busy) return;
    resetMessages();
    if (!email.trim()) {
      setError('Enter your email address.');
      return;
    }
    if (signUpPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    setBusy(true);
    try {
      const attempt = await signUp.create({
        emailAddress: email.trim(),
        password: signUpPassword,
      });

      // Names are optional and some instances reject them on create; try an update
      // and ignore failures so sign-up is never blocked by a profile field.
      if (firstName.trim() || lastName.trim()) {
        try {
          await signUp.update({
            ...(firstName.trim() ? { firstName: firstName.trim() } : {}),
            ...(lastName.trim() ? { lastName: lastName.trim() } : {}),
          });
        } catch {
          /* profile fields are optional */
        }
      }

      if (attempt.status === 'complete') {
        if (!attempt.createdSessionId) {
          setError('Account created but the session could not be started. Please sign in.');
          setView('sign-in');
          return;
        }
        if (!setSignUpActive) {
          setError('Your session could not be activated. Please sign in.');
          setView('sign-in');
          return;
        }
        await setSignUpActive({ session: attempt.createdSessionId });
        return;
      }

      if (attempt.unverifiedFields?.includes('email_address')) {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setPendingIdentifier(email.trim());
        setNotice(`We sent a 6-digit code to ${email.trim()}.`);
        setStep('verify-email');
        return;
      }

      const missing = attempt.missingFields?.join(', ');
      setError(
        missing
          ? `Additional information is required: ${missing}.`
          : 'Sign-up could not be completed. Please try again.',
      );
    } catch (err) {
      setError(clerkErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!signUp || busy) return;
    resetMessages();
    if (!code.trim()) {
      setError('Enter the 6-digit code from your email.');
      return;
    }
    setBusy(true);
    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (attempt.status === 'complete' && attempt.createdSessionId && setSignUpActive) {
        await setSignUpActive({ session: attempt.createdSessionId });
      } else {
        setError('That code was not accepted. Check your inbox and try again.');
      }
    } catch (err) {
      setError(clerkErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  /* -------------------------- forgot password ------------------------ */

  const handleRequestReset = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!signIn || busy) return;
    resetMessages();
    if (!identifier.trim()) {
      setError('Enter the email or username on your account.');
      return;
    }
    setBusy(true);
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: identifier.trim(),
      });
      setPendingIdentifier(identifier.trim());
      setNotice('Check your inbox for a password reset code.');
      setStep('reset-code');
    } catch (err) {
      setError(clerkErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleResetCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!signIn || busy) return;
    resetMessages();
    if (!code.trim()) {
      setError('Enter the reset code from your email.');
      return;
    }
    setBusy(true);
    try {
      const attempt = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
      });
      if (attempt.status === 'needs_new_password') {
        setStep('new-password');
        setNotice('Choose a new password for your account.');
      } else {
        setError('That reset code was not accepted. Request a new one.');
      }
    } catch (err) {
      setError(clerkErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleNewPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!signIn || busy) return;
    resetMessages();
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    setBusy(true);
    try {
      const attempt = await signIn.resetPassword({ password: newPassword });
      if (attempt.status === 'complete') {
        await finish(attempt.createdSessionId);
      } else {
        setError('The password could not be updated. Please try again.');
      }
    } catch (err) {
      setError(clerkErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  /* -------------------------------- view ----------------------------- */

  const busyLabel = (label: string) => (
    <>
      {busy && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>{label}</span>
    </>
  );

  return (
    <div className="w-full">
      {/* Sign in / Create account switch (credentials step only) */}
      {step === 'credentials' && view !== 'forgot' && (
        <div className="mb-5 flex items-center gap-1 rounded-xl border border-[#232F3D] bg-[#121820] p-1">
          <button
            type="button"
            onClick={() => switchView('sign-in')}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              view === 'sign-in'
                ? 'border border-[#76B900]/40 bg-[#1D2733] text-[#76B900] shadow-sm'
                : 'text-[#8C98A6] hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchView('sign-up')}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              view === 'sign-up'
                ? 'border border-[#76B900]/40 bg-[#1D2733] text-[#76B900] shadow-sm'
                : 'text-[#8C98A6] hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>
      )}

      <ErrorBanner message={error} />

      {notice && !error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-[#76B900]/30 bg-[#76B900]/10 px-3 py-2.5 text-[12px] leading-relaxed text-[#B9E36B]">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* ---------------------------- sign in ---------------------------- */}
      {view === 'sign-in' && step === 'credentials' && (
        <form onSubmit={handleSignIn} className="space-y-4">
          <Field
            id="identifier"
            label="Email or username"
            icon={<User className="h-4 w-4" />}
            value={identifier}
            onChange={event => setIdentifier(event.target.value)}
            autoComplete="username"
            placeholder="you@example.com"
            autoFocus
          />
          <PasswordField
            id="password"
            label="Password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            placeholder="Your password"
            show={showPassword}
            onToggle={() => setShowPassword(prev => !prev)}
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#556372] font-mono">
              Session protected by Clerk
            </span>
            <button
              type="button"
              className={linkButtonClass}
              onClick={() => {
                switchView('forgot');
              }}
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" disabled={busy} className={primaryButtonClass}>
            {busyLabel('Sign in')}
          </button>
        </form>
      )}

      {view === 'sign-in' && step === 'second-factor' && (
        <form onSubmit={handleSecondFactor} className="space-y-4">
          <Field
            id="second-factor"
            label="Verification code"
            icon={<Mail className="h-4 w-4" />}
            value={code}
            onChange={event => setCode(event.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            maxLength={6}
            autoFocus
          />
          <p className="text-[11px] text-[#718092]">
            A 6-digit code was sent to the email on {pendingIdentifier || 'your account'}.
          </p>
          <button type="submit" disabled={busy} className={primaryButtonClass}>
            {busyLabel('Verify & sign in')}
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-[11px] text-[#8C98A6] hover:text-white transition-colors"
            onClick={() => {
              setStep('credentials');
              setCode('');
              resetMessages();
            }}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </button>
        </form>
      )}

      {view === 'sign-in' && step === 'client-trust' && (
        <form onSubmit={handleClientTrust} className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white">Confirm this device</h2>
            <p className="mt-1 text-[11px] text-[#8C98A6]">
              For your security, sign-in from a new device needs the 6-digit code we just emailed
              you.
            </p>
          </div>
          <Field
            id="client-trust-code"
            label="Verification code"
            icon={<Mail className="h-4 w-4" />}
            value={code}
            onChange={event => setCode(event.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            maxLength={6}
            autoFocus
          />
          <button type="submit" disabled={busy} className={primaryButtonClass}>
            {busyLabel('Verify & sign in')}
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-[11px] text-[#8C98A6] hover:text-white transition-colors"
            onClick={() => {
              setStep('credentials');
              setCode('');
              resetMessages();
            }}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </button>
        </form>
      )}

      {/* ------------------------- create account ------------------------ */}
      {view === 'sign-up' && step === 'credentials' && (
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field
              id="first-name"
              label="First name"
              icon={<User className="h-4 w-4" />}
              value={firstName}
              onChange={event => setFirstName(event.target.value)}
              autoComplete="given-name"
              placeholder="Prajyot"
            />
            <Field
              id="last-name"
              label="Last name"
              icon={<User className="h-4 w-4" />}
              value={lastName}
              onChange={event => setLastName(event.target.value)}
              autoComplete="family-name"
              placeholder="Pujari"
            />
          </div>
          <Field
            id="signup-email"
            label="Email"
            type="email"
            icon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={event => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
          />
          <PasswordField
            id="signup-password"
            label="Password"
            value={signUpPassword}
            onChange={setSignUpPassword}
            autoComplete="new-password"
            placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
            show={showPassword}
            onToggle={() => setShowPassword(prev => !prev)}
          />
          <p className="text-[11px] text-[#556372] font-mono">
            You will verify this address with a 6-digit email code.
          </p>
          <button type="submit" disabled={busy} className={primaryButtonClass}>
            {busyLabel('Create account')}
          </button>
        </form>
      )}

      {view === 'sign-up' && step === 'verify-email' && (
        <form onSubmit={handleVerifyEmail} className="space-y-4">
          <Field
            id="verify-code"
            label="Verification code"
            icon={<Mail className="h-4 w-4" />}
            value={code}
            onChange={event => setCode(event.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            maxLength={6}
            autoFocus
          />
          <p className="text-[11px] text-[#718092]">
            Enter the 6-digit code sent to {pendingIdentifier || email}.
          </p>
          <button type="submit" disabled={busy} className={primaryButtonClass}>
            {busyLabel('Verify email')}
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-[11px] text-[#8C98A6] hover:text-white transition-colors"
            onClick={() => {
              setStep('credentials');
              setCode('');
              resetMessages();
            }}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Change details
          </button>
        </form>
      )}

      {/* -------------------------- forgot password ---------------------- */}
      {view === 'forgot' && step === 'credentials' && (
        <form onSubmit={handleRequestReset} className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white">Reset your password</h2>
            <p className="mt-1 text-[11px] text-[#8C98A6]">
              We will email you a code to set a new password.
            </p>
          </div>
          <Field
            id="reset-identifier"
            label="Email or username"
            icon={<User className="h-4 w-4" />}
            value={identifier}
            onChange={event => setIdentifier(event.target.value)}
            autoComplete="username"
            placeholder="you@example.com"
            autoFocus
          />
          <button type="submit" disabled={busy} className={primaryButtonClass}>
            {busyLabel('Send reset code')}
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-[11px] text-[#8C98A6] hover:text-white transition-colors"
            onClick={() => switchView('sign-in')}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </button>
        </form>
      )}

      {view === 'forgot' && step === 'reset-code' && (
        <form onSubmit={handleResetCode} className="space-y-4">
          <Field
            id="reset-code"
            label="Reset code"
            icon={<Mail className="h-4 w-4" />}
            value={code}
            onChange={event => setCode(event.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            maxLength={6}
            autoFocus
          />
          <button type="submit" disabled={busy} className={primaryButtonClass}>
            {busyLabel('Verify code')}
          </button>
        </form>
      )}

      {view === 'forgot' && step === 'new-password' && (
        <form onSubmit={handleNewPassword} className="space-y-4">
          <PasswordField
            id="new-password"
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            autoComplete="new-password"
            placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
            show={showPassword}
            onToggle={() => setShowPassword(prev => !prev)}
          />
          <button type="submit" disabled={busy} className={primaryButtonClass}>
            {busyLabel('Set new password')}
          </button>
        </form>
      )}

      <p className="mt-5 text-center text-[11px] leading-relaxed text-[#556372] font-mono">
        By continuing you agree to the CDAC ITISS academy terms.
      </p>
    </div>
  );
};

export default SimpleAuthForm;
