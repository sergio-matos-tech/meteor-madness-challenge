// =================================================================
// MOCK BACKEND DATA
// =================================================================
// This object simulates the data we'll get from the backend.
// It's structured like the real NASA NeoWs API response to make
// switching to the real API easier later.
// I've added a custom `impact_location` to simulate what your
// backend team would calculate.
const mockAsteroidData = {
  "element_count": 2,
  "near_earth_objects": {
    "2025-10-04": [
      {
        "id": "3542519",
        "name": "Impactor-2025 (Mock)",
        "nasa_jpl_url": "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=3542519",
        "is_potentially_hazardous_asteroid": true,
        "estimated_diameter": {
          "kilometers": {
            "estimated_diameter_min": 0.2,
            "estimated_diameter_max": 0.5
          }
        },
        "close_approach_data": [{
          "relative_velocity": {
            "kilometers_per_second": "25.12"
          },
          "miss_distance": {
            "kilometers": "0"
          }
        }],
        // Custom mock data: The backend would calculate this
        "impact_location": {
          "latitude": -19.9167, // Belo Horizonte, Brazil
          "longitude": -43.9345
        }
      },
      {
        "id": "3729835",
        "name": "Secondary-Threat (Mock)",
        "nasa_jpl_url": "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=3729835",
        "is_potentially_hazardous_asteroid": false,
        "estimated_diameter": {
          "kilometers": {
            "estimated_diameter_min": 0.05,
            "estimated_diameter_max": 0.1
          }
        },
        "close_approach_data": [{
          "relative_velocity": {
            "kilometers_per_second": "15.5"
          },
          "miss_distance": {
            "kilometers": "0"
          }
        }],
        // Custom mock data
        "impact_location": {
            "latitude": 34.0522, // Los Angeles, USA
            "longitude": -118.2437
        }
      }
    ]
  }
};


// =================================================================
// 2D IMPACT MAP (D3.js)
// =================================================================

// Setup dimensions and SVG for the map
const mapWidth = 700;
const mapHeight = 500;

const svg = d3.select("#map-2d")
  .append("svg")
  .attr("width", mapWidth)
  .attr("height", mapHeight);

// Define a projection to translate Geo-coordinates to SVG pixels
const projection = d3.geoMercator()
  .scale(110)
  .translate([mapWidth / 2, mapHeight / 1.6]);

const pathGenerator = d3.geoPath().projection(projection);

// Draw the world map from a GeoJSON file
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(data => {
  svg.append("g")
    .selectAll("path")
    .data(data.features)
    .join("path")
      .attr("d", pathGenerator)
      .attr("fill", "#ccc")
      .style("stroke", "#fff")
      .style("stroke-width", 0.5);

  // After the map is drawn, visualize the mock data
  visualizeImpacts(mockAsteroidData);
});

// Function to draw impact circles and tooltips on the map
function visualizeImpacts(apiData) {
  const asteroids = Object.values(apiData.near_earth_objects).flat();

  // Create a tooltip div
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "solid 1px black")
    .style("border-radius", "5px")
    .style("padding", "5px");

  // Draw a circle for each asteroid's impact location
  svg.selectAll("circle")
    .data(asteroids)
    .join("circle")
      .attr("cx", d => projection([d.impact_location.longitude, d.impact_location.latitude])[0])
      .attr("cy", d => projection([d.impact_location.longitude, d.impact_location.latitude])[1])
      .attr("r", d => d.estimated_diameter.kilometers.estimated_diameter_max * 10) // Scale radius by size
      .style("fill", "red")
      .style("opacity", 0.7)
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
renderer.setClearColor(0x111111); // Dark space background
sceneContainer.appendChild(renderer.domElement);

// Add lighting to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Create Earth
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x0077ff }); // Use Phong for lighting
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Position the camera
camera.position.z = 5;

// Function to add a visual representation of an asteroid to the scene
function addAsteroidToScene(asteroid) {
  const size = asteroid.estimated_diameter.kilometers.estimated_diameter_max * 0.2; // Scale size
  const asteroidGeometry = new THREE.SphereGeometry(size, 8, 8);
  const asteroidMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Brownish color
  const asteroidMesh = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

  // Place asteroids at random positions around the Earth for visual effect
  asteroidMesh.position.x = (Math.random() - 0.5) * 6;
  asteroidMesh.position.y = (Math.random() - 0.5) * 6;
  asteroidMesh.position.z = (Math.random() - 0.5) * 6;

  scene.add(asteroidMesh);
}

// Populate the 3D scene with asteroids from mock data
function visualizeAsteroidsIn3D(apiData) {
    const asteroids = Object.values(apiData.near_earth_objects).flat();
    asteroids.forEach(asteroid => {
        addAsteroidToScene(asteroid);
    });
}

// Animation loop to render the 3D scene
function animate() {
  requestAnimationFrame(animate);

  // Add some rotation for visual appeal
  earth.rotation.y += 0.001;

  renderer.render(scene, camera);
}

// Start the 3D visualization
visualizeAsteroidsIn3D(mockAsteroidData);
animate();
