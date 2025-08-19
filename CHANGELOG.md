# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

- No changes.

## [0.0.6] - 2025-08-19

### Fixed

- Fixed bug with copy link that is generated when you attempt to copy the link for a deck from your profile page. The new link will only use the deckId instead of the generated userId and deckId combination [e56cb27](https://github.com/scottwestover/backrooms-tcg-deck-builder/pull/36/commits/e56cb27349acdb847609cec5ed901843f93e1a07).

## [0.0.5] - 2025-08-18

### Added

- June 2025 Promo Card "C.C.B.B" [5f2daa1](https://github.com/scottwestover/backrooms-tcg-deck-builder/pull/34/commits/5f2daa19d99f5a6b296dd6fa1d50d6dd0dea6ccf).
- July 2025 Promo Card "Ferdinand" [5f2daa1](https://github.com/scottwestover/backrooms-tcg-deck-builder/pull/34/commits/5f2daa19d99f5a6b296dd6fa1d50d6dd0dea6ccf).
- September 2025 Promo Card "Overdrive Marion" [5f2daa1](https://github.com/scottwestover/backrooms-tcg-deck-builder/pull/34/commits/5f2daa19d99f5a6b296dd6fa1d50d6dd0dea6ccf).

### Fixed

- Fixed bug with deleting decks not removing those decks from the database. [c2886f3](https://github.com/scottwestover/backrooms-tcg-deck-builder/pull/34/commits/c2886f354f58c43809e3667de848adaa74b6310e)
- Fixed bug tied to saving changes to a deck were the confirmation modal would automatically open on the profile deck view page. [c2886f3](https://github.com/scottwestover/backrooms-tcg-deck-builder/pull/34/commits/c2886f354f58c43809e3667de848adaa74b6310e)
- Fixed bug tied to permissions for deleting decks from the database. [c2886f3](https://github.com/scottwestover/backrooms-tcg-deck-builder/pull/34/commits/c2886f354f58c43809e3667de848adaa74b6310e)
- Fixed a bug when you attempt to open a deck that does not belong to you. [c2886f3](https://github.com/scottwestover/backrooms-tcg-deck-builder/pull/34/commits/c2886f354f58c43809e3667de848adaa74b6310e)

## [0.0.4] - 2025-08-18

### Added

- Added sentry integration for catching and notifying about errors.

## [0.0.3] - 2025-05-01

### Added

- GitHub workflows for automated deployments to Firebase hosting.
- April 2025 Promo Card "Chicane".

## [0.0.2] - 2025-04-26

### Added

- Promo card data, and support for filtering by promo card status.
- Created changelog.

## [0.0.1] - 2025-04-08

### Added

- Initial app released. Includes deckbuilder, collection tracking, sharing decks, and importing/exporting decks.
- Google Auth and Firebase integration for storing using data.
