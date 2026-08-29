# Releasing

Releases are prepared by Release Please and published to npm by GitHub Actions. Maintainers do not manually edit package versions, tags, GitHub release notes, or released changelog entries.

## One-time repository setup

1. Create a fine-grained GitHub personal access token that can write repository contents, pull requests, and issues. Save it as the repository Actions secret `RELEASE_PLEASE_TOKEN`. Release Please uses it so its pull request triggers required CI checks; it is not an npm credential.
2. Protect `main` and require the `CI / check` status before merging pull requests.
3. Publish `0.1.0` once from a clean, reviewed `main` checkout with `npm publish --access public`. This bootstrap creates the npm package so trusted publishing can be configured.
4. In the npm settings for `@minmoto/payment-channels`, add a GitHub Actions trusted publisher with organization `minmoto`, repository `payment-channels`, workflow filename `release.yml`, and permission to run `npm publish`.
5. After trusted publishing succeeds, set npm publishing access to require 2FA and disallow token-based publishing.

The bootstrap publish is needed only while the package does not yet exist in the npm registry. Do not add an npm automation token to GitHub for normal releases.

## Preparing a release

Merge changes to `main` using Conventional Commit subjects:

- `fix: ...` requests a patch release.
- `feat: ...` requests a minor release.
- `feat!: ...`, `fix!: ...`, or a `BREAKING CHANGE:` footer requests a breaking release. While the package is below `1.0.0`, Release Please advances the minor version instead of creating `1.0.0`, for example from `0.2.0` to `0.3.0`.
- `docs:`, `test:`, `build:`, `ci:`, and `chore:` changes do not request a release by themselves.

Creating the first major version requires a deliberate, reviewed change to the pre-major versioning policy in `release-please-config.json`. Do not merge a release pull request proposing `1.0.0` while that policy is active.

`npm install` and `npm ci` automatically enable the local `commit-msg` hook. Pull request CI validates every commit subject even when dependencies have not been installed or a local hook is bypassed.

Release Please opens or updates a release pull request. That pull request contains the next version in `package.json` and `package-lock.json`, plus a generated entry in `CHANGELOG.md`. Review the proposed version and changelog as the declaration of what the release contains.

## Publishing

Merge the Release Please pull request when it is ready. The `Release` workflow then:

1. Creates the `v<version>` tag and GitHub release.
2. Checks out the exact tagged revision.
3. Installs dependencies with `npm ci`.
4. Runs `npm publish --access public`; the `prepack` hook performs the complete check suite first.
5. Authenticates through short-lived npm OIDC credentials and records npm provenance.

If publication fails, do not move or recreate the tag. Fix the workflow or npm trusted-publisher configuration, then rerun the failed workflow job. npm rejects an attempt to overwrite an already published version.
