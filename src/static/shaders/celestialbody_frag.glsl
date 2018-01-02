uniform vec3 color;
uniform float time;

varying float vFaceColor;

void main() {
  float shine = ( sin( time * 6.28 + vFaceColor ) + 1.0 ) / 2.0;
  vec3 vColor = color + vec3( 1.0 ) * shine;

  gl_FragColor = vec4( vColor, 1.0 );
}
