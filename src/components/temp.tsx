import * as THREE from 'three';
import { TilesRenderer } from '3d-tiles-renderer';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import googleMaps from '../../../components/googleMaps/googleMaps';
import mergeAll from '../../structure/utils/mergeMeshes';
import { checkPointInsideVertices, convertCoordinatesToCartesian, convertVectorArrayTo2DArray, deg2Rad, getBoundingBox, removeCollinearPoints, setbackPolygon } from '../../utils/utils';
import { GOOGLE_API_KEY_TILES } from '../../../constants';
import { generatePlaneFromPoints } from '../model/smartroof/smartroofUtils';

// Import via ES6 modules
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import Subarray from '../subArray/Subarray';
import { getGroundHieght, groupByKey } from './lidarUtils';
import { useStudioStore } from '../../../stores/studio';
import { useMapImagesStore } from '../../../stores/mapImages';

// Add the extension functions
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

export default class GoogleTiles {

    constructor(stage) {
        this.stage = stage;
        this.showTileMesh();
        this.tilesLoaded = false;
        this.tileMeshHidden = false;
        this.isAbove = true;
        this.errorHandled = false;
    }

    /**
     * The function initializes false components for a 3D scene in JavaScript using the THREE.js
     * library.
     */
    initFalseComponents() {
        this.falseRenderer = new THREE.WebGLRenderer({ antialias: true });
        this.falseRenderer.setSize(window.innerWidth, window.innerHeight);

        this.falseScene = new THREE.Scene();
        this.groundDimension = this.stage.imageDimensions.width;
        if (this.groundDimension < 60) {
            this.groundDimension = 60;
        }
        const perspectiveCameraZ = (this.groundDimension / (2 * Math.tan(deg2Rad(45 / 2)))) * 2.5;

        this.falseCamera = new THREE.PerspectiveCamera(
            45,
            this.stage.screenDimensions.width / this.stage.screenDimensions.height,
            1,
            perspectiveCameraZ + 200,
        );
        this.falseCamera.up = new THREE.Vector3(0, 0, 1);
        this.falseCamera.position.set(0, 0, perspectiveCameraZ);
        this.falseCamera.lookAt(new THREE.Vector3(0, 0, 0));

        this.falseScene.add(this.falseCamera);
    }



    // Do change elevation value as per lat long for now
    async load3DMesh(elevation = 0) {
        try {
            this.errorHandled = false;
            elevation = this.elevation - 34;
            this.initFalseComponents();
            this.tilesRenderer = new TilesRenderer('https://tile.googleapis.com/v1/3dtiles/root.json');
            const loader = new GLTFLoader(this.tilesRenderer.manager);
            const dracoLoader = new DRACOLoader(this.tilesRenderer.manager);
            dracoLoader.setDecoderPath('https://unpkg.com/three@0.153.0/examples/jsm/libs/draco/gltf/');
            loader.setDRACOLoader(dracoLoader);
            this.tilesRenderer.manager.addHandler(/\.gltf$/, loader);
            this.timer = null;
            this.tilesRenderer.preprocessURL = (url) => {
                if (url.indexOf('tile.googleapis') === -1) {
                    return url;
                }
                if (url.indexOf('session') !== -1) {
                    // get the session id from the url
                    this.sessionId = url.split('session=')[1].split('&')[0];
                }
                if (this.sessionId && url.indexOf('session') === -1) {
                    url += '?session=' + this.sessionId;
                }
                if (url.indexOf('?') === -1) {
                    url += '?';
                } else {
                    url += '&';
                }
                return url + 'key=' + GOOGLE_API_KEY_TILES
            }
            let loaded = false;
            setTimeout(() => {
                loaded = true
            }, 3000);
            this.timer = null;
            this.tilesRenderer.manager.onLoad = () => {
                // console.log({ ...this.tilesRenderer.stats });
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    // Code to execute after 300ms
                    if (loaded && this.tilesRenderer.stats.downloading === 0 && this.tilesRenderer.stats.parsing === 0) {
                        // console.log('#### NOT COMLETE', { ...this.tilesRenderer.stats });
                        setTimeout(() => {
                            if (loaded && this.tilesRenderer.stats.downloading === 0 && this.tilesRenderer.stats.parsing === 0) {
                                loaded = false;
                                this.mergeTiles();
                                // console.log('Loaded', { ...this.tilesRenderer.stats });
                            }
                        }, 2000);
                    }
                }, 3000);
            };
            this.tilesRenderer.setCamera(this.falseCamera);
            this.tilesRenderer.setResolutionFromRenderer(this.falseCamera, this.falseRenderer);
            this.falseScene.add(this.tilesRenderer.group);

            const groundPosition = convertCoordinatesToCartesian(useMapImagesStore().latitude, useMapImagesStore().longitude, elevation);

            /* Move the 3d loaded mesh to ground */
            const mat4 = new THREE.Matrix4();
            mat4.lookAt(new THREE.Vector3(0, 0, 0), groundPosition.clone().negate(), new THREE.Vector3(0, 0, 1));
            mat4.setPosition(groundPosition);
            this.tilesRenderer.group.applyMatrix4(mat4.invert());
            this.groundPosition = groundPosition;
        } catch (e) {
            if (!this.errorHandled) {
                this.errorHandled = true; // Set the flag to true
                this.stage.eventManager.errorTilesLoading(this.notificationObject);
                useStudioStore().SET_GOOGLE3D_STATUS(false);
                console.error("Error: ", e);
            }
        }
    }

    /**
     * The function retrieves the elevation of a given location using the Google Maps Elevation Service.
     */
    async getElevation() {
        this.notificationObject = this.stage.eventManager.setTilesLoading();
        let elevation = null;
        await googleMaps.then(async (google) => {
            const elevatorService = new google.maps.ElevationService();
            let locations = [await new google.maps.LatLng(this.stage.latitude, this.stage.longitude)];
            let positionalRequest = {
                'locations': locations
            };
            const elevationResponse = await elevatorService.getElevationForLocations(positionalRequest, function (results, status) {
                // infowindow.setPosition(location);
                if (status === google.maps.ElevationStatus.OK) {
                    // Retrieve the first result
                    if (results[0]) {
                        // Open the infowindow indicating the elevation at the clicked position.
                        console.log('The elevation at this point is ' +
                            results[0].elevation + ' meters.');
                    } else {
                        console.log('No results found');
                    }
                } else {
                    console.log('Elevation service failed due to: ' + status);
                }
            });

            if (!(elevationResponse.results && elevationResponse.results.length)) {
                window.alert(`Insufficient elevation data for place: ${place.name}`);
                return;
            }
            elevation = elevationResponse.results[0].elevation || 10;
            this.elevation = elevation;
            this.load3DMesh();
        });
        return elevation;
    }

    /**
     * This function recursively retrieves all meshes from a given group and applies transformations to
     * each mesh.
     * @param group - The "group" parameter is a THREE.Group object, which is a container for multiple
      objects in a 3D scene. It can contain other groups, meshes, lights, cameras, and other objects.
     * This function recursively searches through the children of the group and returns an array of all
     * the meshes found
     * @returns an array of THREE.Mesh objects that are descendants of the input THREE.Group object.
     * The meshes have also had their transformations applied based on the matrixWorld of the input
     * group.
     */
    getMeshesFromGroup(group, boundingBox) {
        const meshes = [];

        group.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
                // Check if the mesh is inside the bounding box
                const childBoundingBox = new THREE.Box3().setFromObject(child);
                if (boundingBox.containsBox(childBoundingBox)) {
                    // Apply transformations to the mesh
                    child.applyMatrix4(group.matrixWorld);
                    meshes.push(child);
                }
            } else if (child instanceof THREE.Group) {
                const childMeshes = this.getMeshesFromGroup(child, boundingBox);
                meshes.push(...childMeshes);
            }
        });

        return meshes;
    }


    /**
     * The function merges all meshes in the "TilesRenderer.TilesGroup" of a scene into a single mesh.
     */
    mergeTiles() {
        try {
            clearTimeout(this.timer);
            let finalMeshes = [];
            // calculate ground box for selecting mesh inside it
            this.stage.ground.plane.geometry.computeBoundingBox(); // computes a LOCAL bounding box
            let groundBox = new THREE.Box3().copy(this.stage.ground.plane.geometry.boundingBox);
            groundBox.applyMatrix4(this.stage.ground.plane.matrixWorld);
            groundBox.max = new THREE.Vector3(this.groundDimension / 2, this.groundDimension / 2);
            groundBox.min = new THREE.Vector3(-this.groundDimension / 2, -this.groundDimension / 2);
            groundBox.max.multiplyScalar(4);
            groundBox.min.multiplyScalar(4);
            groundBox.max.z = 500;
            groundBox.min.z = -200;

            // fetch meshes around ground from all tiles
            let sceneGroups = this.falseScene.children;
            for (let index = 0; index < sceneGroups.length; index++) {
                if (sceneGroups[index].name === 'TilesRenderer.TilesGroup') {
                    finalMeshes = this.getMeshesFromGroup(sceneGroups[index], groundBox);
                    this.falseScene.remove(sceneGroups[index]);
                    break;
                }
            }

            // create tiles group and merged mesh
            this.tilesGroup = new THREE.Group();
            for (let index = 0; index < finalMeshes.length; index++) {
                this.tilesGroup.add(finalMeshes[index]);
            }

            // Filter out meshes whose geometry does not have both position and uv attributes
            this.tilesGroup.children = this.tilesGroup.children.filter(mesh => {
                const { attributes } = mesh.geometry;
                return attributes?.position && attributes?.uv;
            });
            this.mergedGroup = mergeAll(this.tilesGroup);


            // notification & flags
            if (finalMeshes.length > 0) {
                this.addClippingPlanes();
                this.fitToGround();
                this.enableShadows();

                this.stage.sceneManager.scene.add(this.tilesGroup);
                this.tilesLoaded = true;

                useStudioStore().SET_FITGOOGLE3D_STATUS(true);
                this.isAbove = true;
                if (!this.stage.visualManager.in3D) {
                    this.shiftMeshBelowGround();
                }
                this.stage.eventManager.completeTilesLoading(this.notificationObject);
            } else {
                useStudioStore().SET_GOOGLE3D_STATUS(false);
                useStudioStore().SET_FITGOOGLE3D_STATUS(false);
                this.stage.eventManager.errorTilesLoading(this.notificationObject);
                console.log("Geometries are null for merging");
            }
        } catch (e) {
            if (!this.errorHandled) {
                this.errorHandled = true; // Set the flag to true
                this.stage.eventManager.errorTilesLoading(this.notificationObject);
                useStudioStore().SET_GOOGLE3D_STATUS(false);
                console.error(e);
            }
        }
        //this.disposeFalseComponents();
    }

    /**
     * The function "fitToGoogleTiles" updates the tilt and height of a smart roof model based on lidar
     * data.
     * @param smartRoofModel - The smartRoofModel is an object that represents a roof model. It likely
     * contains information about the roof's geometry, such as vertices, faces, and other properties.
     */
    fitToGoogleTiles(smartRoofModel) {
        // computing bounds tree for the BVH Raycasting algorithm before raycast.
        // this.mergedGroup.children[0].geometry.computeBoundsTree({ maxDepth: 60 }); already coputed in fit to ground
        let relativePitch = [];
        let oldHeights = [];
        // updating the tilt first and then updating the height to match the new pitch and height.
        relativePitch = this.getRelativeHeightAndTiltFromPlanes(smartRoofModel).relativePitch;
        smartRoofModel.updateTiltFromLidar(relativePitch);
        oldHeights = this.getRelativeHeightAndTiltFromPlanes(smartRoofModel).oldHeights;
        smartRoofModel.updateHeightFromLidar(oldHeights);
    }

    // this function returns the relative pitch and old height array after intersection with the tileMesh
    getRelativeHeightAndTiltFromPlanes(smartRoofModel) {
        let relativePitch = [];
        let oldHeights = [];
        smartRoofModel.tileIntersections = [];
        const NUMBER_OF_TESTS = 3000;
        const children = smartRoofModel.getChildren();
        const largestArea = smartRoofModel.getLargestRoof().computeArea();
        for (let i = 0, len = children.length; i < len; i++) {
            const child = children[i];
            child.lidarSamplePoints = [];
            if (!child.isDeleted && child.computeArea() > largestArea / 3) {
                const grandChildren = child.getChildren();
                const grandChildrenVertices = [];
                for (let j = 0, len2 = grandChildren.length; j < len2; j += 1) {
                    grandChildrenVertices.push(setbackPolygon(grandChildren[j].get2DVertices(), 0.550));
                }

                let convexHull = child.lidarConvexHull;
                const convexHullVertices = [];
                if (!convexHull) {
                    convexHull = child.getConvexHull2D();
                }
                if (convexHull) {
                    for (let j = 0; j < convexHull.length; j += 1) {
                        const vertex = convertVectorArrayTo2DArray(convexHull[j]);
                        convexHullVertices.push(setbackPolygon(vertex, 0.550));
                    }
                }
                // let vertices = child.get2DVertices();
                let vertices = setbackPolygon(child.get2DVertices(), 1);
                if (vertices.length === 0) {
                    vertices = child.get2DVertices();
                }
                const bBox = getBoundingBox(vertices);
                const allPoints = [];
                for (let j = 0; j < NUMBER_OF_TESTS; j++) {
                    const randomY = bBox.min.y + (Math.random() * (bBox.max.y - bBox.min.y));
                    const randomX = bBox.min.x + (Math.random() * (bBox.max.x - bBox.min.x));
                    const point = [randomX, randomY];
                    // checks
                    let check1 = true;
                    let check2 = true;
                    let check3 = true;
                    check1 = checkPointInsideVertices(vertices, point);
                    const check4 = checkPointInsideVertices(child.get2DVertices(), point);
                    for (let k = 0, len3 = grandChildrenVertices.length; k < len3; k++) {
                        if (checkPointInsideVertices(grandChildrenVertices[k], point) && !(grandChildren[k] instanceof Subarray)) {
                            check2 = false;
                        }
                    }
                    if (convexHullVertices.length > 0) {
                        for (let k = 0; k < convexHullVertices.length; k += 1) {
                            check3 = !checkPointInsideVertices(convexHullVertices[j], point);
                            if (!check3) {
                                break;
                            }
                        }
                    }
                    if (check4 && check2 && check3) {
                        const origin = new THREE.Vector3(point[0], point[1], 100);

                        let intersections = this.getIntersectionsFromBVHRaycaster(origin);
                        let temp;
                        if (intersections.length > 0) {
                            temp = intersections[0].point;
                            allPoints.push(temp.clone());
                            smartRoofModel.tileIntersections.push(temp);
                            oldHeights.push(child.getZOnTopSurface(origin.x, origin.y) - temp.z);
                            origin.z = temp.z;
                            child.lidarSamplePoints.push(origin);
                        }
                    }
                }
                if (allPoints.length > 2) {
                    const data = generatePlaneFromPoints(allPoints, child)
                    relativePitch.push(data.angle / child.tilt);
                } else {
                    relativePitch.push(1);
                }
            }

        }
        return {
            relativePitch: relativePitch,
            oldHeights: oldHeights,
        };
    }

    getIntersectionsFromBVHRaycaster(origin) {

        let meshTile = this.mergedGroup.children[0];
        // Direction is arbitrary, since any direction should work.
        const direction = new THREE.Vector3(0, 0, -1);
        // smartRoofModel.stage.sceneManager.scene.add(arrowHelper);
        direction.normalize();
        // Setting "firstHitOnly" to true means the Mesh.raycast function will use the
        // bvh "raycastFirst" function to return a result more quickly.
        const raycaster = new THREE.Raycaster();
        raycaster.set(origin, direction);
        raycaster.firstHitOnly = true;
        let intersections = [];
        meshTile.raycast(raycaster, intersections);
        return intersections;
    }

    /**
     * This function removes false components from a scene in JavaScript.
     */
    disposeFalseComponents() {
        if (this.falseScene) {
            this.falseScene.traverse(function (o) {
                if (o.geometry) {
                    o.geometry.dispose()
                }
                if (o.material) {
                    if (o.material.length) {
                        for (let i = 0; i < o.material.length; ++i) {
                            o.material[i].dispose()
                        }
                    }
                    else {
                        o.material.dispose()
                    }
                }
            })
            this.falseScene = null
            this.falseCamera = null
            this.falseRenderer && this.falseRenderer.renderLists.dispose()
            this.falseRenderer = null
            this.tilesRenderer = null
            this.hideTileMesh();
        }
    }

    /**
     * it creates an array of boxes on a ground plane in a 3D scene.
     * @param n - The parameter "n" represents the number of boxes to be created in both the x and y
     * directions.
     * @returns The function `getGroundBoxes(n)` returns an array of arrays containing `THREE.Vector2`
     * objects representing the positions of boxes on the ground.
     */
    getGroundBoxes(n) {
        let groundBox = new THREE.Box3().copy(this.stage.ground.plane.geometry.boundingBox);
        groundBox.max = new THREE.Vector3(this.groundDimension / 2, this.groundDimension / 2);
        groundBox.min = new THREE.Vector3(-this.groundDimension / 2, -this.groundDimension / 2);
        let boxSize = groundBox.max.x * 2 / n;
        // Create an array to store the boxes
        let boxes = [];
        // Create the boxes
        for (let i = 0; i < n; i++) {
            boxes[i] = [];
            for (let j = 0; j < n; j++) {
                // Calculate the position of the current box
                var boxX = groundBox.min.x + i * boxSize + boxSize / 2;
                var boxY = groundBox.max.y - j * boxSize - boxSize / 2;
                boxes[i].push(new THREE.Vector3(boxX, boxY, 100));
            }
        }
        return boxes;
    }

    /**
     * The function `fitToGround` detects the ground plane, creates a low-resolution point array, and
     * calculates the minimum height of the ground.
     */
    fitToGround() {
        // computing bounds tree for the BVH Raycasting algorithm before raycast.
        this.mergedGroup.children[0].geometry.computeBoundsTree({ maxDepth: 60 });
        // ground plane detection
        const res = 30;
        let boxes = this.getGroundBoxes(res);
        const groundArray = [];

        // create low resolution point array
        for (let i = 0; i < res; i++) {
            for (let j = 0; j < res; j++) {
                /* The above code is not valid JavaScript code. It appears to be a random string
                of characters. */
                let origin = boxes[i][j];
                let intersections = this.getIntersectionsFromBVHRaycaster(origin);
                let temp;
                if (intersections.length > 0) {
                    temp = intersections[0].point;
                    groundArray.push({ x: i, y: j, z: temp.z });
                }
            }
        }
        const result = groupByKey(groundArray, 'z', 3);
        this.groundDifference = getGroundHieght(result, 1.2);
        this.setMeshZPosition(-this.groundDifference);
        this.mergedGroup.children[0].translateZ(-this.groundDifference);
    }

    // this function clips the extra meshes from the loaded 3D Tile Meshes

    addClippingPlanes() {
        // Create the ground grid geometry
        this.stage.ground.plane.geometry.computeBoundingBox(); // computes a LOCAL bounding box
        let groundBox = new THREE.Box3().copy(this.stage.ground.plane.geometry.boundingBox);

        // Create the clipping planes
        const clippingPlanes = [
            new THREE.Plane(new THREE.Vector3(-1, 0, 0), groundBox.max.x),  // Right plane
            new THREE.Plane(new THREE.Vector3(1, 0, 0), -groundBox.min.x),  // Left plane
            new THREE.Plane(new THREE.Vector3(0, -1, 0), groundBox.max.y),   // Top plane
            new THREE.Plane(new THREE.Vector3(0, 1, 0), -groundBox.min.y) // Bottom plane
        ];
        // Helper for visualization 
        // var helper = new THREE.PlaneHelper(clippingPlanes[0], 10, 0x00ff00); 
        // var helper1 = new THREE.PlaneHelper(clippingPlanes[1], 10, 0x00ff00); 
        // var helper2 = new THREE.PlaneHelper(clippingPlanes[2], 10, 0x00ff00); 
        // var helper3 = new THREE.PlaneHelper(clippingPlanes[3], 10, 0x00ff00); 
        // this.stage.sceneManager.scene.add(helper);
        // this.stage.sceneManager.scene.add(helper1);
        // this.stage.sceneManager.scene.add(helper2);
        // this.stage.sceneManager.scene.add(helper3);

        // Enable clipping for the material
        // this.googleTiles.mergedGroup.clippingPlanes = clippingPlanes;
        this.stage.rendererManager.renderer.clippingPlanes = clippingPlanes;
    }

    hideTileMesh() {
        if (!this.isAbove) {
            this.shiftMeshAboveGround();
        }
        if (this.tilesGroup && this.tilesLoaded) {
            this.stage.sceneManager.scene.remove(this.tilesGroup);
            this.tileMeshHidden = true;
        }
    }

    showTileMesh() {
        if (this.tilesGroup && this.tilesLoaded && this.tileMeshHidden) {
            this.stage.sceneManager.scene.add(this.tilesGroup);
            this.tileMeshHidden = false;
        }
        else {
            this.getElevation();
        }
    }

    /**
     * The function sets the position of a mesh by translating it along the Z-axis.
     * @param position - The position parameter is the amount by which the mesh should be translated
     * along the Z-axis.
     */
    setMeshZPosition(dz) {
        this.tilesGroup.translateZ(dz);
        this.tilesGroup.updateMatrix();
    }
    enableShadows() {
        this.tilesGroup.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }

    /**
     * The function calculates the maximum height of the bounding box of a given mesh.
     * @param mesh - The `mesh` parameter is an object representing a 3D mesh or geometry in the
     * THREE.js library. It is used to calculate the maximum bounding box height of the mesh.
     * @returns the maximum height of the bounding box of the given mesh.
     */
    calculateMaxBoundingBoxHeight() {
        const box = new THREE.Box3().setFromObject(this.mergedGroup.children[0]);
        const size = new THREE.Vector3();
        box.getSize(size);
        return Math.abs(size.z);
    }

    /**
     * The function "shiftMeshBelowGround" moves a mesh below the ground by setting its Z position to a
     * negative value.
     */
    shiftMeshBelowGround() {
        if (this.tilesLoaded && this.isAbove) {
            this.stage.ground.hideGround();
            this.stage.ground.hideGrid();
            let dz = this.calculateMaxBoundingBoxHeight();
            this.setMeshZPosition(-dz);
            this.isAbove = false;
        }
    }

    /**
     * The function "shiftMeshAboveGround" calculates the maximum height of the bounding box of a mesh
     * and sets the mesh's z position to that height.
     */
    shiftMeshAboveGround() {
        if (this.tilesLoaded && !this.isAbove) {
            this.stage.ground.showGround();
            this.stage.ground.showGrid();
            let dz = this.calculateMaxBoundingBoxHeight();
            this.setMeshZPosition(dz);
            this.isAbove = true;
        }
    }

    /**
     * The render function updates the falseRenderer and tilesRenderer if the falseRenderer exists.
     */
    render() {
        if (this.falseRenderer) {
            this.falseRenderer.render(this.falseScene, this.falseCamera);
            this.tilesRenderer.update();
        }
    }

}