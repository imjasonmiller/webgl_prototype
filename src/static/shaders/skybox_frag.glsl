uniform float time;
uniform vec3 upperColorMorning;
uniform vec3 lowerColorMorning;
uniform vec3 upperColorEvening;
uniform vec3 lowerColorEvening;

varying vec3 vWorldPosition;

const float exponent = 0.75;
const vec3 colorMorningLower = vec3( 0.702, 0.820, 0.914 ); // 0xb3d1e9
const vec3 colorMorningUpper = vec3( 0.267, 0.380, 0.537 ); // 0x446189
const vec3 colorEveningLower = vec3( 0.000, 0.169, 0.337 ); // 0x002b56
const vec3 colorEveningUpper = vec3( 0.000, 0.004, 0.102 ); // 0x00011a

void main() {
  float height = normalize( vWorldPosition ).y + 0.4;
  float dayTime = ( sin( time / 1000.0 ) + 1.0 ) / 2.0;

  vec3 lowerColor = mix( colorMorningLower, colorEveningLower, dayTime ); 
  vec3 upperColor = mix( colorMorningUpper, colorEveningUpper, dayTime );
  
  gl_FragColor = vec4( mix( lowerColor, upperColor, max( pow( max( height, 0.0 ), exponent ), 0.0 ) ), 1.0 );
}