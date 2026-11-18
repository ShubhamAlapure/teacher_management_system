import { 
  DEFAULT_CAMPUS_GEOFENCE_CONFIG, 
  calculateHaversineDistanceMeters, 
  validateCoordinatesAgainstGeofence 
} from './src/utils/geofenceConfig.js';

console.log('====================================================');
console.log('MIT-ADT UNIVERSITY GPS GEOFENCE AUTOMATED TEST SUITE');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failCount++;
  }
}

// TEST 1: Inside Campus Center (World Peace Dome / SOE Quadrangle)
console.log('Test 1: Inside Campus Center (18.492590, 74.025480, acc: 8m)');
{
  const res = validateCoordinatesAgainstGeofence(18.492590, 74.025480, 8);
  assert(res.isValid === true, 'Verification is VALID');
  assert(res.isInsideCampus === true, 'isInsideCampus is TRUE');
  assert(res.status === 'CAMPUS_VERIFIED', 'Status is CAMPUS_VERIFIED');
  assert(res.distanceMeters === 0, `Distance is ~0m (actual: ${res.distanceMeters}m)`);
  assert(res.badgeText === 'Campus Perimeter Verified', 'Badge text is Campus Perimeter Verified');
}

// TEST 2: Inside Campus Academic Block (SOE Lab Block ~210m from center)
console.log('\nTest 2: Inside Academic Block (18.493800, 74.024200, acc: 15m)');
{
  const res = validateCoordinatesAgainstGeofence(18.493800, 74.024200, 15);
  assert(res.isValid === true, 'Verification is VALID');
  assert(res.isInsideCampus === true, 'isInsideCampus is TRUE');
  assert(res.status === 'CAMPUS_VERIFIED', 'Status is CAMPUS_VERIFIED');
  assert(res.distanceMeters < 850, `Distance ${res.distanceMeters}m is within 850m radius`);
}

// TEST 3: Outside Campus - Hadapsar, Pune (~10.6 km away)
console.log('\nTest 3: Outside Campus - Hadapsar (18.5089, 73.9260, acc: 10m)');
{
  const res = validateCoordinatesAgainstGeofence(18.5089, 73.9260, 10);
  assert(res.isValid === false, 'Verification is NOT VALID');
  assert(res.isInsideCampus === false, 'isInsideCampus is FALSE');
  assert(res.status === 'OUTSIDE_CAMPUS', 'Status is OUTSIDE_CAMPUS');
  assert(res.distanceMeters > 10000, `Distance is > 10km (actual: ${res.distanceMeters}m)`);
  assert(res.badgeText === 'Outside Campus Boundary', 'Badge is Outside Campus Boundary');
}

// TEST 4: Outside Campus - Central Pune / Shivajinagar (~18.2 km away)
console.log('\nTest 4: Outside Campus - Shivajinagar (18.5204, 73.8567, acc: 12m)');
{
  const res = validateCoordinatesAgainstGeofence(18.5204, 73.8567, 12);
  assert(res.isValid === false, 'Verification is NOT VALID');
  assert(res.isInsideCampus === false, 'isInsideCampus is FALSE');
  assert(res.status === 'OUTSIDE_CAMPUS', 'Status is OUTSIDE_CAMPUS');
  assert(res.distanceMeters > 17000, `Distance is > 17km (actual: ${res.distanceMeters}m)`);
}

// TEST 5: Poor GPS Accuracy / Precision (> 80m tolerance)
console.log('\nTest 5: Poor GPS Precision Inside Campus (18.492590, 74.025480, acc: 160m)');
{
  const res = validateCoordinatesAgainstGeofence(18.492590, 74.025480, 160);
  assert(res.isValid === false, 'Verification is NOT VALID (blocked due to poor satellite lock)');
  assert(res.status === 'UNCERTAIN_ACCURACY', 'Status is UNCERTAIN_ACCURACY');
  assert(res.accuracyMeters === 160, 'Reported accuracy matches 160m');
}

// TEST 6: Missing / Denied GPS Coordinates
console.log('\nTest 6: Missing or Null GPS Coordinates');
{
  const res = validateCoordinatesAgainstGeofence(null, null, null);
  assert(res.isValid === false, 'Verification is NOT VALID');
  assert(res.status === 'INVALID_GPS', 'Status is INVALID_GPS');
  assert(res.badgeText === 'GPS Coordinates Missing', 'Badge text is GPS Coordinates Missing');
}

// TEST 7: Campus Boundary Edge Location (~950m away)
console.log('\nTest 7: Just Outside Perimeter Edge (18.492590, 74.034500, acc: 20m)');
{
  const dist = calculateHaversineDistanceMeters(18.492590, 74.025480, 18.492590, 74.034500);
  const res = validateCoordinatesAgainstGeofence(18.492590, 74.034500, 20);
  assert(dist > 850, `Distance ${Math.round(dist)}m is beyond 850m perimeter`);
  assert(res.isValid === false, 'Perimeter edge is NOT VALID');
  assert(res.isInsideCampus === false, 'isInsideCampus is FALSE');
}

// TEST 8: Custom Administrator Configuration Override
console.log('\nTest 8: Custom Admin Geofence Config Override (Radius = 1500m)');
{
  const customConfig = {
    ...DEFAULT_CAMPUS_GEOFENCE_CONFIG,
    radiusMeters: 1500
  };
  // Test coordinate at 1100m away with custom 1500m config
  const res = validateCoordinatesAgainstGeofence(18.492590, 74.035500, 10, customConfig);
  assert(res.isValid === true, 'Verification is VALID with extended 1500m radius');
  assert(res.isInsideCampus === true, 'isInsideCampus is TRUE with extended radius');
}

console.log('\n====================================================');
console.log(`TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('ALL GEOFENCE VALIDATION ENGINE TESTS COMPLETED SUCCESSFULLY!\n');
}
