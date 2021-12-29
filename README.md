# <img src="https://user-images.githubusercontent.com/27695959/147606566-ec9b9078-e9b8-417e-ae56-cb1c6de53ea5.png" width="32"> Timewinder
>*Because chronebreak was taken*

## What?

Timewinder is backup tool for the settings of the League of Legends client.
It can both restore and (automatically) create backups.

Think of settings like:
* Skin preferences
* If a party lobby is open or closed by default
* Disabling e-sports notification
* League Voice settings
* Audio settings

It does **not** backup game settings, like hotkeys, minimap settings, etc.   

## Why?
For some people the client has a habit of resetting its settings every once in a while.
This results in you having to reselect your favorite skin in champ select for every champ,
clicking away every popup, disabling e-sports notifications and having to reaccept the Summoners Code. 
<br>
*I wish my ranked teammates actually read it for once...*

## Installation
### Releases
Check the [Releases](https://github.com/NoudH/timewinder/releases/) tab for the newest releases

### Build from source
Install and build the application by running the following commands
```shell
npm install
npm run electron:build
```
A build should appear in the `dist_electron` directory.

## FAQ

### Is this approved by Riot?
Timewinder conforms to both the [general Riot Developer policies](https://developer.riotgames.com/policies.html) and the [League Client development policies](https://developer.riotgames.com/league-client-apis.html).
While this doesn't mean that Riot explicitly approves the application or supports it in any way, it makes it increasingly unlikely that using this application will risk your account.
[This comment by RiotSargonas](https://www.reddit.com/r/leagueoflegends/comments/80d4r0/runebook_the_ultimate_rune_pages_manager_that_you/duv2r22/) explains more about Riot's approach to applications like this one.

## Notice
*Timewinder isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.*
