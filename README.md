# URDF Viewer VSCode Extension

An extension for viewing and testing a URDF file. Based on the [URDFLoader](https://github.com/gkjohnson/urdf-loaders/) for THREE.js.

The 3D view reloads as the URDF file is edited and can only load geometry files and textures from within the current VSCode workspace.

![preview](./resources/screenshot.png)

_ATHLETE model and URDFLoader © 2018 California Institute of Technology, available [here](https://github.com/gkjohnson/urdf-loaders/)_

## TODO
- Create an icon for the extension
- Display errors?
- Validate against URDF schema file before display
- Options
  - `update` - whether to up on "save" or "change"
  - `background-color` - the background color of the viewer
  - `open-controls` - whether the controls should start open
