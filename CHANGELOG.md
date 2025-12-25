# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Added new section to the help page with content on how to create and manage custom challenges.
- Added new unit tests for components in the help page.

## [0.0.12] - 2025-12-24

### Added

- Implemented functionality for logged-in users to create their own custom challenges.
- Introduced a "My Challenges" modal where users can view, edit, and delete challenges they have created.
- Refactored the challenge creation modal to handle both new challenge creation and editing existing challenges, dynamically updating its title and pre-filling forms.
- Ensured real-time updates for the challenges list in the randomizer page and "My Challenges" modal after creation, editing, or deletion, without requiring a page refresh.
- Integrated challenges with Firestore, implementing security rules to ensure only the creator can edit or delete their challenges.
- Improved user experience by:
    - Moving "My Challenges" and "Create Challenge" buttons to a dedicated section below the randomizer controls, including a login prompt for logged-out users.
    - Enhancing styling for action buttons (edit/delete) on challenge cards.
    - Improving modal sizing and button styling for consistency.
- All of the changes were included as part of [41e6cd0](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/41e6cd08133ee63903c61b38e2ad75feed2d39c0).
- Updated challenges page to dynamically show "My Challenges" and "Create Challenge" buttons based on auth service events for user login and logout [67a8447](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/67a8447e1d630c16eab971ffcfe12ad2df089a78).

## [0.0.11] - 2025-12-22

### Added

- Added new "Challenge Randomizer" page for generating random sets of challenges. This feature includes:
    - Three generation modes: "All Levels" (one challenge per difficulty level), "Random" (four random challenges), and "Manual" (user selects challenges).
    - A multi-select filter to choose which challenge types (e.g., GENERIC, CAR_PARK, LOBBY_LEVEL) are included in the randomization pool.
    - Individual re-roll buttons for generated challenges (in "All Levels" and "Random" modes) to replace a single challenge with a new one.
    - Responsive layout for manual mode dropdowns and improved styling for challenge details.
    - A Python script to parse CSV challenge data into the required JSON format.
- All of the changes were included as part of [431ff56](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/431ff56bf4f4488cd8735032c598b17039a948fa).
- Added new section to the help page with content on how to use the challenge randomization feature [7bd6e56](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/7bd6e56d0411e91c23246c70d6369efc57c59d21).

## [0.0.10] - 2025-11-28

### Added

- Added new "Randomizer" page that can be used for generating random decks to use for a game. The randomizer has three different modes: simple, mixed, and manual. "Simple" chooses a random deck from a json file and presents that deck to the player. "Mixed" will randomly choose each part of a backrooms deck from one of the premade decks in the json file and present the new combined deck to the player. "Manual" allows a player to choose which part of a deck they want from each of the premade decks in the json file [e6e0c27](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/e6e0c2725c7e38ce2e4d521519407f143c85e437).
- How the randomization works is that each premade deck has an unique name, and we will randomly choose from one of those decks when creating a card pool. Each deck will consist of four parts: items, entites, rooms, and outcomes. Now, when "Simple" mode is used, we grab all four parts of a deck from a single premade deck. When "Mixed" is used, we randomly grab one of the premade decks for each part of the deck, and use those cards for a particular section of the deck. As an example, if I have 3 premade decks: DeckA, DeckB, and DeckC, for the random deck that is created, the items might come from DeckA, the rooms and entities migh come from DeckB, and the outcomes might come from DeckC. The "Manual" mode allows the user to select each one of these options individually [e6e0c27](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/e6e0c2725c7e38ce2e4d521519407f143c85e437).
- New card back image to replace the existing unofficial image that was used [47601a5](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/47601a53ab30d93190772ce0b41c9f8d14e1411e).
- October 2025 Promo Card "Trunk or Treat" [47601a5](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/47601a53ab30d93190772ce0b41c9f8d14e1411e).
- November 2025 Promo Card "Lustratio Latrina" [47601a5](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/47601a53ab30d93190772ce0b41c9f8d14e1411e).
- Aquazone preview cards [47601a5](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/47601a53ab30d93190772ce0b41c9f8d14e1411e).
- Event cards from starter decks [47601a5](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/47601a53ab30d93190772ce0b41c9f8d14e1411e).
- Added unit tests for new components and started adding unit tests to existing components that are modified [5adad99](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/5adad9950c2413ea38fb7f7c4f4bba93b115c41c).
- Added new section to the help page with content on how to use the deck randomization feature [52e0202](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/52e0202e24821bd510688685d98d2864c11777d9).

### Fixed

- Fixed card types in the "promo-cards.json" file so promo cards will load in the correct card type selection [5adad99](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/5adad9950c2413ea38fb7f7c4f4bba93b115c41c).
- Fixed bug in the deck builder page when an invalid deck id is provided, or a deck is not found for the provided id would throw an uncaught error in the app. This also addressed issues when a deck id did not exist in firestore but exists in localstorage for the user. The fix now checks localstorage before making a call to firestore, and if the deck is not found there we treat the id as a new deck [0aea7f2](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/0aea7f2166013f7edd7dd99a6093f47c91a0f0d7).
- Fixed regression with export deck as a file feature [3ff3237](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/3ff32376a0fe4d367560b4eb86cd66bab903c17a).

## [0.0.9] - 2025-11-23

### Added

- August 2025 Promo Card "Phase Plate" [71dfb05](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/71dfb0545fe5a743d560bddda35a0e0faafeca3c).
- Missing card image for Lobby Levels Card 47 "Death Moth" [71dfb05](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/71dfb0545fe5a743d560bddda35a0e0faafeca3c).
- Missing card image for Lobby Levels Card 66 "Space Portal" [71dfb05](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/71dfb0545fe5a743d560bddda35a0e0faafeca3c).
- Added YouTube tutorial videos to the sections on the "Help" page [57caafd](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/57caafd5d4f7a870d913d8fce6c92b42db596420).

### Changed

- Replaced images for the following promo cards to match the default size of the rest of the cards: "C.C.B.B", "Ferdinand", and "Overdrive Marion" [71dfb05](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/71dfb0545fe5a743d560bddda35a0e0faafeca3c).
- Updated workflow files to no longer publish when only changes are to the CI pipeline or Changelog files [9d7bc6c](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/9d7bc6c01546ea4be772b14c0101a920476e1b3b).

## [0.0.8] - 2025-09-07

### Added

- Added new "Help" page with guides on how to create a deck and share a deck with other users [6296a34](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/6296a34328933b6d3113ad2808a9fe92103aff3c).

### Changed

- Updated style on home page to take full width [6296a34](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/6296a34328933b6d3113ad2808a9fe92103aff3c).

## [0.0.7] - 2025-09-01

### Fixed

- Fixed styling on light mode themed pages [eb4cdd5](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/eb4cdd525e28282dbff563066de376655b8eb8c0).
- Fixed local caching of app assets [3c984f9](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/3c984f915e11d487b9fa3f38bcde992980dc9664).

### Added

- Support for PWA (progressive web app) [a8f5b6d](https://github.com/scottwestover/backrooms-tcg-deck-builder/commit/a8f5b6dffe90324fea7552a6b20ced3fe45e5993).

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
