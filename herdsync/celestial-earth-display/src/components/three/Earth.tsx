import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Create procedural textures for Earth
  const earthMaterial = useMemo(() => {
    // Create a gradient sphere material simulating Earth
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          
          i = mod289(i);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                  
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        void main() {
          // Generate continents using noise
          float continent = snoise(vPosition * 2.0);
          continent += snoise(vPosition * 4.0) * 0.5;
          continent += snoise(vPosition * 8.0) * 0.25;
          continent = smoothstep(-0.2, 0.3, continent);
          
          // Ocean color - deep blue
          vec3 oceanDeep = vec3(0.02, 0.06, 0.15);
          vec3 oceanShallow = vec3(0.05, 0.2, 0.4);
          vec3 ocean = mix(oceanDeep, oceanShallow, snoise(vPosition * 10.0) * 0.5 + 0.5);
          
          // Land color - green/brown
          vec3 forest = vec3(0.02, 0.22, 0.15);
          vec3 desert = vec3(0.35, 0.28, 0.18);
          vec3 mountain = vec3(0.25, 0.22, 0.2);
          
          float landNoise = snoise(vPosition * 6.0);
          vec3 land = mix(forest, desert, smoothstep(-0.2, 0.4, landNoise));
          land = mix(land, mountain, smoothstep(0.5, 0.8, continent));
          
          // Mix ocean and land
          vec3 surface = mix(ocean, land, continent);
          
          // Add ice caps at poles
          float pole = abs(vPosition.y);
          vec3 ice = vec3(0.9, 0.95, 1.0);
          surface = mix(surface, ice, smoothstep(0.7, 0.9, pole));
          
          // City lights on dark side
          vec3 lightDir = normalize(vec3(1.0, 0.3, 0.5));
          float lightIntensity = dot(vNormal, lightDir);
          
          // City lights (yellow-orange glow)
          float cities = snoise(vPosition * 20.0);
          cities = smoothstep(0.6, 0.8, cities) * continent;
          vec3 cityColor = vec3(1.0, 0.8, 0.4) * cities * 0.8;
          
          // Night side shows city lights
          float nightMask = smoothstep(0.1, -0.2, lightIntensity);
          surface = mix(surface, surface * 0.1 + cityColor, nightMask);
          
          // Atmospheric lighting
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
          vec3 atmosphereColor = vec3(0.3, 0.6, 1.0);
          surface += atmosphereColor * fresnel * 0.3;
          
          // Day/night lighting
          float diffuse = max(0.0, lightIntensity);
          float ambient = 0.15;
          surface *= (diffuse + ambient);
          
          gl_FragColor = vec4(surface, 1.0);
        }
      `,
    });
    return material;
  }, []);

  // Atmosphere glow material
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 atmosphere = vec3(0.3, 0.6, 1.0);
          gl_FragColor = vec4(atmosphere, intensity * 0.6);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
  }, []);

  // Cloud material
  const cloudMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0) * 2.0 + 1.0;
          vec4 s1 = floor(b1) * 2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
        }
        
        void main() {
          vec3 pos = vPosition + vec3(time * 0.01, 0.0, 0.0);
          float cloud = snoise(pos * 3.0);
          cloud += snoise(pos * 6.0) * 0.5;
          cloud += snoise(pos * 12.0) * 0.25;
          cloud = smoothstep(0.1, 0.6, cloud);
          
          vec3 lightDir = normalize(vec3(1.0, 0.3, 0.5));
          float lightIntensity = max(0.3, dot(vNormal, lightDir));
          
          vec3 cloudColor = vec3(1.0) * lightIntensity;
          float alpha = cloud * 0.4;
          
          gl_FragColor = vec4(cloudColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (earthRef.current) {
      earthRef.current.rotation.y = time * 0.05;
      (earthRef.current.material as THREE.ShaderMaterial).uniforms.time.value = time;
    }
    
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = time * 0.03;
      (cloudsRef.current.material as THREE.ShaderMaterial).uniforms.time.value = time;
    }
  });

  return (
    <group>
      {/* Earth */}
      <mesh ref={earthRef} material={earthMaterial}>
        <sphereGeometry args={[2, 64, 64]} />
      </mesh>
      
      {/* Clouds */}
      <mesh ref={cloudsRef} material={cloudMaterial}>
        <sphereGeometry args={[2.02, 64, 64]} />
      </mesh>
      
      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef} material={atmosphereMaterial}>
        <sphereGeometry args={[2.2, 64, 64]} />
      </mesh>
    </group>
  );
}
