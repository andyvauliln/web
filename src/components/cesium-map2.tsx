// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZWYwNWEzNi0zMThkLTQ5ZjgtODZmNC01ZWI0ODQ1OWVhYTYiLCJpZCI6MTg2OTM0LCJpYXQiOjE3MDY3MjIxNjN9.JZdCe1eGQfsow46cZGVVG1r8hL1L0E72AzUsFs1Rw8s";

// Initialize Cesium
const initializeCesium = async () => {
    // Create a Cesium viewer without default Bing Maps imagery
    const viewer = new Cesium.Viewer("cesiumContainer", {
        imageryProvider: false, // This disables the default Bing Maps imagery
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        infoBox: true,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        animation: false,
        navigationInstructionsInitiallyVisible: true,
    });



    // Define bounding box coordinates
    const boundingBox = new Cesium.Rectangle(
        Cesium.Math.toRadians(-74.0), // West
        Cesium.Math.toRadians(40.78),   // South
        Cesium.Math.toRadians(-73.93), // East
        Cesium.Math.toRadians(40.88)    // North
    );

    // Log bounding box coordinates
    console.log("Bounding Box Coordinates:");
    console.log("West:", Cesium.Math.toDegrees(boundingBox.west));
    console.log("South:", Cesium.Math.toDegrees(boundingBox.south));
    console.log("East:", Cesium.Math.toDegrees(boundingBox.east));
    console.log("North:", Cesium.Math.toDegrees(boundingBox.north));

    // Set initial view
    viewer.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(-73.9666, 40.8200, 400),
        orientation: {
            heading: Cesium.Math.toRadians(65),
            pitch: Cesium.Math.toRadians(-40),
            roll: 0,
        },
    });

    // Store the initial camera position
    const initialCameraPosition = viewer.scene.camera.position.clone();
    console.log("Initial Camera Position:", initialCameraPosition);

    // Add an event handler to limit the camera movement within the bounding box
    viewer.scene.postRender.addEventListener(function () {
        const cameraPosition = viewer.scene.camera.positionWC; // Get camera position in world coordinates
        const cartographic = Cesium.Cartographic.fromCartesian(cameraPosition);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);

        // Log current camera position
        console.log("Current Camera Position (Longitude, Latitude):", longitude, latitude);

        // Check if the new camera position is inside the bounding box
        if (
            longitude < Cesium.Math.toDegrees(boundingBox.west) ||
            longitude > Cesium.Math.toDegrees(boundingBox.east) ||
            latitude < Cesium.Math.toDegrees(boundingBox.south) ||
            latitude > Cesium.Math.toDegrees(boundingBox.north)
        ) {
            // If outside the bounding box, adjust the camera position to stay at the edge of the bounding box

            // Clamp latitude and longitude to the bounding box edges
            const clampedLongitude = Cesium.Math.clamp(longitude, Cesium.Math.toDegrees(boundingBox.west), Cesium.Math.toDegrees(boundingBox.east));
            const clampedLatitude = Cesium.Math.clamp(latitude, Cesium.Math.toDegrees(boundingBox.south), Cesium.Math.toDegrees(boundingBox.north));

            // Set the new camera position
            viewer.scene.camera.position = Cesium.Cartesian3.fromDegrees(clampedLongitude, clampedLatitude, cartographic.height);

            // Log adjusted camera position
            console.log("Adjusted Camera Position (Longitude, Latitude):", clampedLongitude, clampedLatitude);
        }

        // Check if the camera zoom distance exceeds the minimum and maximum zoom distances
        const zoomDistance = viewer.scene.camera.positionCartographic.height;
        if (zoomDistance < viewer.camera.minimumZoomDistance) {
            // If zoom distance is less than minimum, set it to minimum
            viewer.scene.camera.positionCartographic.height = viewer.camera.minimumZoomDistance;
            console.log("Zoom distance reached minimum:", viewer.camera.minimumZoomDistance);
        } else if (zoomDistance > viewer.camera.maximumZoomDistance) {
            // If zoom distance is greater than maximum, set it to maximum
            viewer.scene.camera.positionCartographic.height = viewer.camera.maximumZoomDistance;
            console.log("Zoom distance reached maximum:", viewer.camera.maximumZoomDistance);
        }
    });

    // Set minimum and maximum zoom distances
    viewer.camera.minimumZoomDistance = 300.0; // Minimum zoom distance in meters
    viewer.camera.maximumZoomDistance = 900.0; // Maximum zoom distance in meters

    // Log minimum and maximum zoom distances
    console.log("Minimum zoom distance:", viewer.camera.minimumZoomDistance);
    console.log("Maximum zoom distance:", viewer.camera.maximumZoomDistance);



    // Check if the camera zoom distance exceeds the minimum and maximum zoom distances
    const zoomDistance = viewer.scene.camera.positionCartographic.height;
    if (zoomDistance < viewer.camera.minimumZoomDistance) {
        // If zoom distance is less than minimum, adjust the camera height to minimum
        viewer.scene.camera.setView({
            destination: viewer.scene.camera.position.clone(),
            orientation: {
                heading: viewer.scene.camera.heading,
                pitch: viewer.scene.camera.pitch,
                roll: viewer.scene.camera.roll
            },
            height: viewer.camera.minimumZoomDistance
        });
        console.log("Zoom distance reached minimum:", viewer.camera.minimumZoomDistance);
    } else if (zoomDistance > viewer.camera.maximumZoomDistance) {
        // If zoom distance is greater than maximum, adjust the camera height to maximum
        viewer.scene.camera.setView({
            destination: viewer.scene.camera.position.clone(),
            orientation: {
                heading: viewer.scene.camera.heading,
                pitch: viewer.scene.camera.pitch,
                roll: viewer.scene.camera.roll
            },
            height: viewer.camera.maximumZoomDistance
        });
        console.log("Zoom distance reached maximum:", viewer.camera.maximumZoomDistance);
    }





    viewer.scene.postRender.addEventListener(function () {
        const cameraHeight = viewer.scene.camera.positionCartographic.height;

        // Check if the camera's current height is outside the min/max zoom distance bounds
        if (cameraHeight < viewer.camera.minimumZoomDistance) {
            // Camera is too close, adjust to minimum zoom distance
            const position = viewer.scene.camera.position;
            const cartographic = Cesium.Cartographic.fromCartesian(position);
            const newHeight = viewer.camera.minimumZoomDistance;
            const newPosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, newHeight);
            viewer.scene.camera.setView({
                destination: newPosition
            });
        } else if (cameraHeight > viewer.camera.maximumZoomDistance) {
            // Camera is too far, adjust to maximum zoom distance
            const position = viewer.scene.camera.position;
            const cartographic = Cesium.Cartographic.fromCartesian(position);
            const newHeight = viewer.camera.maximumZoomDistance;
            const newPosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, newHeight);
            viewer.scene.camera.setView({
                destination: newPosition
            });
        }
    });


    // Create HTML element to display coordinates
    var coordinatesDisplay = document.createElement("div");
    coordinatesDisplay.id = "coordinatesDisplay"; // Assign the ID
    document.body.appendChild(coordinatesDisplay);

    // Add an event handler to capture mouse movement
    viewer.screenSpaceEventHandler.setInputAction(function (movement) {
        var pickRay = viewer.camera.getPickRay(movement.endPosition);
        var cartesian = viewer.scene.globe.pick(pickRay, viewer.scene);
        if (cartesian) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
            coordinatesDisplay.innerHTML = 'Longitude: ' + longitudeString + '<br>Latitude: ' + latitudeString;
        } else {
            coordinatesDisplay.innerHTML = '';
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);



    // Function to zoom in
    function zoomIn() {
        const minHeight = 100.0; // Minimum zoom distance in meters
        const maxHeight = 900.0; // Maximum zoom distance in meters
        const cameraHeight = viewer.scene.camera.positionCartographic.height;
        if (cameraHeight < maxHeight) {
            viewer.camera.zoomIn(400.0);
        }
    }

    // Function to zoom out
    function zoomOut() {
        const minHeight = 100.0; // Minimum zoom distance in meters
        const maxHeight = 900.0; // Maximum zoom distance in meters
        const cameraHeight = viewer.scene.camera.positionCartographic.height;
        if (cameraHeight > minHeight) {
            viewer.camera.zoomOut(400.0);
        }
    }

    // Function to rotate left around a point
    function rotateLeft() {
        const angle = Cesium.Math.toRadians(0.001); // Angle in radians
        const center = viewer.scene.camera.position; // Center around the current camera position
        const minHeight = 100.0; // Minimum zoom distance in meters
        const maxHeight = 900.0; // Maximum zoom distance in meters
        const cameraHeight = viewer.scene.camera.positionCartographic.height;
        if (cameraHeight >= minHeight && cameraHeight <= maxHeight) {
            viewer.scene.camera.rotateLeft(angle, center);
        }
    }

    // Function to rotate right around a point
    function rotateRight() {
        const angle = Cesium.Math.toRadians(0.001); // Angle in radians
        const center = viewer.scene.camera.position; // Center around the current camera position
        const minHeight = 100.0; // Minimum zoom distance in meters
        const maxHeight = 900.0; // Maximum zoom distance in meters
        const cameraHeight = viewer.scene.camera.positionCartographic.height;
        if (cameraHeight >= minHeight && cameraHeight <= maxHeight) {
            viewer.scene.camera.rotateRight(angle, center);
        }
    }


    // Attach the functions to buttons
    document.getElementById('zoomIn').addEventListener('click', zoomIn);
    document.getElementById('zoomOut').addEventListener('click', zoomOut);
    document.getElementById('rotateLeft').addEventListener('click', rotateLeft);
    document.getElementById('rotateRight').addEventListener('click', rotateRight);


    // Load full google photorealistic tileset
    const newTileset = await Cesium.Cesium3DTileset.fromIonAssetId(2275207);
    viewer.scene.primitives.add(newTileset);
    newTileset.show = false; // Set the initial state to 'on'

    // Apply default style to the tileset if available
    const newExtras = newTileset.asset.extras;
    if (
        Cesium.defined(newExtras) &&
        Cesium.defined(newExtras.ion) &&
        Cesium.defined(newExtras.ion.defaultStyle)
    ) {
        newTileset.style = new Cesium.Cesium3DTileStyle(newExtras.ion.defaultStyle);
    }

    // Remove the default satellite imagery layers
    viewer.imageryLayers.removeAll();

    // Create a switch event listener for the new 3D Tileset
    const newTilesetSwitch = document.getElementById("3dTileSwitch");
    newTilesetSwitch.checked = false; // Set the initial state to 'on'

    newTilesetSwitch.addEventListener("change", (event) => {
        newTileset.show = event.target.checked;
        const status = event.target.checked ? "shown" : "hidden";
        console.log(`3D Tileset Layer ${status}`);
    });

    console.log("Initial load of 3D Tileset layer with the switch turned on.");






    // Load OSM buildings 3D Tileset
    const osmBuildingsTileset = viewer.scene.primitives.add(
        await Cesium.Cesium3DTileset.fromIonAssetId(96188)
    );

    // Apply default style to the OSM buildings tileset if available
    const osmExtras = osmBuildingsTileset.asset.extras;
    if (
        Cesium.defined(osmExtras) &&
        Cesium.defined(osmExtras.ion) &&
        Cesium.defined(osmExtras.ion.defaultStyle)
    ) {
        osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle(
            osmExtras.ion.defaultStyle
        );
    }

    // Create a switch event listener for the OSM buildings Tileset
    const osmBuildingsSwitch = document.getElementById("osmBuildingsSwitch");

    // Set the switch to the on position initially
    osmBuildingsSwitch.checked = true;

    osmBuildingsSwitch.addEventListener("change", (event) => {
        osmBuildingsTileset.show = event.target.checked;
    });

    // Show the OSM buildings Tileset initially
    osmBuildingsTileset.show = true;



    /*
    
    // Set the OSM Maps switch to the on position initially
    const osmMapsSwitch = document.getElementById("osmMapsSwitch");
    osmMapsSwitch.checked = true;
    
    // Initialize the Cesium OpenStreetMap layer
    const osmLayer = new Cesium.UrlTemplateImageryProvider({
      url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
    });
    osmLayer.name = "OpenStreetMap"; // Set the name of the layer
    osmLayer.order = 1; // Set a higher order value to ensure it's above other layers
    
    // Add the OpenStreetMap layer to the viewer initially
    viewer.imageryLayers.addImageryProvider(osmLayer);
    
    // Function to toggle the visibility of the OSM Maps layer based on switch state
    function toggleOSMMapLayer() {
      try {
        if (osmMapsSwitch.checked) {
          // Show the OSM Maps layer
          if (!viewer.imageryLayers.contains(osmLayer)) {
            viewer.imageryLayers.addImageryProvider(osmLayer);
            console.log("OpenStreetMap layer added to viewer");
          }
        } else {
          // Hide the OSM Maps layer
          if (viewer.imageryLayers.contains(osmLayer)) {
            console.log("Before removal, layers:", viewer.imageryLayers.length);
            viewer.imageryLayers.remove(osmLayer);
            console.log("OpenStreetMap layer removed from viewer");
            console.log("After removal, layers:", viewer.imageryLayers.length);
          } else {
            console.log("OpenStreetMap layer not found in viewer");
          }
        }
      } catch (error) {
        console.error("Error toggling OSM Maps layer:", error);
      }
    }
    
    // Create a switch event listener for the OSM Maps layer
    osmMapsSwitch.addEventListener("change", () => {
      console.log("Switch state changed:", osmMapsSwitch.checked);
      toggleOSMMapLayer();
    });
    
    */
    // Initialize the Cesium OpenStreetMap layer
    const osmLayer = new Cesium.UrlTemplateImageryProvider({
        url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
    });
    osmLayer.name = "OpenStreetMap"; // Set the name of the layer
    osmLayer.order = 1; // Set a higher order value to ensure it's above other layers

    // Add the OpenStreetMap layer to the viewer
    viewer.imageryLayers.addImageryProvider(osmLayer);
    console.log("OpenStreetMap layer added to viewer");







    // Load mtscso GeoJsonDataSource
    const mtscsoResource = await Cesium.IonResource.fromAssetId(2460335);
    const mtscsoDataSource = await Cesium.GeoJsonDataSource.load(mtscsoResource);

    // Modify the billboard color and style before adding the data source
    mtscsoDataSource.entities.values.forEach((entity) => {
        if (entity.billboard) {
            // Change the billboard color to red
            entity.billboard.color = Cesium.Color.RED;

            // Change the billboard style to Circle using the createCircleImage function
            entity.billboard.image = createCircleImage();
        }
    });

    // Create a switch event listener for mtscso
    const mtscsoSwitch = document.getElementById("mtscsoSwitch");

    // Set the switch to the off position initially
    mtscsoSwitch.checked = false;

    mtscsoSwitch.addEventListener("change", (event) => {
        if (event.target.checked) {
            viewer.dataSources.add(mtscsoDataSource);
            console.log("mtscsoDataSource added to viewer");
        } else {
            viewer.dataSources.remove(mtscsoDataSource);
            console.log("mtscsoDataSource removed from viewer");
        }
    });

    // Function to create a red circle image
    function createCircleImage() {
        const canvas = document.createElement("canvas");
        canvas.width = 15;
        canvas.height = 15;
        const context = canvas.getContext("2d");
        context.beginPath();
        context.arc(10, 10, 8, 0, 2 * Math.PI);
        context.fillStyle = "red";
        context.fill();
        return canvas;
    }








    // Load mtsparks GeoJsonDataSource
    const mtsparksResource = await Cesium.IonResource.fromAssetId(2482444);
    const mtsparksDataSource = await Cesium.GeoJsonDataSource.load(mtsparksResource);

    // Modify the polyline/polygon color and disable the outline before adding the data source
    mtsparksDataSource.entities.values.forEach((entity) => {
        if (entity.polygon) {
            // Change the polygon material to a slightly transparent green color
            entity.polygon.material = new Cesium.Color.fromCssColorString('rgba(0, 255, 0, 0.5)');

            // Disable the polygon outline
            entity.polygon.outline = false;

            // Set the height reference to clamp the polygon to the ground
            entity.polygon.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
        }
    });

    // Create a switch event listener for mtsparks
    const mtsparksSwitch = document.getElementById("mtsparksSwitch");

    // Set the switch to the off position initially
    mtsparksSwitch.checked = false;

    mtsparksSwitch.addEventListener("change", (event) => {
        mtsparksDataSource.entities.values.forEach((entity) => {
            entity.show = event.target.checked;
        });
    });

    // Initial load of mtsparks with the adjusted properties
    viewer.dataSources.add(mtsparksDataSource);
    mtsparksDataSource.entities.values.forEach((entity) => {
        entity.show = false; // Make sure entities are hidden by default
    });








    // Define mtssubwayDataSource outside of the function scope
    let mtssubwayDataSource;

    // Function to handle loading or unloading mtssubwayDataSource
    const toggleMtssubwayLayer = async () => {
        if (mtssubwaySwitch.checked) {
            // Load mtssubway GeoJsonDataSource
            const mtssubwayResource = await Cesium.IonResource.fromAssetId(2482445);
            mtssubwayDataSource = await Cesium.GeoJsonDataSource.load(mtssubwayResource);

            // Modify the polyline color before adding the data source
            mtssubwayDataSource.entities.values.forEach((entity) => {
                if (entity.polyline) {
                    // Change the polyline color to red
                    entity.polyline.material = Cesium.Color.BLUE;
                }
            });

            // Add the loaded mtssubwayDataSource to the viewer
            viewer.dataSources.add(mtssubwayDataSource);
            console.log("mtssubwayDataSource added to viewer");
        } else {
            // If the switch is turned off, remove the mtssubwayDataSource from the viewer
            if (mtssubwayDataSource) {
                viewer.dataSources.remove(mtssubwayDataSource);
                console.log("mtssubwayDataSource removed from viewer");
            }
        }
    };

    // Add the event listener to the switch
    mtssubwaySwitch.addEventListener("change", toggleMtssubwayLayer);









    // Define mtssubwayDataSource outside of the function scope
    let mtsrailDataSource;

    // Function to handle loading or unloading mtsrailDataSource
    const toggleMtsrailLayer = async () => {
        if (mtsrailSwitch.checked) {
            // Load mtssubway GeoJsonDataSource
            const mtsrailResource = await Cesium.IonResource.fromAssetId(2506683);
            mtsrailDataSource = await Cesium.GeoJsonDataSource.load(mtsrailResource);

            // Modify the polyline color before adding the data source
            mtsrailDataSource.entities.values.forEach((entity) => {
                if (entity.polyline) {
                    // Change the polyline color to red
                    entity.polyline.material = Cesium.Color.RED;
                }
            });

            // Add the loaded mtssubwayDataSource to the viewer
            viewer.dataSources.add(mtsrailDataSource);
            console.log("mtsrailDataSource added to viewer");
        } else {
            // If the switch is turned off, remove the mtsrailDataSource from the viewer
            if (mtsrailDataSource) {
                viewer.dataSources.remove(mtsrailDataSource);
                console.log("mtsrailDataSource removed from viewer");
            }
        }
    };

    // Add the event listener to the switch
    mtsrailSwitch.addEventListener("change", toggleMtsrailLayer);












    // Load mtsgas GeoJsonDataSource
    const mtsgasResource = await Cesium.IonResource.fromAssetId(2482499);
    const mtsgasDataSource = await Cesium.GeoJsonDataSource.load(mtsgasResource);

    // Modify the polyline color and width before adding the data source
    mtsgasDataSource.entities.values.forEach((entity) => {
        if (entity.polyline) {
            // Change the polyline color to black
            entity.polyline.material = Cesium.Color.BLACK;

            // Change the polyline width
            entity.polyline.width = 3; // Adjust the width as needed
        }
    });

    // Create a switch event listener for mtsgas
    const mtsgasSwitch = document.getElementById("mtsgasSwitch");
    mtsgasSwitch.addEventListener("change", (event) => {
        if (event.target.checked) {
            viewer.dataSources.add(mtsgasDataSource);
            console.log("mtsgasDataSource added to viewer");
        } else {
            viewer.dataSources.remove(mtsgasDataSource);
            console.log("mtsgasDataSource removed from viewer");
        }
    });

    // Set the initial state of the switch to 'off'
    mtsgasSwitch.checked = false;

    // Trigger the 'change' event to ensure the initial state is applied
    const initialChangeEvent = new Event("change");
    mtsgasSwitch.dispatchEvent(initialChangeEvent);



    // Load electriclines GeoJsonDataSource
    const electriclinesResource = await Cesium.IonResource.fromAssetId(2485569);
    const electriclinesDataSource = await Cesium.GeoJsonDataSource.load(electriclinesResource);

    // Modify the polyline color and width before adding the data source
    electriclinesDataSource.entities.values.forEach((entity) => {
        if (entity.polyline) {
            // Change the polyline color to your desired color
            entity.polyline.material = Cesium.Color.YELLOW; // Change to the color you want
            // Change the polyline width
            entity.polyline.width = 3; // Adjust the width as needed
        }
    });

    // Create a switch event listener for electriclines
    const electriclinesSwitch = document.getElementById("electriclinesSwitch");
    electriclinesSwitch.addEventListener("change", (event) => {
        if (event.target.checked) {
            viewer.dataSources.add(electriclinesDataSource);
            console.log("electriclinesDataSource added to viewer");
        } else {
            viewer.dataSources.remove(electriclinesDataSource);
            console.log("electriclinesDataSource removed from viewer");
        }
    });

    // Set the initial state of the switch to 'off'
    electriclinesSwitch.checked = false;

    // Trigger the 'change' event to ensure the initial state is applied
    const initialChangeEventElectriclines = new Event("change");
    electriclinesSwitch.dispatchEvent(initialChangeEventElectriclines);





    // Define mtsstreetsDataSource outside of the function scope
    let mtsstreetsDataSource;

    // Function to handle loading or unloading mtsstreetsDataSource
    const toggleMtsstreetsLayer = async () => {
        if (mtsstreetsSwitch.checked) {
            // Load mtsstreets GeoJsonDataSource
            const mtsstreetsResource = await Cesium.IonResource.fromAssetId(2477200);
            mtsstreetsDataSource = await Cesium.GeoJsonDataSource.load(mtsstreetsResource);

            // Modify the polyline color before adding the data source
            mtsstreetsDataSource.entities.values.forEach((entity) => {
                if (entity.polyline) {
                    // Change the polyline color to red
                    entity.polyline.material = Cesium.Color.GREY;
                }
            });

            // Add the loaded mtsstreetsDataSource to the viewer
            viewer.dataSources.add(mtsstreetsDataSource);
            console.log("mtsstreetsDataSource added to viewer");
        } else {
            // If the switch is turned off, remove the mtsstreetsDataSource from the viewer
            if (mtsstreetsDataSource) {
                viewer.dataSources.remove(mtsstreetsDataSource);
                console.log("mtsstreetsDataSource removed from viewer");
            }
        }
    };

    // Add the event listener to the switch
    mtsstreetsSwitch.addEventListener("change", toggleMtsstreetsLayer);






    // Function to add or remove the circle based on the toggle state
    function toggleCircle(checked) {
        if (checked) {
            // Add the circle
            redCircle.show = true;
        } else {
            // Remove the circle
            redCircle.show = false;
        }
    }




    // Add the circle entity
    const redCircle = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-73.9578910346863, 40.823067941896106), // Location coordinates
        name: "White circle on surface",
        ellipse: {
            semiMinorAxis: 1000.0, // Adjust as needed
            semiMajorAxis: 1000.0, // Equal to semiMinorAxis for a circle
            material: Cesium.Color.WHITE.withAlpha(0.5),
            outline: true,
            outlineColor: Cesium.Color.GRAY,
            outlineWidth: 1,
        },
        show: false, // Initially hide the circle
    });

    // Get the toggle switch element
    const circleToggle = document.getElementById('circleToggle');

    // Add event listener for change event
    circleToggle.addEventListener('change', function () {
        toggleCircle(circleToggle.checked);
    });

    // Initially set the circle state based on the toggle switch
    toggleCircle(circleToggle.checked);






    var busDepotConfig = {
        name: 'MTA Manhattanville Bus Depot',
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([
                -73.95879964635739, 40.81992411443654, // Southwest
                -73.95667319346998, 40.81903869944404, // Southeast
                -73.95709731406289, 40.818494163354465, // Northeast
                -73.95919451724812, 40.81938401269745  // Northwest
            ]),
            material: Cesium.Color.RED.withAlpha(0.3),
            extrudedHeight: 10,
            height: -20
        }
    };






    var riversideparkConfig = {
        name: 'Riverside Park Building',
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([
                -73.95824586931636, 40.81984965321277, // Southwest
                -73.95770016639841, 40.82052506940359, // Southeast
                -73.9571646635368, 40.82047489586689, // Northeast
                -73.95561935527901, 40.8190044084355,
                -73.95621605846766, 40.8190044084355
            ]),
            material: Cesium.Color.BLUE.withAlpha(0.3),
            extrudedHeight: 10,
            height: -20
        }
    };







    // Define the configuration for the waste water treatment polygon
    var wasteWaterTreatmentConfig = {
        name: 'North River Sewage Treatment Plant',
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([
                -73.95969799948558, 40.82366630333311, // Southwest
                -73.95666103594826, 40.8284532443468,  // Southeast
                -73.95498357953169, 40.827814452446894, // Northeast
                -73.95467659404369, 40.82821266110685, // Northwest
                -73.9534925071614, 40.82773978805692, // Northwest (repeat to close polygon)
                -73.95731886199398, 40.82272878575034, // Southwest (repeat to close polygon)
                -73.95969799948558, 40.82366630333311  // Southwest (repeat to close polygon)
            ]),
            material: Cesium.Color.RED.withAlpha(0.3), // Red with 50% opacity
            extrudedHeight: 12, // Extrude the polygon upward by 10 units
            height: -40 // Position the polygon lower by setting the height to -20 units
        }
    };





    // Define the configuration for the gas pipeline polygon
    var gasPipelineConfig = {
        name: 'Williams Gas Pipeline',
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([
                -73.95951186211099, 40.82125580458398, // Southwest
                -73.95918564550357, 40.82166628856237, // Southeast
                -73.95895805252165, 40.82152563349923, // Northeast
                -73.95914012690719, 40.82131608560706, // Northwest
                -73.95901874398349, 40.82124719300478, // Northwest (repeat to close polygon)
                -73.9592140946263, 40.82111084285179
            ]),
            material: Cesium.Color.RED.withAlpha(0.3), // Red with 50% opacity
            extrudedHeight: 1, // Extrude the polygon upward by 20 units
            height: -60 // Position the polygon lower by setting the height to -20 units
        }
    };



    // Define the configuration for the marine transfer station polygon
    var marineTransferStationConfig = {
        name: 'Marine Transfer Station',
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([
                -73.9596203436524, 40.82306100053222, // Southwest
                -73.95868601924464, 40.82271381199052, // Northwest 
                -73.95849007397292, 40.82186391569169, // Northeast
                -73.95877921272704, 40.82149863776738, // Southeast
                -73.95896321011679, 40.82158182004503, // Southeast
                -73.9587624856916, 40.82181147492217, // Southwest
                -73.95923562183671, 40.822252699383846, // Northwest
                -73.95999789673716, 40.82258180752193 // Southwest
            ]),
            material: Cesium.Color.RED.withAlpha(0.3), // Red with 50% opacity
            extrudedHeight: 5, // Extrude the polygon upward by 10 units
            height: -60 // Position the polygon lower by setting the height to -60 units
        }
    };






    // Define the configuration for the white line
    var scaleLineConfig = {
        name: 'Scale',
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([
                -73.96312043113366, 40.81840372298463,
                -73.96568263373722, 40.81955074889975,
                -73.95474816347131, 40.834159938739,
                -73.95218596086774, 40.83328620853362
            ]),
            width: 1, // Line width
            material: new Cesium.PolylineOutlineMaterialProperty({
                color: Cesium.Color.WHITE.withAlpha(0.7), // White color with 70% transparency
                outlineWidth: 0,
                outlineColor: Cesium.Color.BLACK // Black outline (optional)
            }),
            show: true // Initially set to on
        }
    };

    // Create the scale line
    var scaleLine = viewer.entities.add(scaleLineConfig);

    // Define the configuration for the scale label
    var scaleLabelConfig = {
        name: 'Scale',
        position: Cesium.Cartesian3.fromDegrees(-73.9608, 40.8264), // Coordinates
        label: {
            text: '1.2m / 1.9km',
            font: 'bold 12px Arial',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -50), // Offset the label downward
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000), // Display label when distance from camera is between 0 and 5,000 meters
            show: true // Initially set to on
        }
    };

    // Create the scale label
    var scaleLabel = createLabel(scaleLabelConfig);

    // Function to create the label
    function createLabel(labelConfig) {
        return viewer.entities.add({
            name: labelConfig.name,
            position: labelConfig.position,
            label: labelConfig.label
        });
    }

    // Create a switch event listener for the scale line and label
    const scaleSwitch = document.getElementById("scaleSwitch");

    scaleSwitch.addEventListener("change", (event) => {
        if (event.target.checked) {
            // Show scale line and label
            scaleLine.show = true;
            scaleLabel.show = true;
        } else {
            // Hide scale line and label
            scaleLine.show = false;
            scaleLabel.show = false;
        }
    });

    // Set the initial state of the switch to match the initial state of the scale line and label
    scaleSwitch.checked = true;

    // Trigger the 'change' event to ensure the initial state is applied
    scaleSwitch.dispatchEvent(new Event("change"));












    // Define the configuration for the marine transfer label
    var marineTransferLabelConfig = {
        name: 'MTS',
        position: Cesium.Cartesian3.fromDegrees(-73.95948442468283, 40.822656278896815), // Coordinates
        label: {
            text: 'Marine Transfer Station',
            font: 'bold 16px Arial',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -50), // Offset the label downward
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 7000), // Display label when distance from camera is between 0 and 10,000 meters
            show: true // Set to show initially
        }
    };

    // Create the marine transfer label
    var marineTransferLabel = createLabel(marineTransferLabelConfig);

    // Define the configuration for the waste water label
    var wasteWaterLabelConfig = {
        name: 'Waste Water Treatment',
        position: Cesium.Cartesian3.fromDegrees(-73.95668916390169, 40.826045064071984), // Coordinates
        label: {
            text: 'Waste Water Treatment Plant',
            font: 'bold 16px Arial',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -50), // Offset the label downward
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 7000), // Display label when distance from camera is between 0 and 10,000 meters
            show: true // Set to show initially
        }
    };

    // Create the waste water label
    var wasteWaterLabel = createLabel(wasteWaterLabelConfig);

    // Define the configuration for the gas pipeline label
    var gasPipelineLabelConfig = {
        name: 'Gas Pipeline',
        position: Cesium.Cartesian3.fromDegrees(-73.95917709236481, 40.82138267116754), // Coordinates
        label: {
            text: 'Natural Gas Pipeline',
            font: 'bold 16px Arial',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, 0), // Offset the label downward
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 7000), // Display label when distance from camera is between 0 and 10,000 meters
            show: true // Set to show initially
        }
    };

    // Create the gas pipeline label
    var gasPipelineLabel = createLabel(gasPipelineLabelConfig);

    // Define the configuration for the bus depot label
    var busDepotLabelConfig = {
        name: 'Bus Depot',
        position: Cesium.Cartesian3.fromDegrees(-73.95749408193386, 40.81903473878459), // Coordinates
        label: {
            text: 'Manhattanville Bus Depot',
            font: 'bold 16px Arial',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -50), // Offset the label downward
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 7000), // Display label when distance from camera is between 0 and 10,000 meters
            show: true // Set to show initially
        }
    };

    // Create the bus depot label
    var busDepotLabel = createLabel(busDepotLabelConfig);







    // Define the configuration for the bus depot label
    var HarlemLabelConfig = {
        name: 'Harlem, NYC',
        position: Cesium.Cartesian3.fromDegrees(-73.94686109095328, 40.81694713708221), // Coordinates
        label: {
            text: 'Harlem, NYC',
            font: 'bold 20px Arial',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -50), // Offset the label downward
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 7000), // Display label when distance from camera is between 0 and 10,000 meters
            show: true // Set to show initially
        }
    };

    // Create the bus depot label
    var HarlemLabel = createLabel(HarlemLabelConfig);


    // Get the checkbox element
    var labelsSwitch = document.getElementById('labelsSwitch');

    // Function to toggle the visibility of labels
    function toggleLabelsVisibility() {
        // Loop through each label and toggle its visibility
        var labels = [marineTransferLabel, wasteWaterLabel, gasPipelineLabel, busDepotLabel];
        for (var i = 0; i < labels.length; i++) {
            labels[i].label.show = labelsSwitch.checked;
        }
    }

    // Add event listener to the checkbox
    labelsSwitch.addEventListener('change', toggleLabelsVisibility);

    // Initially, call the function to set the initial visibility state
    toggleLabelsVisibility();




    // Define the flyToPlanView function
    function flyToHome() {
        viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
                -73.9666,
                40.8200,
                600 // Adjust the zoom level as needed
            ),
            orientation: {
                heading: Cesium.Math.toRadians(65), // Slightly rotate to the right (adjust angle as needed)
                pitch: Cesium.Math.toRadians(-40), // Look straight down
                roll: 0,
            },
        });
    }

    // Add a click event listener to the flyToPlanView button
    const flyToHomeBtn = document.getElementById('flyToHome');
    flyToHomeBtn.addEventListener('click', flyToHome);




    // Define the flyToPlanView function
    function flyToPlanView() {
        viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
                -73.9579,
                40.8207,
                1700 // Adjust the zoom level as needed
            ),
            orientation: {
                heading: Cesium.Math.toRadians(45), // Slightly rotate to the right (adjust angle as needed)
                pitch: Cesium.Math.toRadians(-90), // Look straight down
                roll: 0,
            },
        });
    }

    // Add a click event listener to the flyToPlanView button
    const flyToPlanViewBtn = document.getElementById('flyToPlanView');
    flyToPlanViewBtn.addEventListener('click', flyToPlanView);




    // Define the flyToMTSCity function
    function flyToMTS() {
        // Fly back to New York City
        viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
                -73.9625,
                40.8217,
                200 // Adjust the zoom level as needed
            ),
            orientation: {
                heading: Cesium.Math.toRadians(65), // clockwise from north
                pitch: Cesium.Math.toRadians(-40), // Look downward
                roll: 0,
            },
        });
    }


    // Add a click event listener to the flyToMTS button
    const flyToMTSButton = document.getElementById('flyToMTS');
    flyToMTSButton.addEventListener('click', flyToMTS);






    // Define the flyToWasteWater function
    function flyToWasteWater() {
        // Fly back to New York City
        viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
                -73.96566879258368,
                40.822689778466355,
                400 // Adjust the zoom level as needed
            ),
            orientation: {
                heading: Cesium.Math.toRadians(65), // clockwise from north
                pitch: Cesium.Math.toRadians(-40), // Look downward
                roll: 0,
            },
        });
    }

    // Add a click event listener to the flyToNewYorkCity button
    const flyToWasteWaterButton = document.getElementById('flyToWasteWater');
    flyToWasteWaterButton.addEventListener('click', flyToWasteWater);





    // Define the flyToBusDepotCity function
    function flyToBusDepot() {
        // Fly back to New York City
        viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
                -73.9614,
                40.8187,
                200 // Adjust the zoom level as needed
            ),
            orientation: {
                heading: Cesium.Math.toRadians(65), // clockwise from north
                pitch: Cesium.Math.toRadians(-40), // Look downward
                roll: 0,
            },
        });
    }

    // Add a click event listener to the flyToNewYorkCity button
    const flyToBusDepotButton = document.getElementById('flyToBusDepot');
    flyToBusDepotButton.addEventListener('click', flyToBusDepot);




    // Define the flyToGasPipeline function
    function flyToGasPipeline() {
        // Fly back to New York City
        viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
                -73.9608,
                40.8211,
                70 // Adjust the zoom level as needed
            ),
            orientation: {
                heading: Cesium.Math.toRadians(65), // clockwise from north
                pitch: Cesium.Math.toRadians(-40), // Look downward
                roll: 0,
            },
        });
    }

    // Add a click event listener to the flyToGasPipeline button
    const flyToGasPipelineButton = document.getElementById('flyToGasPipeline');
    flyToGasPipelineButton.addEventListener('click', flyToGasPipeline);



    // Define the flyToOverview function
    function flyToOverview() {
        // Fly back to New York City
        viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
                -73.9693,
                40.8309,
                700 // Adjust the zoom level as needed
            ),
            orientation: {
                heading: Cesium.Math.toRadians(130), // clockwise from north
                pitch: Cesium.Math.toRadians(-30), // Look downward
                roll: 0,
            },
        });
    }

    // Add a click event listener to the flyToOverview button
    const flyToOverviewButton = document.getElementById('flyToOverview');
    flyToOverviewButton.addEventListener('click', flyToOverview);









    // Function to create a label entity
    function createLabel(config) {
        return viewer.entities.add(config);
    }

    // Group switch handler
    function toggleEJsites(busDepotPolygon, wasteWaterTreatmentPolygon, gasPipelinePolygon, marineTransferStationPolygon) {
        console.log("Toggle function called");
        var isChecked = document.getElementById('EJsitesSwitch').checked;
        console.log("isChecked:", isChecked);
        busDepotPolygon.show = isChecked;
        wasteWaterTreatmentPolygon.show = isChecked;
        gasPipelinePolygon.show = isChecked;
        marineTransferStationPolygon.show = isChecked;
    }

    // Add event listener for the EJsitesSwitch checkbox
    document.getElementById('EJsitesSwitch').addEventListener('change', function () {
        toggleEJsites(busDepotPolygon, wasteWaterTreatmentPolygon, gasPipelinePolygon, marineTransferStationPolygon);
    });

    // Initialize polygons for EJ Sites Group
    var busDepotPolygon = viewer.entities.add(busDepotConfig);
    var wasteWaterTreatmentPolygon = viewer.entities.add(wasteWaterTreatmentConfig);
    var gasPipelinePolygon = viewer.entities.add(gasPipelineConfig);
    var marineTransferStationPolygon = viewer.entities.add(marineTransferStationConfig);


    // Initially hide the layers
    toggleEJsites(busDepotPolygon, wasteWaterTreatmentPolygon, gasPipelinePolygon, marineTransferStationPolygon);






};

// Call the initializeCesium function
initializeCesium();




/*

    async function loadMTSRailDataSource(viewer) {
    // Load mtsrail GeoJsonDataSource
    const mtsrailResource = await Cesium.IonResource.fromAssetId(2482267);
    const mtsrailDataSource = await Cesium.GeoJsonDataSource.load(mtsrailResource);

    // Modify the polyline color and height before adding the data source
    mtsrailDataSource.entities.values.forEach((entity) => {
        if (entity.polyline) {
            // Change the polyline color to pink
            entity.polyline.material = Cesium.Color.RED;

            // Remove the height adjustment from each position in the polyline
            const positions = entity.polyline.positions.getValue(Cesium.JulianDate.now());
            const newPositions = positions.map(position => {
                return new Cesium.Cartesian3.fromDegrees(position.longitude, position.latitude); // Remove height adjustment
            });
            entity.polyline.positions = newPositions;
        }
    });

    // Create a switch event listener for mtsrail
    const mtsrailSwitch = document.getElementById("mtsrailSwitch");

    // Set the switch to the off position initially
    mtsrailSwitch.checked = false;

    mtsrailSwitch.addEventListener("change", (event) => {
        mtsrailDataSource.entities.values.forEach((entity) => {
            entity.show = event.target.checked;
        });
    });

    // Initial load of mtsrail with the pink color and adjusted height
    viewer.dataSources.add(mtsrailDataSource);
    mtsrailDataSource.entities.values.forEach((entity) => {
        entity.show = false; // Make sure entities are hidden by default
    });
}

// Call the function to load the MTSRail data source
loadMTSRailDataSource(viewer);

*/





/*
// Set the switch to the off position initially
const bingMapsSwitch = document.getElementById("bingMapsSwitch");
bingMapsSwitch.checked = false;

// Initialize the Cesium Bing Maps layer but don't add it to the viewer yet
const bingMapsLayer = await Cesium.IonImageryProvider.fromAssetId(4);
bingMapsLayer.name = "Bing Maps"; // Set the name of the layer
bingMapsLayer.order = 1; // Set a higher order value to ensure it's above other layers
console.log("Bing Maps layer initialized, but not added to viewer");

// Create a switch event listener for the Bing Maps layer
bingMapsSwitch.addEventListener("change", (event) => {
// Check the switch state directly within the event listener
if (event.target.checked) {
 // Add the layer to the viewer when the switch is turned on
 viewer.imageryLayers.addImageryProvider(bingMapsLayer);
 console.log("Bing Maps layer added to viewer");
} else {
 // Remove the layer from the viewer when the switch is turned off
 viewer.imageryLayers.remove(bingMapsLayer);
 console.log("Bing Maps layer removed from viewer");
}
});

*/







/*

// Load GeoJsonDataSource with asset ID 2483827
const busDepotsResource = await Cesium.IonResource.fromAssetId(2483827);
const busDepotsDataSource = await Cesium.GeoJsonDataSource.load(busDepotsResource);

// Modify the billboard color and style before adding the data source
busDepotsDataSource.entities.values.forEach((entity) => {
  if (entity.billboard) {
    // Change the billboard color to blue
    entity.billboard.color = Cesium.Color.BLUE;
    // Change the billboard style to your desired image
    entity.billboard.image = createCustomImage(); // Function to create a custom image
  }
});

// Create a switch event listener for the busdepots layer
const busDepotsSwitch = document.getElementById("busDepotsSwitch");

// Set the switch to the off position initially
busDepotsSwitch.checked = false;

busDepotsSwitch.addEventListener("change", (event) => {
  if (event.target.checked) {
    viewer.dataSources.add(busDepotsDataSource);
    console.log("busDepotsDataSource added to viewer");
  } else {
    viewer.dataSources.remove(busDepotsDataSource);
    console.log("busDepotsDataSource removed from viewer");
  }
});

// Initial load of the busdepots layer with modified billboards
if (busDepotsSwitch.checked) {
  viewer.dataSources.add(busDepotsDataSource);
  console.log("Initial load of busDepotsDataSource");
}

// Function to create a custom image
function createCustomImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 20;
  canvas.height = 20;
  const context = canvas.getContext("2d");
  // Customize the image as needed
  context.fillStyle = "blue";
  context.fillRect(0, 0, canvas.width, canvas.height);
  return canvas;
}

*/


/*

    // Define the configuration for the distance label
var distanceLabelConfig = {
  name: 'Distance Label',
  position: Cesium.Cartesian3.fromDegrees(-73.96063040325132, 40.82733361509444), // Adjust the position as needed
  label: {
    text: '1.2 mi (1.93 km)',
    font: 'bold 16px Arial',
    fillColor: Cesium.Color.WHITE,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 2,
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // Set horizontal origin to center
    pixelOffset: new Cesium.Cartesian2(0, -50), // Offset the label downward
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 7000), // Display label when distance from camera is between 0 and 10,000 meters
    rotation: Cesium.Math.toRadians(90), // Rotate the label by 90 degrees
    show: true // Set to show initially
  }
};


// Create the distance label
var distanceLabel = createLabel(distanceLabelConfig);



*/