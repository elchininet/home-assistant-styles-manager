# Changelog

## [4.1.0] - 2026-03-29

- Migrated to `TypeScript 6`, so the target of the library is now `es6` instead of the previous `es5`
- Some refactors have been needed to make the project compatible with `TypeScript 6` but they should not affect the functionality of the plugin

## [4.0.0] - 2026-03-28

- `getCSSString` has been removed because it was redundant, `getCSSRulesString` can parse both, `CSS-in-JS` objects and regular rule objects
- Add support for nested `CSS`, useful for nested rules or media-queries

## [3.1.0] - 2024-11-24

- Allow to send an array of CSS in JS objects and strings

## [3.0.0] - 2024-11-07

- New option to avoid throwing warnings
- Restore the warning when a style element is not present in the `removeStyle` method

## [2.0.0] - 2024-11-07

- Do not throw warnings if the element doesn't have a style element in the `removeStyle` method

## [1.1.1] - 2024-11-07

- Export the `getCSSRulesString` and `getCSSString` utilities

## [1.1.0] - 2024-11-07

- The method `addStyle` now also accepts an array of CSS-in-JS objects

## [1.0.0] - 2024-11-06

- Release of `home-assistant-styles-manager`