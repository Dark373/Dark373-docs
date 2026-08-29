# 2026 Changelog

<div class="f1-changelog" markdown="1">

<div class="f1-release" markdown="1">

<div class="f1-release-head">
<span class="f1-release-version">v1.0</span>
<span class="f1-release-badge f1-release-badge--latest">Latest</span>
<span class="f1-release-date">1 Sept 2026</span>
</div>

- Main release is published

</div>

<div class="f1-release" markdown="1">

<div class="f1-release-head">
<span class="f1-release-version">v1.3.1 - hotfix</span>
<span class="f1-release-date">6 Aug 2026</span>
</div>

- Fixed the Statistics stint label showing the team name instead of the stint percentage, and its colour not matching the driver's team
- Removed a leftover, non-functional avatar column from the Statistics Driver Season and Driver Session renders
- Fixed the pole position badge on media session results duplicating the fastest lap badge instead of showing its own
- Fixed driver avatars not showing a driver's custom image in two more places
- Fixed a version mismatch on the Qualifying Results "The Grid" render
- Added missing text for every render introduced in v1.3.0

</div>

<div class="f1-release" markdown="1">

<div class="f1-release-head">
<span class="f1-release-version">v1.3.0</span>
<span class="f1-release-date">5 Aug 2026</span>
</div>

- Added "Penalty Driver" and "Penalty Event" renders — FIA-style penalty documents
- Added "Race Results Media", "Qualifying Results The Grid", and "Race Results The Grid" renders
- Added "Qualifying Fastest Top 3" and "Race Fastest Top 3" renders
- Added Media Constructors' and Drivers' Championship standings renders, each with a progress-standings variant
- Added a per-session Driver Statistics render
- The Constructors Champion render now also supports 3 and 4 driver team lineups
- Consolidated driver-name rendering across the whole theme onto shared components
- Driver names are now driven automatically by the app's own per-league display name template — the old manual naming-convention option is gone
- Renamed "Race Results" to "Race Results Broadcast"; its background is now reused by the new Fastest Top 3 renders
- Reworked Session Pole's background
- Spacing, positioning, and name-rendering polish on Qualifying Results, Tyre Strategy, Front Row, Variable Information, Drivers Champion/Championship, and Teammates Individual
- Added customisable penalty date formats
- Added FIA and championship logos, new sprint-weekend/media background assets, and the Aston Martin 2026 team logo (both variants)
- Removed the outdated Haas 2026 light team logo
- Fixed data not passing through correctly on the new penalty renders
- Fixed a driver-name colour bug on the Constructors Champion render

</div>

<div class="f1-release" markdown="1">

<div class="f1-release-head">
<span class="f1-release-version">Beta 1.2.1 - Hotfix</span>
<span class="f1-release-badge f1-release-badge--pre">Pre-release</span>
</div>

- Fixed the team logo duplicating in "Team Logo" avatar mode; the background team logo is now hidden outside Driver Avatar mode
- Fixed Session Pole's league logo positioning
- Removed an unused, disabled gradient overlay on Session Pole
- Fixed Session Pole's text gradient using the wrong colour variable
- Session Variable Information's background gradient now colourises by default using the secondary colour
- Session Variable Information's Custom Colour option now sets the team secondary colour directly, instead of just toggling colourise
- Added Light mode support to Session Variable Information's background
- Centre-aligned Session Variable Information's subtext
- More consistent subtext spacing on Session Variable Information
- Fixed a "variable name not specified" error on the Drivers'/Constructors' Championship standings when Coloured Position Text is enabled, and gave the position-change column a default font colour

</div>

<div class="f1-release" markdown="1">

<div class="f1-release-head">
<span class="f1-release-version">Beta 1.2</span>
<span class="f1-release-badge f1-release-badge--pre">Pre-release</span>
<span class="f1-release-date">17 Jul 2026</span>
</div>

- Added Standings Drivers Champion render
- Added a Variable Information render (Winner/Podium/Fastest/DOTD/Best Moment/Position)
- Added Deep Ratings Driver and Deep Ratings Season renders
- Added Session Front Row, Session Pole, and Session Tyre Strategy renders
- Added Statistics Driver Season render
- Added Teammates Individual render
- The Deep Ratings change indicator now shows "=" instead of a gap when nothing changed
- The broadcast results subheader width is now configurable per layout
- Updated the broadcast avatar, media results, statistics, and broadcast results styles
- Updated the driver name fallback logic
- Added pole time to the top-left of the render
- Added 2026-season backgrounds
- Added a "best moment" option to the Variable Information render, with custom naming and sizing
- Added missing render headers and head-to-head statistics text
- Fixed a "cannot resolve to a number" error on Most Laps Led and DOTD in Variable Information
- Fixed the rating-change indicator leaving a large gap when there was nothing to show
- Fixed several broken data bindings across results and standings renders
- Fixed a wrong data reference on Statistics Driver Season
- Fixed a duplicate trigger on Session Pole
- Fixed a naming bug on the Tyre Strategy render
- Fixed formatting and description typos in the theme's config files
- Various other minor fixes

</div>

<div class="f1-release" markdown="1">

<div class="f1-release-head">
<span class="f1-release-version">Beta 1.1</span>
<span class="f1-release-badge f1-release-badge--pre">Pre-release</span>
<span class="f1-release-date">20 Jun 2026</span>
</div>

- Added a team-limit theme option
- Fixed driver numbers not persisting on driver standings
- Fixed the tyre stint text's font colour
- Added a coloured position-change option
- Added a colourised league logo option
- Added a logo-sizing option
- Fixed non-functional custom avatars on the line-up render
- Added footer points info
- Fixed the reserve logo rendering when no team is defined
- Fixed fastest-lap tyre margins on qualifying results
- Removed the lap-count number on fastest-lap tyres on qualifying results
- Fixed stint-column alignment on race results
- Added a best-moment footer to the race results render, with a public option to show it
- Fixed driver naming conventions on the line-up render
- Added the Fastest Sector qualifying render
- Added the Circuit Data race render
- Added standings progress on driver standings
- Added standings progress on team standings
- The team standings avatar now reflects the leading driver
- Resized George's avatar

</div>

<div class="f1-release" markdown="1">

<div class="f1-release-head">
<span class="f1-release-version">Beta 1</span>
<span class="f1-release-badge f1-release-badge--pre">Pre-release</span>
<span class="f1-release-date">8 Jun 2026</span>
</div>

- Initial public beta — 5 renders, feedback requested on the reworked theme options and database compatibility
- Resized every render and adjusted sizing/margins throughout
- Added a 3-tier colour scheme for the top 3
- Reworked theme options into subcategories
- Colour scheme now follows the season colour instead of the category colour
- Podium banner colour (P1/P2/P3) is now controlled by the season colour
- Banner font colour now reflects the season's tertiary colour
- Avatar display no longer shifts to fill the space when there's no avatar image
- Added a gradient property for the avatar layer mask
- Reworked the driver name elements on the avatar display
- Moved the circuit name into the header, to reflect real life
- Avatar data can now be switched from winner to fastest lap, etc.
- New API additions expand the data available on driver standings
- Avatar display now shows every driver in a team at once on team standings
- Added an outline font, contributed by @lilracer1
- Line-up now supports up to 4 drivers per team
- Added livery support to the line-up render
- Line-up now auto-calculates from the database
- Various other tweaks

</div>

</div>

<div class="checker-divider"></div>

## Support {: .f1-heading }

--8<-- "buttons-2026.md"
