// Wait for the entire HTML document to be fully loaded and parsed.
// This prevents "race condition" errors where the script tries to find
// an element that hasn't been created yet.
window.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // DOM ELEMENT REFERENCES
    // =================================================================
    const asteroidSelect = document.getElementById('asteroid-select');
    const infoName = document.getElementById('info-name');
    const infoDiameter = document.getElementById('info-diameter');
    const infoVelocity = document.getElementById('info-velocity');


    // =================================================================
    // MOCK BACKEND DATA
    // =================================================================
    const mockAsteroidData = {
      "element_count": 2,
      "near_earth_objects": {
        "2025-10-04": [
          {
            "id": "3542519",
            "name": "Impactor-2025 (Mock)",
            "nasa_jpl_url": "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=3542519",
            "is_potentially_hazardous_asteroid": true,
            "estimated_diameter": { "kilometers": { "estimated_diameter_max": 0.5 } },
            "close_approach_data": [{ "relative_velocity": { "kilometers_per_second": "25.12" } }],
            "impact_location": { "latitude": -19.9167, "longitude": -43.9345 }
          },
          {
            "id": "3729835",
            "name": "Secondary-Threat (Mock)",
            "nasa_jpl_url": "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=3729835",
            "is_potentially_hazardous_asteroid": false,
            "estimated_diameter": { "kilometers": { "estimated_diameter_max": 0.1 } },
            "close_approach_data": [{ "relative_velocity": { "kilometers_per_second": "15.5" } }],
            "impact_location": { "latitude": 34.0522, "longitude": -118.2437 }
          }
        ]
      }
    };
    const allAsteroids = Object.values(mockAsteroidData.near_earth_objects).flat();


    // =================================================================
    // INTERACTIVE CONTROLS
    // =================================================================
    function populateSelector() {
        allAsteroids.forEach(asteroid => {
            const option = document.createElement('option');
            option.value = asteroid.id;
            option.textContent = asteroid.name;
            asteroidSelect.appendChild(option);
        });
    }

    function updateInfoPanel(asteroidId) {
        const selectedAsteroid = allAsteroids.find(ast => ast.id === asteroidId);
        if (selectedAsteroid) {
            infoName.textContent = selectedAsteroid.name;
            infoDiameter.textContent = selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_max;
            infoVelocity.textContent = parseFloat(selectedAsteroid.close_approach_data[0].relative_velocity.kilometers_per_second).toFixed(2);
        }
    }

    asteroidSelect.addEventListener('change', (event) => {
        const selectedId = event.target.value;
        updateInfoPanel(selectedId);
        visualizeImpacts(selectedId);
    });


    // =================================================================
    // 2D IMPACT MAP (D3.js) - *** FIX APPLIED HERE ***
    // =================================================================
    const mapWidth = 700;  // Define a base width for our aspect ratio
    const mapHeight = 550; // Define a base height for our aspect ratio

    const svg = d3.select("#map-2d").append("svg")
        // Use viewBox to make the map responsive and not dependent on initial clientHeight
        .attr("viewBox", `0 0 ${mapWidth} ${mapHeight}`);

    const projection = d3.geoMercator().scale(110).translate([mapWidth / 2, mapHeight / 1.6]);
    const pathGenerator = d3.geoPath().projection(projection);

    const tooltip = d3.select("body").append("div").attr("class", "tooltip");
    const mapGroup = svg.append("g");

    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(data => {
        mapGroup.selectAll("path")
            .data(data.features)
            .join("path")
            .attr("d", pathGenerator)
            .attr("fill", "#ccc")
            .style("stroke", "#fff")
            .style("stroke-width", 0.5);
        
        if (allAsteroids.length > 0) {
            visualizeImpacts(allAsteroids[0].id);
        }
    });

    function visualizeImpacts(selectedId) {
        mapGroup.selectAll("circle")
            .data(allAsteroids)
            .join("circle")
            .attr("cx", d => projection([d.impact_location.longitude, d.impact_location.latitude])[0])
            .attr("cy", d => projection([d.impact_location.longitude, d.impact_location.latitude])[1])
            .attr("r", d => d.estimated_diameter.kilometers.estimated_diameter_max * 10)
            .style("fill", d => d.id === selectedId ? "orange" : "red")
            .style("opacity", 0.8)
            .style("stroke", d => d.id === selectedId ? "black" : "none")
            .style("stroke-width", 2)
            .on("mouseover", (event, d) => {
                tooltip.style("visibility", "visible").text(d.name);
            })
            .on("mousemove", (event) => {
                tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "hidden");
            });
    }


    // =================================================================
    // 3D ORBITAL SCENE (Three.js)
    // =================================================================
    const sceneContainer = document.getElementById('scene-3d');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, sceneContainer.clientWidth / sceneContainer.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
    renderer.setClearColor(0x111111);
    sceneContainer.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhongMaterial({ color: 0x0077ff }));
    scene.add(earth);
    camera.position.z = 5;

    allAsteroids.forEach(asteroid => {
        const size = asteroid.estimated_diameter.kilometers.estimated_diameter_max * 0.2;
        const asteroidMesh = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 8), new THREE.MeshPhongMaterial({ color: 0x8B4513 }));
        asteroidMesh.position.x = (Math.random() - 0.5) * 6;
        asteroidMesh.position.y = (Math.random() - 0.5) * 6;
        asteroidMesh.position.z = (Math.random() - 0.5) * 6;
        scene.add(asteroidMesh);
    });

    function animate() {
        requestAnimationFrame(animate);
        earth.rotation.y += 0.001;
        renderer.render(scene, camera);
    }
    

    // =================================================================
    // INITIALIZATION
    // =================================================================
    function initialize() {
        if (allAsteroids.length > 0) {
            populateSelector();
            const firstAsteroidId = allAsteroids[0].id;
            asteroidSelect.value = firstAsteroidId;
            updateInfoPanel(firstAsteroidId);
        }
        animate();
    }

    initialize();

});
