uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform vec3 intersect;
uniform float shininess;
uniform float opacity;

uniform bool terrainTool;
uniform bool constructSelected;

varying vec3 vNormal;
varying vec3 vDiffuse;
varying vec3 vEmissive;
varying vec3 vPosition;

uniform float objectSize;
const float segmentSize = 25.0;
const float segmentCount = 28.0;

const float ringDiameter = 100.0;
const float ringThickness = 5.0;

float roundToNearest( in float numToRound, in float multiple ) {
  return ( numToRound + multiple ) - mod(numToRound, multiple) - ( ( 500.0 / 28.0) / 2.0 );
}

#include <common>
#include <packing>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <logdepthbuf_pars_fragment>

void main() {

  float x1 = abs(mod(vPosition.x, 50.0) - 25.0);
  float z1 = abs(mod(vPosition.z, 40.0) - 20.0);

  vec4 diffuseColor = (vPosition.y > x1 + z1 + 70.0) ?
    vec4(1.0, 1.0, 1.0, opacity) :
    (vPosition.y < x1 + z1 -50.0) ?
      vec4(0.972, 0.760, 0.556, opacity) :
      vec4(diffuse, opacity);

  // vec4 diffuseColor = (vPosition.y > x1 + z1 + 425.0) ?
  //  vec4(1.0, 1.0, 1.0, opacity) :
  //  (vPosition.y < x1 + z1 + 300.0) ?
  //    vec4(0.972, 0.760, 0.556, opacity) :
  //    vec4(diffuse, opacity);      

  ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );

  vec3 totalEmissiveRadiance = (vPosition.y > x1 + z1 + 70.0) ?
    vec3(0.8, 0.8, 0.8) :
    (vPosition.y < x1 + z1 - 50.0) ?
      vec3(0.470, 0.388, 0.305) :
      emissive;

  #include <logdepthbuf_fragment>
  #include <map_fragment>
  #include <color_fragment>
  #include <alphatest_fragment>
  #include <specularmap_fragment>
  // #include <normal_flip>
  #include <normal_fragment>

  // accumulation
  #include <lights_phong_fragment>
  #include <lights_template>

  // modulation
  #include <aomap_fragment>
  
  vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

  if ( terrainTool ) {
    float d = distance( vPosition.xz, intersect.xz );

    if ( vPosition.y > -25.0 &&
         d < ( ringDiameter + ringThickness ) / 2.0 &&
         d > ( ringDiameter - ringThickness ) / 2.0 ) {
      outgoingLight = vec3( 0.984, 0.639, 0.043 );
    }
  }

  vec2 tiles = vec2( 500.0 / 28.0, 500.0 / 28.0 );

  float valX = mod( vPosition.x, tiles.x );
  float valY = mod( vPosition.z, tiles.y );
  
  float segCount = 28.0;
  float gridSize = 500.0;
  float segSize = gridSize / segCount;

  vec2 intersectRounded = vec2(
    roundToNearest( intersect.x, 500.0 / 28.0 ),
    roundToNearest( intersect.z, 500.0 / 28.0 )
  );

  if ( valX >= 1.0 && valX <= ( tiles.x - 1.0 ) && 
       valY >= 1.0 && valY <= ( tiles.y - 1.0 ) &&
       vPosition.x >= ( intersectRounded.x - ( ( segSize * objectSize ) / 2.0 ) ) &&
       vPosition.x <= ( intersectRounded.x + ( ( segSize * objectSize ) / 2.0 ) ) && 
       vPosition.z >= ( intersectRounded.y - ( ( segSize * objectSize ) / 2.0 ) ) &&
       vPosition.z <= ( intersectRounded.y + ( ( segSize * objectSize ) / 2.0 ) ) ) {
    outgoingLight = vec3( 0.984, 0.639, 0.043 );
  }

  gl_FragColor = vec4( outgoingLight, diffuseColor.a );

  #include <premultiplied_alpha_fragment>
  #include <encodings_fragment>
  #include <fog_fragment>
}
