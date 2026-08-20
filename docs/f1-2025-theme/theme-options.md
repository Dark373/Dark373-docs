# 2025 Theme Options

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
3. Place the images in `<app_root_folder>/images/driver_avatars/` (create
   the folder if it doesn't already exist).

Using the default avatars as a guide, try lining your image up against the
driver silhouette (using layers) to get a perfect fit.

## Broadcast vs Media {: .f1-heading }

Due to limited space in the RLT app UI, some renders live behind a theme
option instead of appearing on the app menus directly. Any render name
beginning with "Media" or "Broadcast" refers to a type of render that can
be switched. Check the [Gallery](gallery.md) to see which renders are
hidden behind this setting.

## Enabling the theme {: .f1-heading }

Make the theme active from **Renderer themes → Manage themes...**, then
open **Renderer themes → Current theme options...** to configure it.

## Reference: example settings {: .f1-heading }

The values below are taken from a working F1 2025 Theme setup, to give a
sense of what each section controls.

**Calendar**

- Theme Global → Background Colour Theme: `Grey`
- Theme Global → Season Names: `Season Name`
- Theme Global → League Logo Size: `400`
- Calendar → Render Race Winner: `True`
- Calendar → Grey-out Completed Events: `True`
- Calendar → Render 2 Columns: `True`
- In-App (Calendar): Description
- Localisation file: schedule/calendar date manipulation, which lets you
  set event dates to whatever you want (e.g. `06-09`). This option exists
  for all calendar renders.

**Start Times**

- Calendar → Render Race Type: `True`
- Calendar → Show UTC Time Column: `True`

**Race Results**

- Theme Global → Render Type: `Broadcast`
- Colours pull from the season's category: Secondary Category Colour
  (white), Primary Category Colour (red), Tertiary Category Colour as the
  font colour (black).
- Driver Global → Driver Avatars, Driver Numbers.

**Variable Information**

- Theme Global → Background Colour Theme: `Custom Colour`
- Theme Global → Plain Background: `False`
- Variable Information → Variable Information: `Winner` (other options:
  Podium, meaning 2nd & 3rd, and Points)
- Colours pull from the team: Team Primary Colour, Team Secondary Colour,
  Team Tertiary Colour.

**Official Line-up**

- Theme Global → Season Names: `Season Name`
- Lineups → Official Line-Up Season Name Font Size: `206`
- Team logo sizes can be edited in `global_vars.json`; search for the
  `official` prefix and keywords such as `LogoSize`. "DRIVER" and
  "LINE-UP" text sizes can be adjusted in the same file, under the
  official line-up header.

<div class="checker-divider"></div>

## Support {: .f1-heading }

--8<-- "buttons-2025.md"
