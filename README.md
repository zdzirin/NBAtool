**NBAtool is a web app allowing you to quickly compare the offensive and defensive statistics of an NBA matchup.**

### The Application

NBAtool is comprised of a react frontend served through a node.js express server.

To run the application use run the `run_server` script in the root nbatool directory

---

### The Server

The server supporting the application is a node.js express server which handles requests. Any requests sent to the defined api routes will return their respective responses, while any other requests will be returned the static frontend assets.



#### API Routes

The following api routes are used to serve data to the front-end. The methods used by each route can be found in the `nbatool/api/` folder.
There is no database, currently each request to the api scrapes data from external websites to get the requested information. The webscraping is done using node-fetch, a node.js clone of the Fetch API and Cheerio, a stripped down node.js clone of jQuery. The routes are as follows:



**Get Play-By-Play roster** `/api/pbp_rosters/{team}`

Returns a json array of player objects representing the teams play-by-play roster
A player object being:
```
{
  player: { name, link }, // Player name and link to profile
  g: { name, link }, // Games Played amount (name) and link to game log
  mp, // minutes played
  pct_1, // Pct of plays at PG position
  pct_2, // Pct of plays at SG position
  pct_3, // Pct of plays at SF position
  pct_4, // Pct of plays at PF position
  pct_5, // Pct of plays at C position
  plus_minus_on,
  plus_minus_net
}
```


**Defense By Position stats roster** `/api/dbp_stats/{team}`

Returns a json array of objects representing the teams defense-by-position stats
A stat object being
```
{
  position, // What defensive position the stats are being allowed to
  range, // Lookback period in days, 0 for season
  pts: { // Points Allowed
    diffictulty, // -1 for difficult, 0 for average, 1 for easy
    amt // Amount of stat allowed to position per game
    },
  reb: { difficulty, amt }, // Rebounds
  ast: { difficulty, amt }, // Assists
  tpm: { difficulty, amt }, // Three Pointers
  stl: { difficulty, amt }, // Steals
  blk: { difficulty, amt }, // Blocks
  to: { difficulty, amt } // Turnovers
}
```

for each of these team abbreviations are defined in `nbatool/consts.js`

---
### Front End

The front end for the application is a create-react-app setup located in the `nbatool_client folder`. It is to be built into the `nbatool_client/build/` folder before being served by the express server.

#### Organization

The orgaization of the client project within the `src` folder is as follows:
```
src
|- images // Images for the application (currently only logo)
|
|- components // Components used to display the data from the backend.
|  |- styles // CSS Modules for component styles
|  | * component javascript files
|
|- pages // Pages used to organize the components
|  |- styles // CSS Modules for page styles
|  |- * page component javascript files
|
|- app.css // My appwide stylings
|
|- app.js // Root react component
|
|- consts.js // Constant files for the react application
|
|- index.js // Entrypoint
|
|- index.css // Leftover create-react-app stylings I'm not sure if I want to keep yet. I kind of like them.
```

Currently there is only one page, which is rendered by the `App.js` file with a footer.

#### Components
The `components/DBPStats.js` and `components/PBPRosters` files define react components which display the stats retrieved from their respective api endpoints. Each component displays as a table which takes up the width of the parent div it is under, and expects the team prop which expects one of the team abbrevations defined in the `src/consts.js` file.

**Example**
```
<div style={{width: 50vw}}> // Container for component
  <DBPStats team="CHI" />
</div>
```
