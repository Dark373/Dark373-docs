# 2026 Setup

Most of this theme is controlled from RLT's own UI. A few effects go
further and read or edit the theme's own files directly: those sections
are marked and kept separate below.

## Customising the Theme {: .f1-heading }

### Public Properties (no JSON editing required)

In RLT: **Renderer themes → Current theme options...**. Changes apply on the
next render.

| Property | Type | What it does |
| --- | --- | --- |
| `BackgroundColour` | Enum | Overall style: Dark / Grey / Light / Purple / Custom Colour / No Background |
| `BackgroundVariant` | Enum | Which background texture file loads; swap backgrounds without changing colour mode |
| `ThemeCategory` | String | League category or season name data shown on layouts |
| `PosJumpColour` | Bool | Enables coloured +/− position-change indicators |
| `LeagueLogoColorised` | Bool | Tints the championship logo to match the theme accent |
| `LogoSize` | Integer | Pixel height of the league logo |
| `CustomTyreImages` | Bool | Use custom tyre compound images (see Custom Tyre Images below) |

## Custom Colour Mode {: .f1-heading }

Setting `BackgroundColour` to **Custom Colour** moves the theme off its
built-in palette and onto user defined colour values instead. Which record it
reads from, the season or the team, depends on the specific layout
being rendered: season-wide renders (standings, calendar, and similar)
pull from the season, while per-team and per-driver renders pull from
that driver's team. Either way it's the same three fields underneath.

No JSON edits required: the mapping is handled by the
`globals/global_vars.json` entries covered in Deeper Edits below.

**Season colours**, set in RLT: **Edit season → Additional options → Colours**

| Season field | Role | Typical value |
| --- | --- | --- |
| `Color` | Main background / panel fill | Team primary brand colour |
| `SecondaryColor` | Secondary accents, gradient layers | Team secondary colour |
| `TertiaryColor` | Font colour, labels, icon tints | High-contrast value, usually `#FFFFFF` or `#000000` |

**Team colours**, set in RLT: **Database → Team tab**, per team

| Team field | Role | Typical value |
| --- | --- | --- |
| `Color` | Main background / panel fill | Team primary brand colour |
| `SecondaryColor` | Secondary accents, gradient layers | Team secondary colour |
| `TertiaryColor` | Font colour, labels, icon tints | High-contrast value, usually `#FFFFFF` or `#000000` |

`TertiaryColor` must be readable on top of `Color`, so pick white or
near-black unless your primary is a very pale hue. This applies
whichever source a given layout draws from.

## All Public Properties {: .f1-heading }

The table above covers this theme's core global settings. Everything else in RLT's Theme Settings panel is grouped below by category, exactly as it's grouped in the app itself, collapsed by default since there's a lot of it.

??? note "Driver Global (5 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Name Casing** | Normal | Changes the casing of characters. Choices: Normal, Upper Case, Lower Case. |
    | **Position Limit** | 22 (min 1) | Limit the amount of drivers shown on renders. |
    | **Start Position** | 1 (min 1) | Determines which position continuous lists of drivers/teams starts from. Example: a value of 5 means certain renders will start from P5 instead of P1. |
    | **Driver Avatars** | Driver Avatar | Choose whether or not to use driver avatars on certain renders. Choices: Driver Avatar, Team Logo, Car Livery, Do Not Render. |
    | **Driver Race Numbers** | On | Toggles driver race numbers. |


??? note "Team Global (4 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Team Limit** | 11 (min 1) | Limit the amount of teams shown on renders. |
    | **Render Team Names** | On | Renders team names. |
    | **Team Logos and Liveries** | Team Logos | Changes Logos/Vendors to Liveries. Choices: Team Logos, Car Liveries. |
    | **Team Name Coloured Font** | Off | Changes font colour for team names. |


??? note "Race Results (19 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Driver Race Award Type** | Winner | Chooses the driver race award type. Choices: Winner, Fastest Lap, DOTD, Top Speed, Most Overtakes, Most Laps Led. |

    **Race Column Options**

    | Option | Default | What it does |
    | --- | --- | --- |
    | **Render Penalties** | Number + String | Renders penalties. Choices: Number + String, Number Only, Do Not Render. |
    | **Render Fastest Lap** | On | Renders fastest lap. |
    | **Render Laps** | On | Renders laps. |
    | **Render Grid Position** | On | Renders grid position. |
    | **Render Pit Stops** | On | Renders pit stops. |
    | **Render Maximum Speed** | On | Renders maximum speed. |
    | **Render Overtakes** | On | Renders overtakes. |
    | **Render Positions Lost** | On | Renders positions lost. |
    | **Render Lead Laps** | On | Renders lead laps. |
    | **Render Lead Distance** | On | Renders lead distance. |
    | **Render Race Distance %** | On | Renders race distance %. |
    | **Render Stints** | On | Renders stints. |
    | **Render Fastest Lap Footer** | On | Renders fastest lap footer. |
    | **Render Driver Of The Day Footer** | On | Renders driver of the day footer. |
    | **Render Most Laps Led Footer** | On | Renders most laps led footer. |
    | **Render Best Moment Footer** | On | Renders best moment footer. |
    | **Best Moment String** | "MOMENT" | Maximum 9 Characters. |

    **Circuit Data**

    | Option | Default | What it does |
    | --- | --- | --- |
    | **Circuit Data** | Fastest Sectors | Chooses the circuit data. Choices: Fastest Sectors, MaxSpeed, LeadLaps, OvertakesCount, LosePositionsCount. |


??? note "Qualifying Results (10 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Render Type** | Broadcast | Affects Qualifying results only, due to a lack of layout versions available. Choices: Broadcast, Media. |
    | **Q2 Knockout Start Position** | 11 (min 0) | The first grid position eliminated in Q2 (e.g. 11 if the top 10 advance to Q3). Controls the 'Q2' separator placement. |
    | **Q1 Knockout Start Position** | 17 (min 0) | The first grid position eliminated in Q1 (e.g. 17 if 16 drivers advance to Q2). Controls the 'Q1' separator placement. |

    **Qualifying Column Options**

    | Option | Default | What it does |
    | --- | --- | --- |
    | **Render Points** | On | Renders points. |
    | **Render Time Gap** | On | Renders time gap. |
    | **Render Sector Times** | On | Renders sector times. |
    | **Render Penalties** | On | Renders penalties. |
    | **Render Laps** | On | Renders laps. |
    | **Render Maximum Speed** | On | Renders maximum speed. |
    | **Render Tyre** | On | Renders tyre. |


??? note "Variable Data (4 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Variable Data** | Winner (P1) | Chooses the variable data. Choices: Winner (P1), Podium (P2), Podium (P3), Fastest, DOTD, Best Moment, Most Laps Led, Position. |
    | **Best Moment Definition** | "CLEANEST" | Sets the best moment definition. |
    | **Best Moment String Font Size** | 170 | Sets the best moment string font size. |
    | **Position Value** | 4 | Sets the position value. |


??? note "The Grid (1 option)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Render Time** | Off | Renders time. |


??? note "Standings (40 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Progress Standings** | Do Not Render | Chooses the progress standings. Choices: Points, Position, PenaltyPoints, PenaltyTimeSum, Do Not Render. |
    | **Render Incomplete Events on Progress Standings** | Off | Renders all events including incompleted events on standings progress. |
    | **Coloured Text** | Off | Enables coloured text on the standings table. |
    | **Media Team Coloured Background** | Off | Renders team colours as the background on media standings. |
    | **Driver Standings Award Type** | Leader | Chooses the driver standings award type. Choices: Leader. |

    **Standings Column Options**

    | Option | Default | What it does |
    | --- | --- | --- |
    | **Render Standings Data Table** | On | Only affects the data table of Media Standings renders. |
    | **Render Position Change** | On | Only affects Media Standings renders. |
    | **Render Points Gained** | On | Renders points gained. |
    | **Render Interval** | On | Renders interval. |
    | **Render Gap To Leader** | On | Renders gap to leader. |
    | **Render Podium Counts** | On | Renders podium counts. |
    | **Render Top 5 Count** | On | Renders top 5 count. |
    | **Render Top 10 Count** | On | Renders top 10 count. |
    | **Render Best Race Position** | On | Renders best race position. |
    | **Render Worst Race Position** | On | Renders worst race position. |
    | **Render Average Race Position** | On | Renders average race position. |
    | **Render Best Qualifying Position** | On | Renders best qualifying position. |
    | **Render Worst Qualifying Position** | On | Renders worst qualifying position. |
    | **Render Average Qualifying Position** | On | Renders average qualifying position. |
    | **Render Average Position Change** | On | Renders average position change. |
    | **Render Fastest Lap Count** | On | Renders fastest lap count. |
    | **Render Pole Count** | On | Renders pole count. |
    | **Render Driver Of The Day Count** | On | Renders driver of the day count. |
    | **Render Best Top Speed** | On | Renders best top speed. |
    | **Render Total Overtakes** | On | Renders total overtakes. |
    | **Render Average Overtakes Per Race** | On | Renders average overtakes per race. |
    | **Render Total Positions Lost** | On | Renders total positions lost. |
    | **Render Average Positions Lost Per Race** | On | Renders average positions lost per race. |
    | **Render Lap Finish %** | On | Renders lap finish %. |
    | **Render Laps Led** | On | Renders laps led. |
    | **Render Lead Distance** | On | Renders lead distance. |
    | **Render Rounds Lead Count** | On | Renders rounds lead count. |
    | **Render Total Penalty Time** | On | Renders total penalty time. |
    | **Render Total Penalty Points** | On | Renders total penalty points. |
    | **Render DNF Count** | On | Renders DNF count. |
    | **Render DSQ Count** | On | Renders DSQ count. |
    | **Render Average Points Per Race** | On | Renders average points per race. |
    | **Render Scoring Rate** | On | Renders scoring rate. |
    | **Render Events Participated** | On | Renders events participated. |

    **Constructors Champion**

    | Option | Default | What it does |
    | --- | --- | --- |
    | **Amount of Drivers to Display** | 2 (min 2, max 4) | Determines the amount of drivers displayed on the constructors champion render. |


??? note "Line-ups (3 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Background Colour For Second Panel** | Dark | Changes the colour theme of certain backgrounds. Choices: Dark, Grey, Light, Purple, No Background. |
    | **Team To Render** | 1 (min 1) | Select which team to render (1 = first team, 2 = second, etc). |
    | **Display Livery** | On | Toggles display livery. |


??? note "Statistics (63 options)"
    **Global**

    | Option | Default | What it does |
    | --- | --- | --- |
    | **Global Progression Value** | Points | Option for Team Standings in global statistics. Choices: Points, Wins, Podiums, Top5, Top10. |
    | **Coloured Text** | Off | Enables coloured text on global/multiseason statistics tables. |
    | **Driver Sort On Team Details** | Points | Option to change how the top drivers of a team are ordered. Choices: SeasonsCount, RacesCount, EventsCount, Points, Wins, Podiums, Poles. |
    | **Number Of Drivers On Team Details** | 2 (min 2, max 4) | Option to change the number of drivers displayed on Team Details render. |

    **Participation Details**

    | Option | Default | What it does |
    | --- | --- | --- |
    | **Render Total Qualifications** | Off | Renders total qualifications. |
    | **Render Total Major Races** | Off | Renders total major races. |
    | **Render Total Major Qualifications** | Off | Renders total major qualifications. |
    | **Render Total Races Finished** | Off | Renders total races finished. |
    | **Render Race Completion Rate** | Off | Renders race completion rate. |
    | **Render Event Completion Rate** | Off | Renders event completion rate. |

    **Points Details**

    | Option | Default | What it does |
    | --- | --- | --- |
    | **Render Average Points Per Season** | Off | Renders average points per season. |
    | **Render Average Points Per Race** | Off | Renders average points per race. |
    | **Render Average Points Per Event** | Off | Renders average points per event. |
    | **Render Best Season Points** | Off | Renders best season points. |
    | **Render Worst Season Points** | Off | Renders worst season points. |
    | **Render Best Race Points** | Off | Renders best race points. |
    | **Render Scoring Races Count** | Off | Renders scoring races count. |
    | **Render Scoring Rate** | Off | Renders scoring rate. |

    **Standings Details**

    | Option | Default | What it does |
    | --- | --- | --- |
    | **Render Best Standings Position** | Off | Renders best standings position. |
    | **Render Worst Standings Position** | Off | Renders worst standings position. |
    | **Render Average Standings Position** | Off | Renders average standings position. |
    | **Render Runner Up Finishes** | Off | Renders runner up finishes. |
    | **Render Top Three Standings Finishes** | Off | Renders top three standings finishes. |
    | **Render Top Five Standings Finishes** | Off | Renders top five standings finishes. |
    | **Render Total Rounds Leading** | Off | Renders total rounds leading. |

    **Positions Details**

    | Option | Default | What it does |
    | --- | --- | --- |
    | **Render Worst Race Position** | Off | Renders worst race position. |
    | **Render Race P2 Finishes** | Off | Renders race P2 finishes. |
    | **Render Race P3 Finishes** | Off | Renders race P3 finishes. |
    | **Render Average Grid Position** | Off | Renders average grid position. |
    | **Render Average Position Change** | Off | Renders average position change. |
    | **Render Best Qualifying Position** | Off | Renders best qualifying position. |
    | **Render Worst Qualifying Position** | Off | Renders worst qualifying position. |
    | **Render Qualifying P2 Finishes** | Off | Renders qualifying P2 finishes. |
    | **Render Qualifying P3 Finishes** | Off | Renders qualifying P3 finishes. |

    **Race Details**

    | Option | Default | What it does |
    | --- | --- | --- |
    | **Render Total Overtakes** | Off | Renders total overtakes. |
    | **Render Average Overtakes Per Race** | Off | Renders average overtakes per race. |

    **Discipline Details**

    | Option | Default | What it does |
    | --- | --- | --- |
    | **Render Dsq Count** | Off | Renders dsq count. |
    | **Render Clean Races Count** | Off | Renders clean races count. |
    | **Render Total Stewards Penalty Seconds** | Off | Renders total stewards penalty seconds. |
    | **Render Average Stewards Penalty Seconds Per Race** | Off | Renders average stewards penalty seconds per race. |

    **Track Details**

    | Option | Default | What it does |
    | --- | --- | --- |
    | **Render Events Count** | On | Renders events count. |
    | **Render Seasons Count** | On | Renders seasons count. |
    | **Render Average Pit Stops** | On | Renders average pit stops. |
    | **Render Average Overtakes** | On | Renders average overtakes. |
    | **Render Average Duration** | On | Renders average duration. |
    | **Render Maximum Speed** | On | Renders maximum speed. |
    | **Render Total Safety Cars** | On | Renders total safety cars. |
    | **Render Total Virtual Safety Cars** | On | Renders total virtual safety cars. |
    | **Render Average Safety Cars Per Race** | On | Renders average safety cars per race. |
    | **Render Average Virtual Safety Cars Per Race** | On | Renders average virtual safety cars per race. |
    | **Render Race Lap Record** | On | Renders race lap record. |
    | **Render Race Lap Record Season** | On | Renders race lap record season. |
    | **Render Most Wins Driver** | On | Renders most wins driver. |
    | **Render Most Podiums Driver** | On | Renders most podiums driver. |
    | **Render Qualifying Lap Record** | On | Renders qualifying lap record. |
    | **Render Qualifying Lap Record Season** | On | Renders qualifying lap record season. |
    | **Render Most Poles Driver** | On | Renders most poles driver. |

    **Ratings**

    | Option | Default | What it does |
    | --- | --- | --- |
    | **Season Rating Value** | RacePace | Chooses the season rating value. Choices: RacePace, Consistency, Attack, Defense. |
    | **Card View** | Panel | Switches between a single driver card and a multi-driver panel. Choices: Panel, Individual. |
    | **Individual Driver To Display** | 1 (min 1) | Select which driver to display on the individual card view. |
    | **Driver Card Row Count** | 5 (min 1) | Amount of rows to display for driver ratings panel. |
    | **Driver Card Column Count** | 5 (min 1) | Amount of columns to display for driver ratings panel. |

    **Head 2 Head**

    | Option | Default | What it does |
    | --- | --- | --- |
    | **Individual Statistic** | TeamPoints | Selects which statistic is displayed on the H2H individual stat render. Choices: TeamPoints, EventsForTeam, RacesForTeam, QualsForTeam, BestRacePosition, BestQualPosition, CountP1, CountP3, CountQualP1, WinsString, LossesString, DrawsString, WinPercentageString. |


??? note "Penalty (1 option)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Date Format** | Day Month | Chooses the date format. Choices: Day Month, Day Month Year, Month Day, Month Day Year, Day/Month/Year, Month/Day/Year. |

??? note "Light & Dark Team Logo Variants"
    The theme loads logo variants per team and switches between them
    based on the rendering surface. RLT picks variants by appending
    `__variantname` (double underscore) to the base filename.

    **Naming**

    The base filename comes from the team's UniqueId in RLT where matching is
    case-insensitive.

    ```text
    images/logotypes/teams/
      red.bull.2026.png          # default / fallback
      red.bull.2026__light.png   # used on dark backgrounds
      red.bull.2026__dark.png    # used on light backgrounds
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
        championship logo is tinted to match the theme accent which requires
        a black logo for true colour. Disable it if using a full-colour logo.

??? note "Custom Tyre Images"
    **Step 1: Enable.** In RLT Theme Settings, set `CustomTyreImages`
    to true.

    **Step 2: Add files.** Place PNG images in `theme/images/logotypes/tyres/`
    inside the theme folder. Filenames must exactly match the `TyresType` 
    compound names; capitalisation matters:

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

??? note "Styles"
    A style is a named set of properties (font, size, colour, padding,
    alignment) defined once and applied to many blocks across the
    theme. Changing a value in a style updates every block that uses
    it, across every layout.

    Styles live in the `styles/` folder, split into five files by
    area:

    ```text
    styles/
      BroadcastResults.json   # broadcast results rows and session graphics
      MediaResults.json       # media standings, The Grid, session fastest
      NameStyles.json         # driver name rendering across all graphics
      Statistics.json         # statistics tables, track details, deep ratings
      Penalty.json            # penalty decision documents
    ```

    Each entry looks like this. The `StyleName` is the identifier
    layouts use to pull it in, everything else is what gets applied:

    ```json
    {
      "StyleName": "BroadcastTime",
      "Foreground": "<fg>",
      "FontName":   "{FontKHRegular}",
      "FontSize":   32,
      "Padding":    "35,0",
      "Margin":     "0,2,0,0"
    }
    ```

    Since everything is named after what it controls
    (`BroadcastPos`, `MediaStandingsPoints`, `TheGridTeamLogoStyle`,
    `PenaltyHeaderTextStyle`, and so on), find the graphic you want to
    change, locate the matching style name, and edit the value there.

    **Things to leave alone**

    1. `StyleName`: renaming it breaks every layout that references it
    2. `<fg>`, `<fg1>`, `<FgSecondName>`: these are colour values
       injected at render time, replace them with a literal and the
       colour stops responding to the theme
    3. `RenderIf: "{Item.Driver.IsDisplayNameMultiPart}"`: present on
       every second-name-line style, controls whether the line shows
       at all

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
         "PenaltyDateFormat": "dd MMMM yyyy"
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
