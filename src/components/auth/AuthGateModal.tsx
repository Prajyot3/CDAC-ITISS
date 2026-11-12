/**
 * Backwards-compatible re-export.
 *
 * The authentication gate used to be a modal layered on top of a fully rendered app.
 * It is now a top-level gate that wraps the app tree, so unauthenticated users never
 * mount the protected views at all. Import `AuthGate` from `./AuthGate` instead.
 */
export { AuthGate, AuthGateModal, default } from './AuthGate';
