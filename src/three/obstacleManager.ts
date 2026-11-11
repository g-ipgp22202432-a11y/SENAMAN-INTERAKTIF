import * as THREE from 'three';
import { ObstacleData } from '../types';

/**
 * 3D Obstacle Manager for Larian Kejiranan
 * Constructs cheerful cartoon obstacles (Tong Sampah, Lopak Air, Dahan Rendah, Kereta Sorong, Kon).
 */

const obstacleMaterials = {
  binBlue: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5, metalness: 0.2 }),
  binLid: new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.4 }),
  binWheel: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 }),

  puddleWater: new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.1,
    metalness: 0.6,
    transparent: true,
    opacity: 0.85,
  }),
  puddleEdge: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 }),

  branchWood: new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 }),
  branchLeaf: new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 }),
  bannerCloth: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 }),

  wheelbarrowMetal: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4, metalness: 0.4 }),
  wheelbarrowFrame: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 }),
  soil: new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 }),

  coneOrange: new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 }),
  coneWhite: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 }),
  coneBase: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 }),
};

export function createObstacleMesh(obstacle: ObstacleData): THREE.Group {
  const group = new THREE.Group();
  group.name = obstacle.id;

  switch (obstacle.modelType) {
    case 'TONG_SAMPAH': {
      // 1. Recycle Bin Body
      const bodyGeo = new THREE.CylinderGeometry(0.55, 0.45, 1.4, 16);
      const body = new THREE.Mesh(bodyGeo, obstacleMaterials.binBlue);
      body.position.y = 0.85;
      body.castShadow = true;
      group.add(body);

      // 2. Bin Lid (Curved dome)
      const lidGeo = new THREE.SphereGeometry(0.58, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.45);
      const lid = new THREE.Mesh(lidGeo, obstacleMaterials.binLid);
      lid.position.y = 1.55;
      lid.castShadow = true;
      group.add(lid);

      // 3. Two rubber wheels
      const wheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 12);
      wheelGeo.rotateZ(Math.PI / 2);
      const w1 = new THREE.Mesh(wheelGeo, obstacleMaterials.binWheel);
      w1.position.set(-0.45, 0.18, -0.3);
      const w2 = new THREE.Mesh(wheelGeo, obstacleMaterials.binWheel);
      w2.position.set(0.45, 0.18, -0.3);
      group.add(w1, w2);
      break;
    }

    case 'LOPAK_AIR': {
      // 1. Flat shimmering water puddle on the road
      const waterGeo = new THREE.CylinderGeometry(1.4, 1.5, 0.04, 20);
      const water = new THREE.Mesh(waterGeo, obstacleMaterials.puddleWater);
      water.position.y = 0.03;
      water.receiveShadow = true;
      group.add(water);

      // 2. Ripple rings
      const ringGeo = new THREE.RingGeometry(0.7, 0.85, 20);
      ringGeo.rotateX(-Math.PI / 2);
      const ring = new THREE.Mesh(ringGeo, obstacleMaterials.binLid);
      ring.position.y = 0.04;
      group.add(ring);

      // 3. Stepping stones or garden hose at the border
      const hoseCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.8, 0.05, -0.8),
        new THREE.Vector3(0, 0.05, -1.5),
        new THREE.Vector3(1.8, 0.05, -0.6),
      ]);
      const hoseGeo = new THREE.TubeGeometry(hoseCurve, 16, 0.08, 8, false);
      const hose = new THREE.Mesh(hoseGeo, obstacleMaterials.coneOrange);
      group.add(hose);
      break;
    }

    case 'DAHAN_RENDAH': {
      // Low horizontal branch stretching across track at head height (~1.8m)
      const branchGeo = new THREE.CylinderGeometry(0.14, 0.22, 5.5, 8);
      branchGeo.rotateZ(Math.PI / 2);
      const branch = new THREE.Mesh(branchGeo, obstacleMaterials.branchWood);
      branch.position.y = 1.75;
      branch.castShadow = true;
      group.add(branch);

      // Hanging lush leaves clusters
      for (let i = -2; i <= 2; i++) {
        const clusterGeo = new THREE.DodecahedronGeometry(0.45, 1);
        const cluster = new THREE.Mesh(clusterGeo, obstacleMaterials.branchLeaf);
        cluster.position.set(i * 0.9, 1.55, (i % 2) * 0.2);
        cluster.castShadow = true;
        group.add(cluster);
      }

      // Small hanging gotong-royong bunting triangle
      const flagGeo = new THREE.ConeGeometry(0.3, 0.6, 3);
      flagGeo.rotateZ(Math.PI);
      const flag = new THREE.Mesh(flagGeo, obstacleMaterials.bannerCloth);
      flag.position.set(0, 1.35, 0);
      group.add(flag);
      break;
    }

    case 'KERETA_SORONG': {
      // 1. Metal bucket (basin)
      const bucketGeo = new THREE.BoxGeometry(1.2, 0.55, 1.6);
      const bucket = new THREE.Mesh(bucketGeo, obstacleMaterials.wheelbarrowMetal);
      bucket.position.set(0, 0.65, 0);
      bucket.rotation.x = -0.15;
      bucket.castShadow = true;
      group.add(bucket);

      // 2. Soil in bucket
      const soilGeo = new THREE.BoxGeometry(1.1, 0.2, 1.4);
      const soil = new THREE.Mesh(soilGeo, obstacleMaterials.soil);
      soil.position.set(0, 0.8, 0);
      group.add(soil);

      // 3. Front single wheel
      const wheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.1, 12);
      wheelGeo.rotateZ(Math.PI / 2);
      const wheel = new THREE.Mesh(wheelGeo, obstacleMaterials.binWheel);
      wheel.position.set(0, 0.24, 0.9);
      group.add(wheel);

      // 4. Handles
      const handleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8);
      const h1 = new THREE.Mesh(handleGeo, obstacleMaterials.wheelbarrowFrame);
      h1.position.set(-0.5, 0.5, -0.9);
      h1.rotation.x = 0.4;
      const h2 = new THREE.Mesh(handleGeo, obstacleMaterials.wheelbarrowFrame);
      h2.position.set(0.5, 0.5, -0.9);
      h2.rotation.x = 0.4;
      group.add(h1, h2);
      break;
    }

    case 'KON_JALAN':
    default: {
      // 1. Black square base
      const baseGeo = new THREE.BoxGeometry(0.9, 0.08, 0.9);
      const base = new THREE.Mesh(baseGeo, obstacleMaterials.coneBase);
      base.position.y = 0.04;
      group.add(base);

      // 2. Orange cone
      const coneGeo = new THREE.ConeGeometry(0.35, 1.2, 16);
      const cone = new THREE.Mesh(coneGeo, obstacleMaterials.coneOrange);
      cone.position.y = 0.65;
      cone.castShadow = true;
      group.add(cone);

      // 3. Reflective white stripe ring
      const stripeGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.25, 16);
      const stripe = new THREE.Mesh(stripeGeo, obstacleMaterials.coneWhite);
      stripe.position.y = 0.6;
      group.add(stripe);
      break;
    }
  }

  // Set position based on lane and distance
  // Camera looks along +Z: visual LEFT is +X, visual RIGHT is -X.
  // -1 = left (+2.8), 0 = center (0), 1 = right (-2.8)
  const laneX = -obstacle.lane * 2.8;
  group.position.set(laneX, 0, obstacle.zPos);

  return group;
}
