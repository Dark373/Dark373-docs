# 2026 Setup

Most of this theme is controlled from RLT's own UI. A few effects go
further and read or edit the theme's own files directly: those sections
are marked and kept separate below.

## Customising the Theme {: .f1-heading }

### Public Properties (no JSON editing required)

In RLT: **Season → Theme Settings → Properties**. Changes apply on the
next render.

| Property | Type | What it does |
| --- | --- | --- |
| `BackgroundColour` | Enum | Overall style: Dark / Grey / Light / Purple / Custom Colour / No Background |
| `BackgroundVariant` | Enum | Which background texture file loads; swap backgrounds without changing colour mode |
| `ThemeCategory` | String | League category whose data is shown on multi-category overlays |
| `PosJumpColour` | Bool | Enables coloured +/− position-change indicators |
| `LeagueLogoColorised` | Bool | Tints the championship logo to match the theme accent |
| `LogoSize` | Integer | Pixel height of the league logo in the broadcast header |
| `CustomTyreImages` | Bool | Use custom tyre compound images (see Custom Tyre Images below) |

## Custom Colour Mode {: .f1-heading }

Setting `BackgroundColour` to **Custom Colour** moves the theme off its
built-in palette and onto real colour values instead. Which record it
reads from, the season or the team, depends on the specific layout
being rendered: season-wide renders (standings, calendar, and similar)
pull from the season, while per-team and per-driver renders pull from
that driver's team. Either way it's the same three fields underneath.

No JSON edits required: the mapping is handled by the
`globals/global_vars.json` entries covered in Deeper Edits below.

**Season colours**, set in RLT: **Season Settings → Colours**

| Season field | Role | Typical value |
| --- | --- | --- |
| `Color` | Main background / panel fill | Team primary brand colour |
| `SecondaryColor` | Secondary accents, gradient layers | Team secondary colour |
| `TertiaryColor` | Foreground text, labels, icon tints | High-contrast value, usually `#FFFFFF` or `#0F1017` |

**Team colours**, set in RLT: **Database → Team tab**, per team

| Team field | Role | Typical value |
| --- | --- | --- |
| `Color` | Main background / panel fill | Team primary brand colour |
| `SecondaryColor` | Secondary accents, gradient layers | Team secondary colour |
| `TertiaryColor` | Foreground text, labels, icon tints | High-contrast value, usually `#FFFFFF` or `#0F1017` |

`TertiaryColor` must be readable on top of `Color`, so pick white or
near-black unless your primary is a very pale hue. This applies
whichever source a given layout draws from.

??? note "Light & Dark Team Logo Variants"
    The theme loads two logo variants per team and switches between them
    based on the rendering surface. RLT picks variants by appending
    `__variantname` (double underscore) to the base filename.

    **Naming**

    The base filename comes from the team's Name or UniqueId in RLT,
    with dots and spaces replaced by underscores. Matching is
    case-insensitive.

    ```text
    images/logotypes/teams/
      red_bull_racing.png          # default / fallback
      red_bull_racing__light.png   # used on dark backgrounds
      red_bull_racing__dark.png    # used on light backgrounds
    ```

    **Where to place files**

    - `images/logotypes/teams/`: bundled with the theme, overwritten on
      theme updates
    - `user/images/logotypes/teams/`: recommended for your own logos,
      takes priority over the theme folder and survives updates

    RLT searches recursively (subdirectories are fine) and picks the
    most specific match. No duplicate filenames within the same
    hierarchy.

??? note "Championship & Other Logo Variants"
    The same `__variantname` convention applies to every logotype
    category. This theme requires:

    | Category | Variants required | Used where |
    | --- | --- | --- |
    | Team | `light`, `dark` | Standings, results, statistics rows |
    | Track | `alternative` | Circuit graphics, track statistics |
    | Nation | `alternative` | Driver nationality flags |
    | Championship | `dark` | Broadcast header |

    **Folder paths (user override recommended)**

    ```text
    user/images/logotypes/championships/   myleague__dark.png
    user/images/logotypes/circuits/        monza__alternative.png
    user/images/flags/                     gb__alternative.png
    ```

    If a variant file is missing, RLT falls back to the default.
    Fallback and override behaviour is configured in
    `theme_description.json` via `LogotypeBehaviours`.

    !!! tip
        The `LeagueLogoColorised` property (above) controls whether the
        championship logo is tinted to match the theme accent. Disable
        it if using a full-colour logo.

??? note "Custom Tyre Images"
    **Step 1: Enable.** In RLT Theme Settings, set `CustomTyreImages`
    to true.

    **Step 2: Add files.** Place PNG images in `user/images/tyres/`
    (or `images/tyres/` inside the theme folder). Filenames must
    exactly match the `TyresType` compound names; capitalisation
    matters:

    ```text
    user/images/tyres/
      Soft.png
      Medium.png
      Hard.png
      Intermediate.png
      Wet.png
    ```

    Square PNGs with a transparent background work best. Keep artwork
    simple: these render at roughly 48 to 72px tall in most layouts.

??? note "Deeper Edits: globals/global_vars.json"
    This is where most of the theme's real customisation lives. Every
    variable here applies theme-wide; the JSON key is the variable
    name and the value is what gets used wherever that var is
    referenced.

    **Colour-coded statistics columns**

    The standings and statistics layouts colour-highlight specific data
    columns. Each has its own variable so you can change one without
    touching the others:

    ```json
    "P1ColouredFG":   "FFD700",  // wins column: gold
    "FLColouredFG":   "B039E1",  // fastest lap count: purple
    "PenColouredFG":  "BC0505",  // penalty time: red
    "DNFColouredFG":  "ED484A",  // DNF count: orange/red
    "PoleColouredFG": "E046E0",  // pole positions: magenta
    "DOTDColouredFG": "FF7F27"   // DOTD count: orange
    ```

    In the layout these are referenced as `"fg": "{P1ColouredFG}"` next
    to the wins data column: change the hex value here and every
    standings table updates.

    **Tyre compound colours**

    These control the colour of the compound letter/abbreviation text
    on tyre strategy graphics:

    ```json
    "SoftTyreFontColour":         "D80221",  // red
    "MediumTyreFontColour":       "C4C400",  // yellow
    "HardTyreFontColour":         "DADADA",  // white/grey
    "IntermediateTyreFontColour": "00B110",  // green
    "WetTyreFontColour":          "5B64DA"   // blue
    ```

    **Driver card font sizes**

    The big race number and name on the broadcast driver card (Session
    Pole, avatar overlays) are sized via these vars:

    ```json
    "AvatarRaceNumberFontSize": 520,  // the large race number on driver cards
    "AvatarNameFontSize":       100,  // first name line
    "AvatarRealNameFontSize":   90,   // second name line
    "AvatarTeamNameFontSize":   32    // team name below
    ```

    Increase or decrease these if your league uses longer names that
    need to fit the card.

    **DOTD (Driver of the Day) card colours**

    The DOTD layout has its own colour pair, independent of the theme
    background mode:

    ```json
    "DotdBackgroundColour": "161A22",  // card background
    "DotdFontColour":       "FFFFFF"   // all text and accents on the card
    ```

    **Per-team logo size on The Grid**

    The Grid graphic sizes each team's logo individually. The variable
    name is `{ABBREVIATION}TheGridTeamLogoSize`, where the abbreviation
    matches the team's three-letter code in RLT:

    ```json
    "AMRTheGridTeamLogoSize": 260,  // Aston Martin
    "FERTheGridTeamLogoSize": 150,  // Ferrari
    "MCLTheGridTeamLogoSize": 220,  // McLaren
    "HASTheGridTeamLogoSize": 155,  // Haas
    "WILTheGridTeamLogoSize": 180   // Williams
    ```

    If your league has different teams, add a new entry matching their
    abbreviation. To disable fine tuning for a team, remove its line;
    it will fall back to the layout's default size.

    **Deep Ratings colour scale**

    Rating cards are colourised from 0 to 100 using a stepped colour
    scale. Each key is the tens boundary (`00`, `10`, `20` ... `100`):

    ```json
    "00DeepRatingDriverCards":  "E04444",  // 0-9: red
    "50DeepRatingDriverCards":  "787878",  // 50-59: grey (midpoint)
    "80DeepRatingDriverCards":  "B450B4",  // 80-89: purple
    "100DeepRatingDriverCards": "FA50FA"   // 100: bright pink
    ```

    The theme picks the right entry by taking the rating's level value,
    dividing by 10, and using that as a lookup prefix.

    **Date format**

    Penalty and event dates use format strings selected by a public
    property. The available formats are defined here:

    ```json
    "Day Month":      "dd MMMM",
    "Day Month Year": "dd MMMM yyyy",
    "Month Day":      "MMMM dd",
    "Day/Month/Year": "dd/MM/yyyy"
    ```

    The public property's selected value (e.g. `"Day Month Year"`) is
    used as a variable name, which then resolves to the actual format
    string above.

??? note "Localisation"
    **Quick word edits**

    If you just want to change how specific words appear in the
    graphics (team name display, column headers, label text), you
    don't need a full new locale file. Just edit
    `localizations/english.json` directly.

    Any text in the theme written in `[square brackets]` is looked up
    in the `Strings` map. For example, the standings header uses
    `[DRIVERS' CHAMPIONSHIP]`, which resolves to whatever value that
    key holds in the file:

    ```json
    "Strings": {
      "DRIVERS' CHAMPIONSHIP": "DRIVERS' CHAMPIONSHIP",
      "RACE RESULTS":          "RACE RESULTS"
    }
    ```

    Change the value on the right to reword the label. The key on the
    left must stay unchanged: it's what the layout looks up.

    **Team name display** works the same way. Every team name that
    appears in the graphics goes through this map, so you can control
    the exact formatting:

    ```json
    "RED BULL": "RED BULL RACING FORD RBPT",
    "MCLAREN":  "McLAREN",
    "FERRARI":  "FERRARI"
    ```

    The key is the team's name uppercased as stored in RLT; the value
    is what actually prints. This is where you add engine supplier
    suffixes, fix capitalisation, or shorten long names.

    **Creating a full new localisation**

    1. Copy `localizations/english.json` to `localizations/deutsch.json`
       (the filename doesn't matter to RLT).
    2. Update the header:
       ```json
       {
         "Id":      "de-DE",
         "Name":    "Deutsch",
         "Strings": { "...": "..." },
         "Vars":    { "...": "..." }
       }
       ```
    3. Translate the `Strings` values. Leave the keys unchanged, only
       translate the right side. Unmatched keys just have their
       brackets stripped and appear as plain text, no error.
    4. Optionally update `Vars` for locale-specific settings, e.g. date
       formats:
       ```json
       "Vars": {
         "PenaltyDateFormat": "dd. MMMM yyyy"
       }
       ```
    5. In RLT: **Season → Theme Settings → Localisation** → select your
       new file.

    Localisation files can be shared independently: other admins just
    drop the `.json` into their `localizations/` folder and it appears
    in the language picker.

<div class="checker-divider"></div>

## Support {: .f1-heading }

--8<-- "buttons-2026.md"
