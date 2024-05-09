// const layer = new Tile3DLayer({
//     id: 'tile-3d-layer',
//     // Tileset json file url
//     data: 'https://assets.cesium.com/43978/tileset.json',
//     loader: CesiumIonLoader,
//     loadOptions: {
//       // Set up Ion account: https://cesium.com/docs/tutorials/getting-started/#your-first-app
//       'cesium-ion': {accessToken: '<ion_access_token_for_your_asset>'}
//     },
//     onTilesetLoad: (tileset: Tileset3D) => {
//       // Recenter to cover the tileset
//       const {cartographicCenter, zoom} = tileset;
//       setInitialViewState({
//         longitude: cartographicCenter[0],
//         latitude: cartographicCenter[1],
//         zoom
//       });
//     },
//     pointSize: 2
//   });


// new Tile3DLayer({
//     id: 'tile-3d-layer',
//     // Tileset json file url
//     data: 'https://assets.cesium.com/43978/tileset.json',
//     loader: CesiumIonLoader as any,
//     loadOptions: {
//         'cesium-ion': { accessToken: CESIUM_ION_TOKEN }
//     },
//     onTilesetLoad: (tileset: Tileset3D): void => {
//         console.log(tileset, 'tileset')
//     },
//     pointSize: 2
// }),