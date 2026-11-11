import * as THREE from 'three';

/**
 * 3D BoBoiBoy World Procedural Builder
 * Faithfully matches the BoBoiBoy & Tok Aba's Kokotiam reference aesthetic:
 * - Tok Aba's Kokotiam circular kiosk with Tok Aba & Ochobot
 * - BoBoiBoy, Gopal, Yaya, Ying 3D cartoon characters
 * - Malaysian park gazebo (Wakaf Kayu)
 * - Organic curving trees with lush clumpy foliage
 * - Malaysian terrace houses and neighborhood scenery
 */

const textureLoader = new THREE.TextureLoader();

export const characterTextures = {
  boboiboy: textureLoader.load('/assets/boboiboy/boboiboy_crop.png'),
  gopal: textureLoader.load('/assets/boboiboy/gopal_crop.png'),
  gopalAction: textureLoader.load('/assets/boboiboy/gopal_action_crop.png'),
  yaya: textureLoader.load('/assets/boboiboy/yaya_crop.png'),
  ying: textureLoader.load('/assets/boboiboy/ying_crop.png'),
  tokAba: textureLoader.load('/assets/boboiboy/tok_aba_crop.png'),
  ochobot: textureLoader.load('/assets/boboiboy/ochobot_crop.png'),
  kokotiamKiosk: textureLoader.load('/assets/boboiboy/kokotiam_kiosk.png'),
  kokotiamSign: textureLoader.load('/assets/boboiboy/kokotiam_sign_crop.png'),
  kokotiamCenterpiece: textureLoader.load('/assets/boboiboy/kokotiam_centerpiece.png'),
  wakafGazebo: textureLoader.load('/assets/boboiboy/wakaf_gazebo.png'),
  parkTree: textureLoader.load('/assets/boboiboy/park_tree.png'),
  pulauRintisSky: textureLoader.load('/assets/boboiboy/pulau_rintis_sky.png'),
};

Object.values(characterTextures).forEach((tex) => {
  tex.colorSpace = THREE.SRGBColorSpace;
});

// Procedural Canvas Texture for Tok Aba's Kokotiam Signboard
function createKokotiamSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  // Background dark brown with gold trim
  ctx.fillStyle = '#26150b';
  ctx.fillRect(0, 0, 512, 160);

  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, 500, 148);

  // Yellow Steaming Cocoa Mug Icon on left
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(60, 85, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#78350f';
  ctx.fillRect(45, 68, 30, 34);

  // Steam curves
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(52, 60);
  ctx.bezierCurveTo(48, 50, 56, 45, 52, 36);
  ctx.moveTo(68, 60);
  ctx.bezierCurveTo(64, 50, 72, 45, 68, 36);
  ctx.stroke();

  // Bold BoBoiBoy font: "TOK ABA'S"
  ctx.fillStyle = '#facc15';
  ctx.font = '900 52px "Fredoka", "Arial Black", sans-serif';
  ctx.shadowColor = '#000000';
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 4;
  ctx.fillText("TOK ABA'S", 125, 82);

  // Red/yellow pill: "KOKOTIAM"
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#e11d48';
  ctx.fillRect(150, 96, 260, 42);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 3;
  ctx.strokeRect(150, 96, 260, 42);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 28px "Fredoka", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('KOKOTIAM', 170, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const kokotiamSignTex = createKokotiamSignTexture();

// Palette of materials matching BoBoiBoy animated series & Tok Aba's Kokotiam reference image
export const materials = {
  // Park Pathway & Curbs (Stone pavers matching reference image)
  roadAsphalt: new THREE.MeshStandardMaterial({ color: 0xc8bba0, roughness: 0.82, metalness: 0.02 }),
  roadStripe: new THREE.MeshStandardMaterial({ color: 0x9e8969, roughness: 0.7 }),
  curb: new THREE.MeshStandardMaterial({ color: 0xa8997e, roughness: 0.75 }),
  sidewalkTile: new THREE.MeshStandardMaterial({ color: 0xd9ceb8, roughness: 0.8 }),
  grass: new THREE.MeshStandardMaterial({ color: 0x5e9e24, roughness: 0.92, metalness: 0.02 }),

  // Kokotiam Kiosk
  kioskWoodDark: new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 }),
  kioskWoodMedium: new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.65 }),
  kioskCream: new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.6 }),
  kioskYellow: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4, metalness: 0.2 }),
  kioskMetal: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.3, metalness: 0.7 }),
  mugWhite: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }),
  mugCocoa: new THREE.MeshStandardMaterial({ color: 0x3f1d0b, roughness: 0.4 }),

  // Characters Palette
  skinWarmLight: new THREE.MeshStandardMaterial({ color: 0xfcd34d, roughness: 0.6 }),
  skinTanGopal: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.65 }),
  skinElderTokAba: new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.7 }),

  // BoBoiBoy
  boboiboyOrange: new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 }),
  boboiboyCapDark: new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.5 }),
  boboiboyVest: new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.6 }),
  shirtDark: new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 }),
  pantsBrown: new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.8 }),

  // Gopal
  gopalHeadband: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 }),
  gopalJacketGreen: new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.65 }),
  gopalJacketYellow: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.6 }),
  gopalTie: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 }),
  gopalPantsWhite: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.8 }),

  // Yaya
  yayaHijabPink: new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.65 }),
  yayaGogglesRim: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.3, metalness: 0.7 }),
  yayaGogglesLens: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.5 }),
  yayaVestWhite: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }),
  yayaPantsMagenta: new THREE.MeshStandardMaterial({ color: 0x831843, roughness: 0.7 }),

  // Ying
  yingBeanieBlue: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 }),
  yingBeanieYellow: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.6 }),
  yingGlasses: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 }),
  yingJacketYellow: new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.7 }),
  yingShortsBlue: new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.7 }),

  // Tok Aba
  tokAbaCapGrey: new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.7 }),
  tokAbaShirtBlue: new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.8 }),
  tokAbaApron: new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.8 }),

  // Ochobot
  ochobotYellow: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.3 }),
  ochobotVisor: new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2, metalness: 0.8 }),
  ochobotEyeCyan: new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
  ochobotHands: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 }),

  // Houses & Nature (Warm rustic Malaysian kampung timber palette)
  wallCream: new THREE.MeshStandardMaterial({ color: 0xb47942, roughness: 0.8 }),
  wallCyan: new THREE.MeshStandardMaterial({ color: 0x4a859c, roughness: 0.8 }),
  wallPeach: new THREE.MeshStandardMaterial({ color: 0xba6a48, roughness: 0.8 }),
  wallMint: new THREE.MeshStandardMaterial({ color: 0x4d7c57, roughness: 0.8 }),
  roofTerracotta: new THREE.MeshStandardMaterial({ color: 0x8a331e, roughness: 0.6 }),
  roofNavy: new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.6 }),
  woodDoor: new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 }),
  windowGlass: new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.7 }),
  treeTrunkTan: new THREE.MeshStandardMaterial({ color: 0x9a7b56, roughness: 0.85 }),
  leavesBright: new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.75 }),
  leavesForest: new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.75 }),
  leavesDeep: new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.75 }),
  flowerAccentYellow: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.6 }),
  bannerCloth: new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 }),
};

/**
 * Creates Tok Aba's Kokotiam Kiosk with circular counter, Tok Aba inside,
 * and Ochobot hovering alongside!
 */
export function createTokAbaKokotiam(): THREE.Group {
  const kiosk = new THREE.Group();

  // 1. Stepped Circular Base Platform (Wood & concrete rim)
  const baseOuterGeo = new THREE.CylinderGeometry(5.2, 5.4, 0.4, 32);
  const baseOuter = new THREE.Mesh(baseOuterGeo, materials.kioskWoodDark);
  baseOuter.position.y = 0.2;
  baseOuter.receiveShadow = true;
  kiosk.add(baseOuter);

  const baseInnerGeo = new THREE.CylinderGeometry(4.8, 4.8, 0.15, 32);
  const baseInner = new THREE.Mesh(baseInnerGeo, materials.kioskCream);
  baseInner.position.y = 0.45;
  baseInner.receiveShadow = true;
  kiosk.add(baseInner);

  // 2. Circular Kiosk Counter (Curved front, radius 3.2m, height 1.8m)
  const counterGeo = new THREE.CylinderGeometry(3.2, 3.2, 1.6, 24, 1, false, 0, Math.PI * 1.6);
  const counter = new THREE.Mesh(counterGeo, materials.kioskCream);
  counter.position.y = 1.25;
  counter.castShadow = true;
  kiosk.add(counter);

  // Counter Top Rim (Rich brown wood)
  const rimGeo = new THREE.TorusGeometry(3.2, 0.2, 8, 32, Math.PI * 1.6);
  rimGeo.rotateX(Math.PI / 2);
  const rim = new THREE.Mesh(rimGeo, materials.kioskWoodMedium);
  rim.position.y = 2.05;
  kiosk.add(rim);

  // 3. Central Pillar and Roof Canopy Support
  const pillarGeo = new THREE.CylinderGeometry(0.35, 0.35, 3.8, 12);
  const pillar = new THREE.Mesh(pillarGeo, materials.kioskWoodDark);
  pillar.position.y = 2.4;
  kiosk.add(pillar);

  // 4. Iconic Circular Roof Canopy (Brown outer tier, yellow accent, cream underside)
  const roofTier1Geo = new THREE.CylinderGeometry(4.2, 4.4, 0.6, 32);
  const roofTier1 = new THREE.Mesh(roofTier1Geo, materials.kioskWoodDark);
  roofTier1.position.y = 4.2;
  roofTier1.castShadow = true;
  kiosk.add(roofTier1);

  const roofTier2Geo = new THREE.CylinderGeometry(3.6, 4.0, 0.5, 32);
  const roofTier2 = new THREE.Mesh(roofTier2Geo, materials.kioskYellow);
  roofTier2.position.y = 4.65;
  roofTier2.castShadow = true;
  kiosk.add(roofTier2);

  // 5. TOK ABA'S KOKOTIAM Front Signboard (Using exact artwork curved over roof)
  const signMeshMat = new THREE.MeshBasicMaterial({
    map: characterTextures.kokotiamSign || kokotiamSignTex,
  });
  const signGeo = new THREE.PlaneGeometry(4.2, 1.5);
  const signMesh = new THREE.Mesh(signGeo, signMeshMat);
  signMesh.position.set(0, 4.3, 3.8);
  kiosk.add(signMesh);

  // 6. 3D Menu Board behind counter
  const menuGeo = new THREE.BoxGeometry(2.4, 1.3, 0.08);
  const menuMesh = new THREE.Mesh(menuGeo, materials.kioskWoodDark);
  menuMesh.position.set(0, 2.7, -0.6);
  kiosk.add(menuMesh);

  // 7. Coffee Mugs and Espresso Machine on Counter
  const espressoGeo = new THREE.BoxGeometry(0.9, 0.9, 0.8);
  const espresso = new THREE.Mesh(espressoGeo, materials.kioskMetal);
  espresso.position.set(-2.0, 2.5, 1.2);
  espresso.castShadow = true;
  kiosk.add(espresso);

  // Cocoa cups
  const cupGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.25, 12);
  for (let c = 0; c < 3; c++) {
    const cup = new THREE.Mesh(cupGeo, materials.mugWhite);
    cup.position.set(-1.2 + c * 0.35, 2.18, 2.4 - c * 0.2);
    kiosk.add(cup);
  }

  // 8. Round Bar Stools around counter
  const stoolBaseGeo = new THREE.ConeGeometry(0.35, 0.9, 12);
  const stoolSeatGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.15, 16);
  for (let s = 0; s < 4; s++) {
    const angle = 0.4 + s * 0.7;
    const sx = Math.sin(angle) * 4.2;
    const sz = Math.cos(angle) * 4.2;

    const base = new THREE.Mesh(stoolBaseGeo, materials.kioskCream);
    base.position.set(sx, 0.9, sz);
    const seat = new THREE.Mesh(stoolSeatGeo, materials.kioskWoodDark);
    seat.position.set(sx, 1.4, sz);
    kiosk.add(base, seat);
  }

  // 9. 100% PURE 3D CHARACTERS AROUND KOKOTIAM (Matching Reference Image)
  // Tok Aba behind the counter
  const tokAba = createTokAbaCharacter();
  tokAba.position.set(0, 0.45, 0.5);
  kiosk.add(tokAba);

  // Ochobot floating next to Kokotiam
  const ochobot = createOchobotMesh();
  ochobot.name = 'ochobot';
  ochobot.position.set(-3.6, 2.8, 2.2);
  kiosk.add(ochobot);

  // BoBoiBoy 3D in front of the counter
  const bbb = createBoBoiBoyCharacter();
  bbb.position.set(0, 0.45, 2.8);
  kiosk.add(bbb);

  // Gopal 3D on the platform
  const gopal = createGopalCharacter();
  gopal.position.set(2.0, 0.45, 2.0);
  gopal.rotation.y = -0.3;
  kiosk.add(gopal);

  // Yaya 3D on the left
  const yaya = createYayaCharacter();
  yaya.position.set(-1.8, 0.45, 2.2);
  yaya.rotation.y = 0.3;
  kiosk.add(yaya);

  // Ying 3D on stool
  const ying = createYingCharacter();
  ying.position.set(2.4, 0.45, 0.8);
  ying.rotation.y = -0.6;
  kiosk.add(ying);

  return kiosk;
}

/**
 * Creates TOK ABA character (Friendly grandfather with grey newsboy cap, apron, polo shirt)
 */
export function createTokAbaCharacter(): THREE.Group {
  const tokAba = new THREE.Group();

  // Head
  const headGeo = new THREE.SphereGeometry(0.55, 16, 16);
  const head = new THREE.Mesh(headGeo, materials.skinElderTokAba);
  head.position.y = 2.1;
  tokAba.add(head);

  // Grey Newsboy flat cap (Topi Leper)
  const capGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.2, 16);
  const cap = new THREE.Mesh(capGeo, materials.tokAbaCapGrey);
  cap.position.set(0, 2.45, 0.05);
  const brimGeo = new THREE.BoxGeometry(0.65, 0.08, 0.45);
  const brim = new THREE.Mesh(brimGeo, materials.tokAbaCapGrey);
  brim.position.set(0, 2.38, 0.6);
  tokAba.add(cap, brim);

  // Cartoon Big Nose & Smile
  const noseGeo = new THREE.SphereGeometry(0.18, 12, 12);
  const nose = new THREE.Mesh(noseGeo, materials.skinElderTokAba);
  nose.position.set(0, 2.05, 0.52);
  tokAba.add(nose);

  // Eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
  const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), eyeMat);
  leftEye.position.set(-0.18, 2.2, 0.48);
  const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), eyeMat);
  rightEye.position.set(0.18, 2.2, 0.48);
  tokAba.add(leftEye, rightEye);

  // Body: Blue polo shirt & dark brown apron
  const bodyGeo = new THREE.CapsuleGeometry(0.52, 0.9, 8, 12);
  const body = new THREE.Mesh(bodyGeo, materials.tokAbaShirtBlue);
  body.position.y = 1.25;
  tokAba.add(body);

  const apronGeo = new THREE.BoxGeometry(0.85, 0.8, 0.45);
  const apron = new THREE.Mesh(apronGeo, materials.tokAbaApron);
  apron.position.set(0, 1.15, 0.22);
  tokAba.add(apron);

  // Arms (Waving mug or thumbs-up)
  const armGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.75, 8);
  const leftArm = new THREE.Mesh(armGeo, materials.tokAbaShirtBlue);
  leftArm.position.set(-0.65, 1.35, 0.2);
  leftArm.rotation.set(0.4, 0, 0.5);

  const rightArm = new THREE.Mesh(armGeo, materials.tokAbaShirtBlue);
  rightArm.position.set(0.65, 1.45, 0.2);
  rightArm.rotation.set(-0.6, 0, -0.6);
  rightArm.name = 'rightArm';

  // Mug in right hand
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.22, 10), materials.kioskYellow);
  mug.position.set(0.75, 1.75, 0.4);
  tokAba.add(leftArm, rightArm, mug);

  return tokAba;
}

/**
 * Creates OCHOBOT (Yellow sphere robot with black visor, glowing cyan eyes, antennas)
 */
export function createOchobotMesh(): THREE.Group {
  const robot = new THREE.Group();

  // 1. Yellow Sphere Body
  const sphereGeo = new THREE.SphereGeometry(0.48, 16, 16);
  const body = new THREE.Mesh(sphereGeo, materials.ochobotYellow);
  robot.add(body);

  // 2. Black Face Visor (Band around front)
  const visorGeo = new THREE.CylinderGeometry(0.49, 0.49, 0.28, 16, 1, false, -Math.PI / 3, (Math.PI * 2) / 3);
  visorGeo.rotateY(Math.PI / 2);
  const visor = new THREE.Mesh(visorGeo, materials.ochobotVisor);
  robot.add(visor);

  // 3. Glowing Cyan Eyes
  const eyeGeo = new THREE.CircleGeometry(0.08, 16);
  const leftEye = new THREE.Mesh(eyeGeo, materials.ochobotEyeCyan);
  leftEye.position.set(-0.16, 0, 0.5);
  const rightEye = new THREE.Mesh(eyeGeo, materials.ochobotEyeCyan);
  rightEye.position.set(0.16, 0, 0.5);
  robot.add(leftEye, rightEye);

  // 4. Yellow Antennas (Left and right side ears)
  const antGeo = new THREE.ConeGeometry(0.12, 0.35, 6);
  const leftAnt = new THREE.Mesh(antGeo, materials.ochobotYellow);
  leftAnt.position.set(-0.52, 0.35, 0);
  leftAnt.rotation.z = 0.7;

  const rightAnt = new THREE.Mesh(antGeo, materials.ochobotYellow);
  rightAnt.position.set(0.52, 0.35, 0);
  rightAnt.rotation.z = -0.7;
  robot.add(leftAnt, rightAnt);

  return robot;
}

/**
 * Creates BOBOIBOY Character (Orange lightning cap, vest, athletic running pose)
 */
export function createBoBoiBoyCharacter(): THREE.Group {
  const bbb = new THREE.Group();

  // Head
  const headGeo = new THREE.SphereGeometry(0.5, 16, 16);
  const head = new THREE.Mesh(headGeo, materials.skinWarmLight);
  head.position.y = 2.05;
  bbb.add(head);

  // Orange Dinosaur Cap with Lightning Spikes
  const capGeo = new THREE.SphereGeometry(0.54, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const cap = new THREE.Mesh(capGeo, materials.boboiboyOrange);
  cap.position.set(0, 2.15, -0.05);

  const brimGeo = new THREE.BoxGeometry(0.65, 0.08, 0.45);
  const brim = new THREE.Mesh(brimGeo, materials.boboiboyCapDark);
  brim.position.set(0, 2.15, 0.5);
  brim.rotation.x = -0.15;

  // Lightning spike on cap
  const spikeGeo = new THREE.ConeGeometry(0.15, 0.4, 4);
  const spike = new THREE.Mesh(spikeGeo, materials.flowerAccentYellow);
  spike.position.set(0, 2.65, 0.1);
  spike.rotation.x = -0.4;
  bbb.add(cap, brim, spike);

  // Eyes and smile
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x451a03 });
  const lEye = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), eyeMat);
  lEye.position.set(-0.16, 2.1, 0.45);
  const rEye = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), eyeMat);
  rEye.position.set(0.16, 2.1, 0.45);
  bbb.add(lEye, rEye);

  // Torso: Orange vest over black shirt
  const torsoGeo = new THREE.CapsuleGeometry(0.42, 0.75, 8, 12);
  const torso = new THREE.Mesh(torsoGeo, materials.boboiboyVest);
  torso.position.y = 1.25;
  bbb.add(torso);

  // Arms (Athletic running / thumbs up)
  const armGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.7, 8);
  const leftArm = new THREE.Mesh(armGeo, materials.boboiboyVest);
  leftArm.position.set(-0.55, 1.35, 0);
  leftArm.rotation.set(-0.5, 0, 0.4);
  leftArm.name = 'leftArm';

  const rightArm = new THREE.Mesh(armGeo, materials.boboiboyVest);
  rightArm.position.set(0.55, 1.35, 0);
  rightArm.rotation.set(0.5, 0, -0.4);
  rightArm.name = 'rightArm';
  bbb.add(leftArm, rightArm);

  // Legs in brown pants
  const legGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.8, 8);
  const lLeg = new THREE.Mesh(legGeo, materials.pantsBrown);
  lLeg.position.set(-0.22, 0.4, 0);
  const rLeg = new THREE.Mesh(legGeo, materials.pantsBrown);
  rLeg.position.set(0.22, 0.4, 0);
  bbb.add(lLeg, rLeg);

  return bbb;
}

/**
 * Creates GOPAL Character (Chubby silhouette, red headband, green/yellow baseball jacket with 'C')
 */
export function createGopalCharacter(): THREE.Group {
  const gopal = new THREE.Group();

  // Chubby Head
  const headGeo = new THREE.SphereGeometry(0.62, 16, 16);
  const head = new THREE.Mesh(headGeo, materials.skinTanGopal);
  head.position.y = 2.05;
  gopal.add(head);

  // Red Sports Headband
  const bandGeo = new THREE.CylinderGeometry(0.63, 0.63, 0.15, 16);
  const band = new THREE.Mesh(bandGeo, materials.gopalHeadband);
  band.position.set(0, 2.3, 0);
  gopal.add(band);

  // Eyes & Wide Friendly Grin
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  const lEye = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), eyeMat);
  lEye.position.set(-0.18, 2.1, 0.55);
  const rEye = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), eyeMat);
  rEye.position.set(0.18, 2.1, 0.55);
  gopal.add(lEye, rEye);

  // Chubby Torso: Green & Yellow varsity jacket
  const torsoGeo = new THREE.SphereGeometry(0.72, 16, 16);
  torsoGeo.scale(1, 1.25, 0.9);
  const torso = new THREE.Mesh(torsoGeo, materials.gopalJacketGreen);
  torso.position.y = 1.15;
  gopal.add(torso);

  // Yellow sleeves and chest panel
  const chestPanelGeo = new THREE.BoxGeometry(0.75, 0.9, 0.3);
  const chestPanel = new THREE.Mesh(chestPanelGeo, materials.gopalJacketYellow);
  chestPanel.position.set(0, 1.2, 0.55);
  gopal.add(chestPanel);

  // Pumping Fists Arms
  const armGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.75, 8);
  const leftArm = new THREE.Mesh(armGeo, materials.gopalJacketGreen);
  leftArm.position.set(-0.85, 1.35, 0.2);
  leftArm.rotation.set(-0.6, 0, 0.6);
  leftArm.name = 'leftArm';

  const rightArm = new THREE.Mesh(armGeo, materials.gopalJacketYellow);
  rightArm.position.set(0.85, 1.35, 0.2);
  rightArm.rotation.set(-0.6, 0, -0.6);
  rightArm.name = 'rightArm';
  gopal.add(leftArm, rightArm);

  // White Trousers
  const legGeo = new THREE.CylinderGeometry(0.2, 0.18, 0.7, 8);
  const lLeg = new THREE.Mesh(legGeo, materials.gopalPantsWhite);
  lLeg.position.set(-0.3, 0.35, 0);
  const rLeg = new THREE.Mesh(legGeo, materials.gopalPantsWhite);
  rLeg.position.set(0.3, 0.35, 0);
  gopal.add(lLeg, rLeg);

  return gopal;
}

/**
 * Creates YAYA Character (Pink tudung with pilot goggles on forehead, pink & white outfit)
 */
export function createYayaCharacter(): THREE.Group {
  const yaya = new THREE.Group();

  // Head in Pink Tudung
  const headGeo = new THREE.SphereGeometry(0.55, 16, 16);
  const tudung = new THREE.Mesh(headGeo, materials.yayaHijabPink);
  tudung.position.y = 2.05;
  yaya.add(tudung);

  // Face oval
  const faceGeo = new THREE.SphereGeometry(0.42, 12, 12);
  const face = new THREE.Mesh(faceGeo, materials.skinWarmLight);
  face.position.set(0, 2.0, 0.2);
  yaya.add(face);

  // Pilot Flying Goggles on Forehead
  const goggleGeo = new THREE.TorusGeometry(0.16, 0.05, 8, 16);
  const lGoggle = new THREE.Mesh(goggleGeo, materials.yayaGogglesRim);
  lGoggle.position.set(-0.2, 2.38, 0.42);
  const rGoggle = new THREE.Mesh(goggleGeo, materials.yayaGogglesRim);
  rGoggle.position.set(0.2, 2.38, 0.42);

  const lensGeo = new THREE.CircleGeometry(0.12, 12);
  const lLens = new THREE.Mesh(lensGeo, materials.yayaGogglesLens);
  lLens.position.set(-0.2, 2.38, 0.43);
  const rLens = new THREE.Mesh(lensGeo, materials.yayaGogglesLens);
  rLens.position.set(0.2, 2.38, 0.43);
  yaya.add(lGoggle, rGoggle, lLens, rLens);

  // Big gentle eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x451a03 });
  const lEye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), eyeMat);
  lEye.position.set(-0.15, 2.05, 0.54);
  const rEye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), eyeMat);
  rEye.position.set(0.15, 2.05, 0.54);
  yaya.add(lEye, rEye);

  // Outfit: Pink & White tunic
  const bodyGeo = new THREE.CapsuleGeometry(0.4, 0.75, 8, 12);
  const body = new THREE.Mesh(bodyGeo, materials.yayaVestWhite);
  body.position.y = 1.25;
  yaya.add(body);

  // Arms waving cheerfully
  const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.65, 8);
  const leftArm = new THREE.Mesh(armGeo, materials.yayaHijabPink);
  leftArm.position.set(-0.52, 1.35, 0);
  leftArm.rotation.set(0.2, 0, 0.6);
  leftArm.name = 'leftArm';

  const rightArm = new THREE.Mesh(armGeo, materials.yayaHijabPink);
  rightArm.position.set(0.52, 1.45, 0);
  rightArm.rotation.set(-0.4, 0, -0.6);
  rightArm.name = 'rightArm';
  yaya.add(leftArm, rightArm);

  // Magenta trousers
  const legGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.75, 8);
  const lLeg = new THREE.Mesh(legGeo, materials.yayaPantsMagenta);
  lLeg.position.set(-0.2, 0.4, 0);
  const rLeg = new THREE.Mesh(legGeo, materials.yayaPantsMagenta);
  rLeg.position.set(0.2, 0.4, 0);
  yaya.add(lLeg, rLeg);

  return yaya;
}

/**
 * Creates YING Character (Blue beanie, round glasses, yellow jacket, speedy pose)
 */
export function createYingCharacter(): THREE.Group {
  const ying = new THREE.Group();

  // Head & Blue/Yellow Beanie
  const headGeo = new THREE.SphereGeometry(0.52, 16, 16);
  const beanie = new THREE.Mesh(headGeo, materials.yingBeanieBlue);
  beanie.position.y = 2.05;
  ying.add(beanie);

  const faceGeo = new THREE.SphereGeometry(0.42, 12, 12);
  const face = new THREE.Mesh(faceGeo, materials.skinWarmLight);
  face.position.set(0, 1.95, 0.22);
  ying.add(face);

  // Round Spectacles
  const glassGeo = new THREE.TorusGeometry(0.14, 0.035, 8, 16);
  const lGlass = new THREE.Mesh(glassGeo, materials.yingGlasses);
  lGlass.position.set(-0.18, 2.0, 0.56);
  const rGlass = new THREE.Mesh(glassGeo, materials.yingGlasses);
  rGlass.position.set(0.18, 2.0, 0.56);
  ying.add(lGlass, rGlass);

  // Yellow sporty jacket & blue shorts
  const bodyGeo = new THREE.CapsuleGeometry(0.38, 0.75, 8, 12);
  const body = new THREE.Mesh(bodyGeo, materials.yingJacketYellow);
  body.position.y = 1.25;
  ying.add(body);

  const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.65, 8);
  const leftArm = new THREE.Mesh(armGeo, materials.yingJacketYellow);
  leftArm.position.set(-0.5, 1.35, 0);
  leftArm.rotation.set(-0.5, 0, 0.4);
  leftArm.name = 'leftArm';

  const rightArm = new THREE.Mesh(armGeo, materials.yingJacketYellow);
  rightArm.position.set(0.5, 1.35, 0);
  rightArm.rotation.set(0.5, 0, -0.4);
  rightArm.name = 'rightArm';
  ying.add(leftArm, rightArm);

  const legGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.75, 8);
  const lLeg = new THREE.Mesh(legGeo, materials.yingShortsBlue);
  lLeg.position.set(-0.18, 0.4, 0);
  const rLeg = new THREE.Mesh(legGeo, materials.yingShortsBlue);
  rLeg.position.set(0.18, 0.4, 0);
  ying.add(lLeg, rLeg);

  return ying;
}

/**
 * Creates Traditional Malaysian Park Gazebo (Wakaf Kayu) as seen beside Tok Aba's Kokotiam
 */
export function createParkGazebo(): THREE.Group {
  const wakaf = new THREE.Group();

  // Elevated Timber Deck
  const deckGeo = new THREE.BoxGeometry(4.5, 0.4, 4.5);
  const deck = new THREE.Mesh(deckGeo, materials.kioskWoodDark);
  deck.position.y = 0.6;
  deck.receiveShadow = true;
  wakaf.add(deck);

  // 4 Corner Wooden Pillars
  const pillarGeo = new THREE.CylinderGeometry(0.15, 0.15, 2.8, 8);
  [
    [-1.8, -1.8],
    [1.8, -1.8],
    [-1.8, 1.8],
    [1.8, 1.8],
  ].forEach(([x, z]) => {
    const p = new THREE.Mesh(pillarGeo, materials.kioskWoodMedium);
    p.position.set(x, 2.0, z);
    p.castShadow = true;
    wakaf.add(p);
  });

  // Tiered Malaysian Pitch Roof (Thatched / Timber)
  const roofGeo = new THREE.ConeGeometry(3.6, 2.0, 4);
  roofGeo.rotateY(Math.PI / 4);
  const roof = new THREE.Mesh(roofGeo, materials.kioskWoodDark);
  roof.position.y = 4.2;
  roof.castShadow = true;
  wakaf.add(roof);

  // 3D Timber Perimeter Railings
  const railGeo = new THREE.BoxGeometry(3.6, 0.12, 0.12);
  const r1 = new THREE.Mesh(railGeo, materials.kioskWoodMedium);
  r1.position.set(0, 1.3, -1.8);
  const r2 = new THREE.Mesh(railGeo, materials.kioskWoodMedium);
  r2.position.set(0, 1.3, 1.8);
  const r3 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 3.6), materials.kioskWoodMedium);
  r3.position.set(-1.8, 1.3, 0);
  wakaf.add(r1, r2, r3);

  return wakaf;
}

/**
 * Creates BoBoiBoy-style Tree with curving organic sandy trunk and dense clumpy foliage
 */
export function createBoBoiBoyTree(treeType: 'OAK' | 'PALM' = 'OAK'): THREE.Group {
  const tree = new THREE.Group();

  if (treeType === 'PALM') {
    const trunkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.4, 2.5, 0.1),
      new THREE.Vector3(0.6, 5.5, 0.3),
      new THREE.Vector3(0.3, 7.8, 0.5),
    ]);
    const trunkGeo = new THREE.TubeGeometry(trunkCurve, 14, 0.38, 8, false);
    const trunk = new THREE.Mesh(trunkGeo, materials.treeTrunkTan);
    trunk.castShadow = true;
    tree.add(trunk);

    // Palm fronds
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const leafGroup = new THREE.Group();
      leafGroup.position.set(0.3, 7.8, 0.5);
      leafGroup.rotation.y = angle;

      const leafGeo = new THREE.ConeGeometry(0.8, 3.8, 5);
      leafGeo.rotateX(Math.PI / 2.6);
      const leaf = new THREE.Mesh(leafGeo, materials.leavesForest);
      leaf.position.set(0, 0, 1.7);
      leaf.castShadow = true;
      leafGroup.add(leaf);
      tree.add(leafGroup);
    }
  } else {
    // Curving tan trunk with branch split
    const trunkGeo = new THREE.CylinderGeometry(0.45, 0.75, 4.8, 10);
    const trunk = new THREE.Mesh(trunkGeo, materials.treeTrunkTan);
    trunk.position.y = 2.4;
    trunk.castShadow = true;
    tree.add(trunk);

    // Pillowy, dense green canopy clusters matching reference
    const c1 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.4, 1), materials.leavesBright);
    c1.position.set(0, 5.2, 0);
    const c2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.8, 1), materials.leavesForest);
    c2.position.set(1.4, 5.6, 0.8);
    const c3 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.7, 1), materials.leavesDeep);
    c3.position.set(-1.3, 4.9, -0.6);

    c1.castShadow = true;
    c2.castShadow = true;
    c3.castShadow = true;
    tree.add(c1, c2, c3);

    // Extra pillowy, clumpy 3D canopy clusters matching BoBoiBoy cartoon style
    const c4 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6, 1), materials.leavesBright);
    c4.position.set(0.6, 6.4, -0.4);
    const c5 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.5, 1), materials.leavesForest);
    c5.position.set(-0.8, 6.2, 0.6);
    c4.castShadow = true;
    c5.castShadow = true;
    tree.add(c4, c5);

    // Yellow flower blossom accents on 3D tree
    for (let f = 0; f < 6; f++) {
      const flower = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), materials.flowerAccentYellow);
      flower.position.set(
        Math.sin(f * 1.05) * 1.9,
        4.6 + (f % 3) * 0.7,
        Math.cos(f * 1.05) * 1.9
      );
      tree.add(flower);
    }
  }

  return tree;
}

/**
 * Creates Malaysian Terrace House
 */
export function createMalaysianHouse(colorIndex: number = 0): THREE.Group {
  const house = new THREE.Group();

  const wallMats = [materials.wallCream, materials.wallCyan, materials.wallPeach, materials.wallMint];
  const roofMats = [materials.roofTerracotta, materials.roofNavy];
  const wallMat = wallMats[colorIndex % wallMats.length];
  const roofMat = roofMats[colorIndex % roofMats.length];

  // Main body
  const bodyGeo = new THREE.BoxGeometry(9, 6.5, 10);
  const bodyMesh = new THREE.Mesh(bodyGeo, wallMat);
  bodyMesh.position.y = 3.25;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  house.add(bodyMesh);

  // Roof
  const roofGeo = new THREE.ConeGeometry(7.5, 3.2, 4);
  roofGeo.rotateY(Math.PI / 4);
  const roofMesh = new THREE.Mesh(roofGeo, roofMat);
  roofMesh.position.y = 8.1;
  roofMesh.scale.set(1.1, 1, 1.25);
  roofMesh.castShadow = true;
  house.add(roofMesh);

  // Car Porch
  const porchGeo = new THREE.BoxGeometry(7, 0.4, 5);
  const porchMesh = new THREE.Mesh(porchGeo, roofMat);
  porchMesh.position.set(0, 3.5, 6.5);
  house.add(porchMesh);

  // Porch Pillars
  const pillarGeo = new THREE.CylinderGeometry(0.25, 0.25, 3.5, 12);
  const p1 = new THREE.Mesh(pillarGeo, materials.wallCream);
  p1.position.set(-3.1, 1.75, 8.5);
  const p2 = new THREE.Mesh(pillarGeo, materials.wallCream);
  p2.position.set(3.1, 1.75, 8.5);
  house.add(p1, p2);

  // Door
  const doorGeo = new THREE.BoxGeometry(1.6, 2.8, 0.2);
  const doorMesh = new THREE.Mesh(doorGeo, materials.woodDoor);
  doorMesh.position.set(1.5, 1.4, 5.1);
  house.add(doorMesh);

  return house;
}

/**
 * Creates Tok Aba's Kokotiam overhead banner
 */
export function createKokotiamBanner(): THREE.Group {
  const bannerGroup = new THREE.Group();

  const postGeo = new THREE.CylinderGeometry(0.18, 0.18, 7.5, 8);
  const leftPost = new THREE.Mesh(postGeo, materials.kioskWoodDark);
  leftPost.position.set(-6, 3.75, 0);
  const rightPost = new THREE.Mesh(postGeo, materials.kioskWoodDark);
  rightPost.position.set(6, 3.75, 0);
  bannerGroup.add(leftPost, rightPost);

  const clothGeo = new THREE.BoxGeometry(11.5, 1.5, 0.15);
  const clothMesh = new THREE.Mesh(clothGeo, materials.bannerCloth);
  clothMesh.position.set(0, 5.0, 0);
  bannerGroup.add(clothMesh);

  return bannerGroup;
}

/**
 * Creates a high-fidelity 3D Character Standee using the EXACT drawings from the user's reference image!
 */
export function createCharacterArtworkStand(
  type: 'BOBOIBOY' | 'GOPAL' | 'GOPAL_RUN' | 'YAYA' | 'YING' | 'TOK_ABA' | 'OCHOBOT' | 'KOKOTIAM_FULL'
): THREE.Group {
  const stand = new THREE.Group();

  let tex = characterTextures.boboiboy;
  let aspect = 190 / 360;
  let height = 2.4;
  let width = height * aspect;
  let labelName = 'BOBOIBOY';

  if (type === 'GOPAL') {
    tex = characterTextures.gopal;
    aspect = 260 / 450;
    height = 2.7;
    width = height * aspect;
    labelName = 'GOPAL';
  } else if (type === 'GOPAL_RUN') {
    tex = characterTextures.gopalAction || characterTextures.gopal;
    aspect = 280 / 380;
    height = 2.7;
    width = height * aspect;
    labelName = 'GOPAL';
  } else if (type === 'YAYA') {
    tex = characterTextures.yaya;
    aspect = 180 / 360;
    height = 2.4;
    width = height * aspect;
    labelName = 'YAYA';
  } else if (type === 'YING') {
    tex = characterTextures.ying;
    aspect = 170 / 320;
    height = 2.3;
    width = height * aspect;
    labelName = 'YING';
  } else if (type === 'TOK_ABA') {
    tex = characterTextures.tokAba;
    aspect = 190 / 250;
    height = 2.2;
    width = height * aspect;
    labelName = 'TOK ABA';
  } else if (type === 'OCHOBOT') {
    tex = characterTextures.ochobot;
    aspect = 1.0;
    height = 1.4;
    width = 1.4;
    labelName = 'OCHOBOT';
  } else if (type === 'KOKOTIAM_FULL') {
    tex = characterTextures.kokotiamCenterpiece;
    aspect = 16 / 9;
    height = 4.2;
    width = height * aspect;
    labelName = "TOK ABA'S KOKOTIAM";
  }

  // 1. 3D Pedestal on Sidewalk
  const pedGeo = new THREE.CylinderGeometry(0.8, 0.9, 0.18, 16);
  const ped = new THREE.Mesh(pedGeo, materials.kioskWoodDark);
  ped.position.y = 0.09;
  ped.receiveShadow = true;
  stand.add(ped);

  const ringGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.06, 16);
  const ring = new THREE.Mesh(ringGeo, materials.kioskYellow);
  ring.position.y = 0.2;
  stand.add(ring);

  // 2. Artwork Standee Plane (Double-sided with real drawing from reference)
  const planeGeo = new THREE.PlaneGeometry(width, height);
  const planeMat = new THREE.MeshBasicMaterial({
    map: tex,
    side: THREE.DoubleSide,
    transparent: true,
  });
  const planeMesh = new THREE.Mesh(planeGeo, planeMat);
  planeMesh.position.y = height / 2 + 0.22;
  planeMesh.name = 'charArtwork';
  stand.add(planeMesh);

  // 3. Golden Cartoon Border Backplate
  const backGeo = new THREE.BoxGeometry(width + 0.12, height + 0.12, 0.04);
  const backMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.4,
    metalness: 0.3,
  });
  const backMesh = new THREE.Mesh(backGeo, backMat);
  backMesh.position.y = height / 2 + 0.22;
  backMesh.position.z = -0.03;
  stand.add(backMesh);

  return stand;
}

/**
 * Creates 100% full 3D animated cartoon characters in BoBoiBoy style
 */
export function createFull3DCharacter(
  type: 'BOBOIBOY' | 'GOPAL' | 'GOPAL_RUN' | 'YAYA' | 'YING' | 'TOK_ABA' | 'OCHOBOT'
): THREE.Group {
  const container = new THREE.Group();

  let charGroup: THREE.Group;
  if (type === 'BOBOIBOY') {
    charGroup = createBoBoiBoyCharacter();
  } else if (type === 'GOPAL' || type === 'GOPAL_RUN') {
    charGroup = createGopalCharacter();
  } else if (type === 'YAYA') {
    charGroup = createYayaCharacter();
  } else if (type === 'YING') {
    charGroup = createYingCharacter();
  } else if (type === 'TOK_ABA') {
    charGroup = createTokAbaCharacter();
  } else {
    charGroup = createOchobotMesh();
    charGroup.position.y = 1.4;
  }

  container.add(charGroup);

  // 3D Circular Pedestal with warm wood and yellow trim
  const pedGeo = new THREE.CylinderGeometry(0.75, 0.85, 0.12, 16);
  const ped = new THREE.Mesh(pedGeo, materials.kioskWoodDark);
  ped.position.y = 0.06;
  ped.receiveShadow = true;
  container.add(ped);

  const ringGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.04, 16);
  const ring = new THREE.Mesh(ringGeo, materials.kioskYellow);
  ring.position.y = 0.13;
  container.add(ring);

  return container;
}
