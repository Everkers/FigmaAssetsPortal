[![](https://img.shields.io/visual-studio-marketplace/v/everkers.assets-portal-figma)](https://marketplace.visualstudio.com/items?itemName=everkers.assets-portal-figma) ![install](https://img.shields.io/visual-studio-marketplace/i/everkers.assets-portal-figma)

# Figma Assets Portal

  <iframe
    src="https://play.fastmotion.io/53f34463-054f-45ac-91a1-8f57eec0e0a2?autoplay=true&loop=false&muted=false&preload=true"
    loading="lazy"
   width="100%" 
   height="500px"
    allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
    allowfullscreen="true"
  ></iframe>

A magical Figma portal that can transport assets directly into your VS Code.

## Features

- Ability to use all the default Figma export features.
- Flexible assets filtering options.
- Ability to export all the assets within a Figma container, either a frame or group.
- Ability to easily export assets with a naming convention using regex.
- Preserved configuration.
- Ability to specify the export path; if the folder doesn't exist, it will be automatically created.

## Usage

1. Generate a Figma API access token and make sure to give it file read permission.
2. The extension icon will appear in the sidebar; click on it and insert your token.
3. After you are authenticated, you need to insert the Figma file ID, which you can find in the URL after '/design/'. For example, `/design/<fileId>/`.
4. Specify the name of the Figma page that contains your assets.
5. Set the export path to where you'd like your assets to be exported.
6. There will be a checkbox to toggle between two options:
   - Container Export: You can specify the name of the container that holds your assets, which will filter all the assets for export.
   - Regex Search: This feature gives you the ability to filter assets throughout the whole page. Using regex, you can get assets that follow a certain naming convention.
7. Click on the search button to fetch the assets.
8. You can now select the assets that you want to export or export all.
9. Finally, click on the export button to export the selected assets.

## Installation

First install in the root directory

```
npm install
```

Then, moving to the react directory, install the packages

```
cd web
npm install
```

Then run the script with, `npm start` or you can build with `npm run build`.

```
npm start
```

## Development

Now you can start developing by pressing `Ctrl + F5` or through the commands palette by using`Ctrl + Shift + P` shortcut and chosing `Start Debugging`.

> Tip: You don't have to restart the project to see new changes, you can do so just by closing the webview tab and reopen it.

## Changelog

Check the [CHANGELOG.md](CHANGELOG.md) for any version changes.

## Reporting issues

Report any issues on the github [issues](https://github.com/Everkers/FigmaAssetsPortal/issues) page. Follow the template and add as much information as possible.

## Contributing

The source code for this extension is hosted on [GitHub](https://github.com/Everkers/FigmaAssetsPortal). Contributions, pull requests, suggestions, and bug reports are greatly appreciated.

- Post any issues and suggestions to the github [issues page](https://github.com/Everkers/FigmaAssetsPortal/issues). Add the `feature request` tag to any feature requests or suggestions.
- To contribute, fork the project and then create a pull request back to master. Please update the README if you make any noticeable feature changes.
- There is no official contribution guide or code of conduct yet, but please follow the standard open source norms.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
