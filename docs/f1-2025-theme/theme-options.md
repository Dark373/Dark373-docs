# 2025 Setup

## Categories {: .f1-heading }

Categories are tags you can apply to seasons for organisation. The theme
uses categories to determine its overall colour scheme, as well as giving
users extra options. The app will randomly choose a new colour each time
the app is closed, unless a category is applied to that season.

1. Create a category (League Options -> League Categories)
2. Apply the category to an existing season (Right click season)

!!! tip inline end
    Populate the "Short Name" field: not all renders have the space to
    show longer season names. Users can switch between which name field is
    used in the theme options.

| Field | Meaning |
| --- | --- |
| **Color** | Primary colour |
| **Color #2** | Secondary colour |
| **Color #3** | Font colour (should complement both Color and Color #2) |

## Team colours {: .f1-heading }

In the database section of your championship, you can edit each team's
colours. Tertiary colours are used as font colours throughout the theme.

## Custom avatars {: .f1-heading }

1. Prepare your custom avatars using a canvas with equal height and width
   (you may need to adjust the canvas size to get the perfect fit).
2. Rename the images to match the driver's name in the app.
3. Place the images in `<theme_root_folder>/images/driver_avatars/` (create
   the folder if it doesn't already exist).

Using the default avatars as a guide, try lining your image up against the
driver silhouette (using layers) to get a perfect fit.

## 2026 Season Grid Changes (Audi & Cadillac) {: .f1-heading }

The theme pulls team logos from the app automatically, so most of the
2026 grid needs no changes. Audi and Cadillac weren't on the grid when
the theme's defaults were built though, so two small additions cover
them:

1. **Driver avatars.** Add a PNG for each Audi and Cadillac driver to
   `<theme_root_folder>/images/driver_avatars/`, named after the team plus
   their seat position: `Audi_1.png`, `Audi_2.png`, `Cadillac_1.png`,
   `Cadillac_2.png`.
2. **Light logo variant (optional).** Want a light version of either
   team's logo too? Add a 256×256 PNG with a `__light` suffix to
   `<theme_root_folder>/images/logotypes/teams/`.

That's the whole list. Everything else on this page still applies as-is.

## Broadcast vs Media {: .f1-heading }

Due to limited space in the RLT app UI, some renders live behind a theme
option instead of appearing on the app menus directly. Any render name
beginning with "Media" or "Broadcast" refers to a type of render that can
be switched. Check the [Gallery](gallery.md) to see which renders are
hidden behind this setting.

## Theme Options {: .f1-heading }

Beyond categories, team colours, and avatars, the theme's own Theme
Options panel has a full set of individually adjustable options, grouped
into the categories below. Each is collapsed by default — click one to
expand it.

??? note "Theme Global (6 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Background Colour Theme** | Dark | Changes the colour theme of certain backgrounds. Choices: Dark, Grey, Light, Purple, Custom Colour, No Background |
    | **Plain Background** | On | Changes the background pattern of certain renders |
    | **Season Names** | Season Name | Season naming options. Choices: Season Name, Category Name, Category Short Name, Do Not Render |
    | **Render Type** | Broadcast | Switches between the Broadcast and Media render styles. Choices: Broadcast, Media |
    | **League Logo Size** | 150 | Changes the size of the league logo |
    | **Coloured Position Jump Text** | Off | If enabled, text for the position jump will appear coloured |

??? note "Driver Global (7 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Naming Conventions** | Name | Changes which name fields are used. When Full Name is active, both Name and Real Name are used. Choices: Name, Real Name, In-Game Name, Full Name |
    | **Switch Name Fields** | Off | Changes the order of name fields on renders — when active, Real Name comes before Name. Only works when Naming Conventions is set to Full Name |
    | **Name Casing** | Normal | Changes the casing of driver names. Choices: Normal, Upper Case, Lower Case |
    | **Position Limit** | 20 | Limits how many drivers are shown on renders |
    | **Start Position** | 1 | Sets which position continuous driver/team lists start from — e.g. a value of 5 starts lists from P5 instead of P1 |
    | **Driver Avatars** | Driver Avatar | Choose whether renders use driver avatars, team logos, or nothing. Choices: Driver Avatar, Team Logo, Do Not Render |
    | **Driver Numbers** | On | Renders each driver's race number |

??? note "Team Global (4 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Amount Of Teams** | 10 | Sets how many teams the theme expects |
    | **Render Team Names** | On | Renders team names |
    | **Team Logos and Liveries** | Team Logos | Switches team artwork between logos and car liveries. Choices: Team Logos, Car Liveries |
    | **Team Name Coloured Font** | Off | Colours team name text using the team's font colour |

??? note "Calendar (7 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Schedule Event Column Count** | 4 | Number of columns on the schedule render |
    | **Schedule Event Row Count** | 4 | Number of rows on the schedule render |
    | **Render Race Type** | On | Renders the race type on the start-times render |
    | **Render Race Winner** | On | Renders the race winner across calendar renders |
    | **Show UTC Time Column** | On | Adds a UTC time column |
    | **Grey-out Completed Events** | On | Greys out events that have already happened |
    | **Render 2 Columns** | On | Splits the calendar render into 2 columns |

??? note "Race Results (15 options)"
    All default **On** — each toggles one column/element off the Race
    Results render.

    | Option | What it does |
    | --- | --- |
    | **Render fastest lap driver** | Shows who set the fastest lap |
    | **Render driver of the day** | Shows the driver of the day |
    | **Render Position Jump** | Shows how many positions each driver gained or lost |
    | **Render Fastest Lap** | Shows each driver's fastest lap time |
    | **Render Laps** | Total laps driven |
    | **Render Grid Position** | Each driver's starting position |
    | **Render Pit Stops** | Number of pit stops made |
    | **Render Maximum Speed** | Each driver's max speed |
    | **Render Overtakes** | Number of overtakes |
    | **Render Lead Laps** | Number of laps led |
    | **Render Lead Distance** | Lead distance, in km |
    | **Render Total Penalties** | Total penalties per driver |
    | **Render Steward Penalties** | Total steward-issued penalties per driver |
    | **Render Game Penalties** | Total in-game penalties per driver |
    | **Render Stints** | Laps per tyre |

??? note "Qualifying Results (7 options)"
    All default **On** — each toggles one column/element off the
    Qualifying Results render.

    | Option | What it does |
    | --- | --- |
    | **Render Absolute Time** | Each driver's absolute lap time |
    | **Render Time Gap** | Time gap to the session leader |
    | **Render Maximum Speed** | Each driver's max speed |
    | **Render Tyre** | Tyre compound used |
    | **Render Sector Times** | Individual sector times |
    | **Render Laps** | Laps completed in the session |
    | **Render Points** | Points earned in the session |

??? note "Standings (22 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Render Data Table** | Off | Quick toggle for a block of additional columns |
    | **Standings Progress** | Do Not Render | Adds a round-by-round progress view. Choices: Points, Position, Do Not Render |
    | **Show All Events On Progress Standings** | Off | Shows every season event on the progress view, not just completed ones |
    | **Is Drivers' Champion** | Off | Changes P1's font colour and text to show them as champion |
    | **Is Teams Champion** | Off | Changes P1's font colour and text to show them as champion |
    | **Render Coloured Font Text** | On | Colours text such as gold for P1 |
    | **Display Driver or Team Leader** | Driver Leader | Chooses whose avatar/logo represents the season leader. Choices: Driver Leader, Team Leader |
    | **Render Position Jump** | On | Shows position gained/lost |
    | **Render Points Gain** | On | Shows points gained |
    | **Render Points Interval** | On | Shows the points interval to the driver/team above |
    | **Render Gap To Leader** | On | Shows the points gap to the leader |
    | **Render Podiums Count** | On | Shows total podiums |
    | **Render Top 5 Count** | On | Shows total top-5 finishes |
    | **Render Top 10 Count** | On | Shows total top-10 finishes |
    | **Render Best Race Position** | On | Shows the best race finish of the season |
    | **Render Best Qualifying Position** | On | Shows the best qualifying result of the season |
    | **Render Fastest Lap Count** | On | Shows total fastest laps |
    | **Render Pole Count** | On | Shows total poles |
    | **Render DOTD Count** | On | Shows total driver-of-the-day awards |
    | **Render Penalty Points** | On | Shows total penalty points |
    | **Render DNF Count** | On | Shows total DNFs |
    | **Render Races Attended** | On | Shows total races attended |

??? note "Graph Standings (4 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Maximum Points A Driver Can Earn Per Race** | 26 | Points awarded for 1st place — sets the scale for the driver graph |
    | **Maximum Points Teams Can Earn Per Race** | 44 | Points for 1st place added to 2nd place — sets the scale for the team graph |
    | **First Column Data** | CountP1 | Which stat the graph's first column shows. Choices: Points To Leader Diff, Points To Above Diff, Wins (P1), P2 Count, P3 Count, Podiums, Top 5s, Top 10s, Best Race Position, Poles, Best Qualifying Position, Penalty Points, DNFs, Events Attended |
    | **Separator Margin** | 812 | Spacing for the graph's separator line |

??? note "Custom Standings (2 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Naming Conventions** | Name | Same as Driver Global's naming option, scoped to the Custom Standings render. Choices: Name, Real Name, In-Game Name, Full Name |
    | **Switch Name Fields** | Off | Same as Driver Global's field-order option, scoped to Custom Standings |

??? note "Variable Information (2 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Variable Information** | Winner | Chooses what the Variable Information render shows. Choices: Winner, 2nd, 3rd, Points |
    | **Position To Display** | 4 | Which position to show when Variable Information is set to Points |

??? note "Event Information (1 option)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Pole Time** | 1:00.000 | Text field for the session's pole time |

??? note "Head-To-Head (5 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Driver 1 Index** | 1 | A value of 1 renders the first driver in the team |
    | **Driver 2 Index** | 2 | A value of 2 renders the second driver in the team |
    | **Left Column Team** | 1 | A value of 1 renders the first team in the championship |
    | **Right Column Team** | 2 | A value of 2 renders the second team in the championship |
    | **Maximum PP Per Season** | 12 | The max penalty points a driver can earn per season, used to scale the comparison |

??? note "Driver Ratings (6 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Driver To Display** | 1 | Which driver's rating card to render |
    | **Overall (OVR)** | 80 | Overall rating, -99 to 99 |
    | **Experience (EXP)** | 80 | Experience rating, -99 to 99 |
    | **Racecraft (RAC)** | 80 | Racecraft rating, -99 to 99 |
    | **Awareness (AWA)** | 80 | Awareness rating, -99 to 99 |
    | **Pace (PAC)** | 80 | Pace rating, -99 to 99 |

??? note "Starting Grid (1 option)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Render Times** | On | Renders each driver's qualifying time on the starting grid |

??? note "Podium Results (2 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Podium Naming Conventions** | Name | Changes which name fields are used on the podium render. Choices: Name, Real Name, In-Game Name |
    | **Name Font Size** | 56 | Font size for podium driver names |

??? note "Session Top 3 (1 option)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Team Name Font Size** | 60 | Font size for team names on the Session Top 3 render |

??? note "Lineups (5 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Secondary Names** | On | Renders a driver's secondary name line |
    | **Secondary Lineup Naming Conventions** | Name | Which name field feeds the secondary line. When Full Name is active, both Name and Real Name are used. Choices: Name, Real Name, In-Game Name, Full Name |
    | **Number Of Reserves** | 0 | How many reserve-driver slots to render |
    | **Driver Line Width** | 600 | Width of each driver line |
    | **Official Line-up Season Name Font Size** | 205 | Font size for the season name on the official line-up render |

??? note "Statistics (9 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Team To Display On Constructor Statistics** | 1 | A value of 1 shows the team currently leading the championship, 2 the next, and so on |
    | **Races Count For Teams Statistics** | 0 | How many recent races to count over — 0 counts the full season |
    | **Race Wins Count For Teams Statistics** | 0 | How many recent races to count wins over — 0 counts the full season |
    | **Podiums Count For Teams Statistics** | 0 | How many recent races to count podiums over — 0 counts the full season |
    | **Pole Count For Teams Statistics** | 0 | How many recent races to count poles over — 0 counts the full season |
    | **Drivers' Championships Count For Teams Statistics** | 0 | How many past drivers' championships to count |
    | **Constructors' Championships Count For Teams Statistics** | 0 | How many past constructors' championships to count |
    | **Drivers Count For Teams Statistics** | 2 | How many drivers to show per team |
    | **Points Count For Teams Statistics** | 0 | How many recent races to count points over — 0 counts the full season |

??? note "Season Penalties (8 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Penalty Order** | Penalty Points Active | How the season penalties list is sorted, descending. Choices: Active Penalty Points, Overall Penalty Points, Penalty Seconds, In-Game Penalty Seconds |
    | **Render Active Penalty Points** | On | Shows active penalty points |
    | **Render Active Warnings** | On | Shows active warnings |
    | **Render Total Time Penalties** | On | Shows total time penalties |
    | **Render Total Position Penalties** | On | Shows total position penalties |
    | **Render Total In-game Time Penalties** | On | Shows total in-game time penalties |
    | **Render Total Penalty Points** | On | Shows total penalty points, active and expired |
    | **Render Total Warnings** | On | Shows total warnings, active and expired |

??? note "Penalties (3 options)"
    | Option | Default | What it does |
    | --- | --- | --- |
    | **Pentalty Text Size** | 28 | Font size for penalty text |
    | **Penalty Grand Prix Name Color** | Color | Which of the round's colours the Grand Prix name uses. Choices: Color, SecondaryColor, TertiaryColor |
    | **Penalty Line Color** | SecondaryColor | Which of the round's colours the penalty line uses. Choices: Color, SecondaryColor, TertiaryColor |

<div class="checker-divider"></div>

## Support {: .f1-heading }

--8<-- "buttons-2025.md"
