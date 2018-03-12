uniform float time;

varying vec3 vPosition;

// Pseudorandom number generation — http://stackoverflow.com/q/12964279/1113913
float rand(vec2 coords) {
  return fract(sin(dot(coords.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float roundToNearest( in float numToRound, in float multiple ) {
  return ( numToRound + multiple ) - mod(numToRound, multiple);
}

void main() {

  float randomNum = rand(
    vec2( roundToNearest( vPosition.x, 60.0 ), roundToNearest( vPosition.y, 60.0 ) )
  );

  float worldTime = ( cos( time ) + 1.0 ) / 2.0;
  float shineTime = ( sin( ( time + randomNum ) * ( randomNum * 20.0 ) ) + 1.0 ) / 2.0;

  gl_FragColor = vec4(
    mix( vec3( 0.7, 0.7, 0.7 ), vec3( 1.2, 1.2, 1.2 ), shineTime ),
    smoothstep( 0.5, 1.0, worldTime )
  );
}
