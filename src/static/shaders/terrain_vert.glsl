uniform vec3 diffuse;
uniform vec3 emissive;

varying vec3 vViewPosition;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vDiffuse;
varying vec3 vEmissive;

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>

void main() {
  #include <uv_vertex>
  #include <uv2_vertex>
  #include <color_vertex>
  
  #include <beginnormal_vertex>
  #include <defaultnormal_vertex>

  vNormal = normalize(transformedNormal);
  vDiffuse = (position.y < -50.0) ? vec3(0.972, 0.760, 0.556) : diffuse;
  vEmissive = (position.y < -50.0) ? vec3(0.470, 0.388, 0.305) : emissive;

  vPosition = position.xyz;

  #include <begin_vertex>
  #include <project_vertex>
  #include <logdepthbuf_vertex>
  
  vViewPosition = - mvPosition.xyz;
  
  #include <worldpos_vertex>
  #include <envmap_vertex>
  #include <shadowmap_vertex>   
}
