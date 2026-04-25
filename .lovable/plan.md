Implement Google login/signup and a real authenticated dashboard while keeping the existing public landing page and demo intact.

1. Enable app authentication flow
- Add Supabase/Lovable Cloud client integration if it is not already present.
- Configure Google OAuth sign-in using the standard auth flow.
- Replace the current landing-page placeholder `Login` and `Sign up` sections with functional Google account actions.
- After successful sign-in, route users to a new authenticated page.

2. Add secure user profiles
- Create a `profiles` table linked to `auth.users(id)` with `ON DELETE CASCADE`.
- Store basic profile fields such as display name, avatar URL, email, created/updated timestamps.
- Add Row Level Security policies so users can only read and update their own profile.
- Add a signup trigger to automatically create/update the profile from Google OAuth metadata.
- Keep roles out of the profile table; no admin roles are needed for this request.

3. Add authenticated routes and session handling
- Add an auth context/provider that listens to `onAuthStateChange` before checking the current session.
- Add protected routing for logged-in pages.
- Add routes such as:

```text
/              Public landing page
/demo          Public demo dashboard
/app           Logged-in real study dashboard
```

- Redirect unauthenticated users who visit `/app` back to the landing/login area.
- Redirect signed-in users from login/signup actions into `/app`.

4. Build the logged-in real study dashboard
- Reuse the current Academic Command Center visual style, but remove demo language.
- Use the signed-in user's Google name/avatar where available.
- Keep the current study dashboard content as starter/sample data for now, but present it as the user's workspace rather than the public demo.
- Add account controls in the header: user avatar/name and `Sign out`.
- Keep demo navigation and `Exit demo` behavior unchanged for `/demo`.

5. Landing page updates
- Change `Login` and `Sign up` buttons to open/start Google authentication instead of scrolling to placeholders.
- Keep `Try demo` pointing to `/demo`.
- Replace placeholder login/signup copy with a concise authentication panel or remove it if redundant.

6. Technical details
- Add `@supabase/supabase-js` if needed.
- Add generated Supabase client/types files if Lovable Cloud setup creates them.
- Update `src/App.tsx` for auth provider and protected routes.
- Refactor `src/pages/Index.tsx` only as needed, preserving the current styling system.
- Add any new auth/dashboard components in `src/components` or `src/pages` to keep the large page file manageable.
- Run TypeScript/build validation after implementation.