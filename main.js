// Set up canvas and context
const canvas = document.getElementById('kmeansCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

// Utility functions to transform from [-1, 1] coordinate to canvas coordinate
function transformX(x) {
  return (x + 1) * width / 2;
}
function transformY(y) {
  // Flip y so that +1 is at the top and -1 at the bottom.
  return (1 - (y + 1) / 2) * height;
}

// Colors for the clusters
const colors = ["#e41a1c", "#377eb8", "#4daf4a"]; // red, blue, green

// Data structures
const numPoints = 20;
const numClusters = 3;
let points = [];
let centroids = [];

// Generate random points in [-1, 1] for both x and y
function generatePoints() {
  points = [];
  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: Math.random() * 2 - 1,  // random in [-1,1]
      y: Math.random() * 2 - 1,
      cluster: null // will be set later
    });
  }
}

// Initialize centroids by picking 3 random points (deep copy)
function initializeCentroids() {
  centroids = [];
  // Create a shallow copy of points array to choose from
  const shuffled = points.slice().sort(() => 0.5 - Math.random());
  for (let i = 0; i < numClusters; i++) {
    // Use a deep copy so we can update centroids independently
    centroids.push({ x: shuffled[i].x, y: shuffled[i].y });
  }
}

// Compute Euclidean distance between two points
function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// Step 1: Assign each point to the nearest centroid
function assignClusters() {
  points.forEach(point => {
    let minDist = Infinity;
    let assignedCluster = null;
    centroids.forEach((centroid, index) => {
      const d = distance(point, centroid);
      if (d < minDist) {
        minDist = d;
        assignedCluster = index;
      }
    });
    point.cluster = assignedCluster;
  });
}

// Step 2: Update centroids based on the mean of the points in each cluster
function updateCentroids() {
  for (let i = 0; i < numClusters; i++) {
    // Get all points belonging to cluster i
    const clusterPoints = points.filter(p => p.cluster === i);
    if (clusterPoints.length === 0) {
      // If no points assigned to this cluster, do not update centroid.
      continue;
    }
    // Compute average x and y
    let sumX = 0, sumY = 0;
    clusterPoints.forEach(p => {
      sumX += p.x;
      sumY += p.y;
    });
    centroids[i].x = sumX / clusterPoints.length;
    centroids[i].y = sumY / clusterPoints.length;
  }
}

// Draw points and centroids on the canvas
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw points
  points.forEach(point => {
    const cx = transformX(point.x);
    const cy = transformY(point.y);
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
    // Use cluster color or gray if not assigned
    ctx.fillStyle = point.cluster !== null ? colors[point.cluster] : '#888';
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.stroke();
  });

  // Draw centroids
  centroids.forEach((centroid, index) => {
    const cx = transformX(centroid.x);
    const cy = transformY(centroid.y);
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, 2 * Math.PI);
    ctx.fillStyle = colors[index];
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

// Perform one iteration of the k-means algorithm
function kMeansIteration() {
  assignClusters();
  updateCentroids();
  draw();
}

// Initialize the demo on load
function init() {
  generatePoints();
  initializeCentroids();
  draw();
}

// Set up the Next button click handler
document.getElementById('nextButton').addEventListener('click', kMeansIteration);

// Run initial setup
init();
