import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  createTokAbaKokotiam,
  createFull3DCharacter,
  createBoBoiBoyCharacter,
  createGopalCharacter,
  createYayaCharacter,
  createYingCharacter,
  createParkGazebo,
  createBoBoiBoyTree,
  createMalaysianHouse,
  createKokotiamBanner,
  materials,
  characterTextures,
} from './cartoonNeighborhood';
import { createObstacleMesh } from './obstacleManager';
import {
  BASE_RUN_SPEED,
  SPEED_MULTIPLIERS,
  generateObstacleCourse,
  getCurrentPhaseIndex,
  estimatePhysicalMetrics,
  evaluateActionSuccess,
  WARMUP_PHASES,
} from '../game/warmupRules';
import { soundEngine } from '../audio/soundEngine';
import { ActionType, GameMode, SpeedLevel, ActiveActionPrompt, WarmupMetrics, ObstacleData } from '../types';

interface FirstPersonRunnerSceneProps {
  isPlaying: boolean;
  gameMode: GameMode;
  speedLevel: SpeedLevel;
  onMetricsUpdate: (metrics: WarmupMetrics) => void;
  onActivePromptChange: (prompt: ActiveActionPrompt | null) => void;
  onFeedback: (text: string, isSuccess: boolean) => void;
  onPhaseComplete: () => void;
  onSessionFinish: () => void;
  jumpTrigger?: number;
  duckTrigger?: number;
  leftTrigger?: number;
  rightTrigger?: number;
}

export const FirstPersonRunnerScene: React.FC<FirstPersonRunnerSceneProps> = ({
  isPlaying,
  gameMode,
  speedLevel,
  onMetricsUpdate,
  onActivePromptChange,
  onFeedback,
  onPhaseComplete,
  onSessionFinish,
  jumpTrigger,
  duckTrigger,
  leftTrigger,
  rightTrigger,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    isPlaying,
    gameMode,
    speedLevel,
    onMetricsUpdate,
    onActivePromptChange,
    onFeedback,
    onPhaseComplete,
    onSessionFinish,
    playerLane: 0 as -1 | 0 | 1,
    targetLane: 0 as -1 | 0 | 1,
    cameraBaseY: 1.45,
    cameraYOffset: 0,
    isJumping: false,
    jumpTime: 0,
    isDucking: false,
    duckTime: 0,
    currentZ: 0,
    elapsedSeconds: 0,
    totalDuration: 230,
    score: 0,
    streak: 0,
    clearedCount: 0,
    lastAnnouncedPhase: 0,
    lastWhistleObstacleId: '',
  });

  // Keep stateRef in sync with React props
  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
    stateRef.current.gameMode = gameMode;
    stateRef.current.speedLevel = speedLevel;
    stateRef.current.onMetricsUpdate = onMetricsUpdate;
    stateRef.current.onActivePromptChange = onActivePromptChange;
    stateRef.current.onFeedback = onFeedback;
    stateRef.current.onPhaseComplete = onPhaseComplete;
    stateRef.current.onSessionFinish = onSessionFinish;

    if (isPlaying) {
      soundEngine.startMusic();
      const currentPhase = getCurrentPhaseIndex(stateRef.current.elapsedSeconds);
      soundEngine.setTempo(WARMUP_PHASES[currentPhase]?.targetBpm || 130);
    } else {
      soundEngine.stopMusic();
    }
  }, [isPlaying, gameMode, speedLevel, onMetricsUpdate, onActivePromptChange, onFeedback, onPhaseComplete, onSessionFinish]);

  const performJump = () => {
    const s = stateRef.current;
    if (s.isJumping) return;
    s.isJumping = true;
    s.jumpTime = 0;
    soundEngine.playJumpSfx();
  };

  const performDuck = () => {
    const s = stateRef.current;
    if (s.isDucking) return;
    s.isDucking = true;
    s.duckTime = 0;
    soundEngine.playDuckSfx();
  };

  const performLaneShift = (direction: -1 | 1) => {
    const s = stateRef.current;
    if (direction === -1) {
      if (s.targetLane > -1) {
        s.targetLane = (s.targetLane - 1) as -1 | 0 | 1;
        soundEngine.playStepSfx();
      }
    } else {
      if (s.targetLane < 1) {
        s.targetLane = (s.targetLane + 1) as -1 | 0 | 1;
        soundEngine.playStepSfx();
      }
    }
  };

  // External UI button triggers
  useEffect(() => {
    if (!jumpTrigger) return;
    performJump();
  }, [jumpTrigger]);

  useEffect(() => {
    if (!duckTrigger) return;
    performDuck();
  }, [duckTrigger]);

  useEffect(() => {
    if (!leftTrigger) return;
    performLaneShift(-1);
  }, [leftTrigger]);

  useEffect(() => {
    if (!rightTrigger) return;
    performLaneShift(1);
  }, [rightTrigger]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        performLaneShift(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        performLaneShift(1);
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        e.preventDefault();
        performJump();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        performDuck();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main Three.js Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL as per Three.js skill
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x60a5fa); // Bright sunny BoBoiBoy sky
    scene.fog = new THREE.Fog(0x60a5fa, 75, 250);

    const camera = new THREE.PerspectiveCamera(
      65,
      container.clientWidth / container.clientHeight,
      0.1,
      350
    );
    camera.position.set(0, stateRef.current.cameraBaseY, 0);
    camera.lookAt(0, stateRef.current.cameraBaseY, 50);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Warm Tropical Sun Light matching BoBoiBoy animated aesthetic
    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.05);
    sunLight.position.set(25, 45, 35);
    sunLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 10;
      sunLight.shadow.camera.far = 180;
      sunLight.shadow.camera.left = -25;
      sunLight.shadow.camera.right = 25;
      sunLight.shadow.camera.top = 25;
      sunLight.shadow.camera.bottom = -25;
      sunLight.shadow.bias = -0.0005;
    }
    scene.add(sunLight);
    scene.add(sunLight.target);

    // Rich Sky & Lawn fill
    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x4d8b1e, 0.85);
    scene.add(hemiLight);

    // Authentic Pulau Rintis Sky Dome with background hills and cartoon clouds from reference image
    const skyGeo = new THREE.CylinderGeometry(240, 240, 110, 32, 1, true);
    const skyMat = new THREE.MeshBasicMaterial({
      map: characterTextures.pulauRintisSky,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.96,
    });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    skyDome.position.set(0, 35, 0);
    scene.add(skyDome);

    // --- CONTINUOUS RECYCLING BOBOIBOY NEIGHBORHOOD TRACK ---
    const SEGMENT_LENGTH = 60;
    const NUM_SEGMENTS = 25; // 25 * 60 = 1500 units loaded
    const segments: Array<{
      group: THREE.Group;
      baseZ: number;
      index: number;
    }> = [];

    const animatedCharacters: Array<{
      group: THREE.Group;
      swingSpeed: number;
      type: 'BOBOIBOY' | 'GOPAL' | 'GOPAL_RUN' | 'YAYA' | 'YING' | 'TOK_ABA' | 'OCHOBOT' | 'KOKOTIAM_FULL';
    }> = [];

    // Builds a single 60m segment in BoBoiBoy & Tok Aba's Kokotiam theme
    const buildSegment = (segIdx: number, segZ: number) => {
      const segGroup = new THREE.Group();
      segGroup.position.z = segZ;

      // 1. Lush Green Park Lawn matching reference image
      const grassGeo = new THREE.PlaneGeometry(160, SEGMENT_LENGTH);
      grassGeo.rotateX(-Math.PI / 2);
      const grass = new THREE.Mesh(grassGeo, materials.grass);
      grass.position.set(0, -0.02, SEGMENT_LENGTH / 2);
      grass.receiveShadow = true;
      segGroup.add(grass);

      // 2. Stone Paved Jogging Pathway (10.5m wide)
      const roadGeo = new THREE.PlaneGeometry(10.5, SEGMENT_LENGTH);
      roadGeo.rotateX(-Math.PI / 2);
      const road = new THREE.Mesh(roadGeo, materials.roadAsphalt);
      road.position.set(0, 0, SEGMENT_LENGTH / 2);
      road.receiveShadow = true;
      segGroup.add(road);

      // 3. Sidewalks & Curb Pavers
      const walkGeo = new THREE.BoxGeometry(2.4, 0.25, SEGMENT_LENGTH);
      const leftWalk = new THREE.Mesh(walkGeo, materials.sidewalkTile);
      leftWalk.position.set(-6.4, 0.1, SEGMENT_LENGTH / 2);
      leftWalk.receiveShadow = true;

      const rightWalk = new THREE.Mesh(walkGeo, materials.sidewalkTile);
      rightWalk.position.set(6.4, 0.1, SEGMENT_LENGTH / 2);
      rightWalk.receiveShadow = true;
      segGroup.add(leftWalk, rightWalk);

      // 4. Subtle Park Stone Lane Markers (3 distinct running lanes)
      const stripeGeo = new THREE.PlaneGeometry(0.25, 4.0);
      stripeGeo.rotateX(-Math.PI / 2);
      for (let zLocal = 4; zLocal < SEGMENT_LENGTH; zLocal += 8.5) {
        const s1 = new THREE.Mesh(stripeGeo, materials.roadStripe);
        s1.position.set(-1.4, 0.02, zLocal);
        const s2 = new THREE.Mesh(stripeGeo, materials.roadStripe);
        s2.position.set(1.4, 0.02, zLocal);
        segGroup.add(s1, s2);
      }

      // 5. TOK ABA'S KOKOTIAM PARK & LANDMARKS (Authentic 100% composition from reference image)
      if (segIdx === 0) {
        // Tok Aba's Kokotiam Kiosk right on the right at z = 18!
        const kokotiam = createTokAbaKokotiam();
        kokotiam.position.set(6.4, 0, 18);
        kokotiam.rotation.y = -Math.PI / 2 + 0.35;
        kokotiam.scale.set(1.15, 1.15, 1.15);
        segGroup.add(kokotiam);

        // Malaysian Park Gazebo (Wakaf) on the left at z = 16!
        const gazebo = createParkGazebo();
        gazebo.position.set(-6.8, 0, 16);
        gazebo.rotation.y = Math.PI / 2 - 0.35;
        gazebo.scale.set(1.1, 1.1, 1.1);
        segGroup.add(gazebo);

        // Organic BoBoiBoy bent tree right behind Tok Aba at z = 24!
        const treeRight = createBoBoiBoyTree('OAK');
        treeRight.position.set(7.5, 0, 24);
        segGroup.add(treeRight);

        // BoBoiBoy cheering on left at z = 8
        const bbbStand = createFull3DCharacter('BOBOIBOY');
        bbbStand.position.set(-4.2, 0, 8);
        bbbStand.rotation.y = Math.PI - 0.25;
        segGroup.add(bbbStand);

        // Gopal running on right at z = 10
        const gopalRun = createFull3DCharacter('GOPAL_RUN');
        gopalRun.position.set(4.2, 0, 10);
        gopalRun.rotation.y = Math.PI + 0.25;
        segGroup.add(gopalRun);

        // Ochobot floating next to Tok Aba at z = 17
        const ochoStand = createFull3DCharacter('OCHOBOT');
        ochoStand.position.set(3.8, 0, 17);
        ochoStand.rotation.y = Math.PI + 0.2;
        segGroup.add(ochoStand);

        // Yaya cheering on left at z = 24
        const yayaStand = createFull3DCharacter('YAYA');
        yayaStand.position.set(-4.2, 0, 24);
        yayaStand.rotation.y = Math.PI - 0.25;
        segGroup.add(yayaStand);

        // Ying cheering on right at z = 28
        const yingStand = createFull3DCharacter('YING');
        yingStand.position.set(4.2, 0, 28);
        yingStand.rotation.y = Math.PI + 0.25;
        segGroup.add(yingStand);
      } else if (segIdx % 2 === 0) {
        // Tok Aba's Kokotiam Kiosk on the right, angled toward runner
        const kokotiam = createTokAbaKokotiam();
        kokotiam.position.set(6.8, 0, SEGMENT_LENGTH / 2);
        kokotiam.rotation.y = -Math.PI / 2 + 0.35;
        kokotiam.scale.set(1.15, 1.15, 1.15);
        segGroup.add(kokotiam);

        // Malaysian Park Gazebo (Wakaf Kayu) on the left
        const gazebo = createParkGazebo();
        gazebo.position.set(-7.0, 0, SEGMENT_LENGTH / 2 - 2);
        gazebo.rotation.y = Math.PI / 2 - 0.35;
        gazebo.scale.set(1.1, 1.1, 1.1);
        segGroup.add(gazebo);

        // Organic BoBoiBoy bent tree right behind the kiosk
        const treeRight = createBoBoiBoyTree('OAK');
        treeRight.position.set(7.8, 0, SEGMENT_LENGTH / 2 + 10);
        segGroup.add(treeRight);

        // Cheering full 3D cartoon character on sidewalk
        const charTypeLeft = segIdx % 4 === 0 ? 'BOBOIBOY' : 'YAYA';
        const charStandLeft = createFull3DCharacter(charTypeLeft);
        charStandLeft.position.set(-4.5, 0, 24);
        charStandLeft.rotation.y = Math.PI - 0.25;
        segGroup.add(charStandLeft);
        animatedCharacters.push({
          group: charStandLeft,
          swingSpeed: charTypeLeft === 'YAYA' ? 5.2 : 4.5,
          type: charTypeLeft,
        });

        const charTypeRight = segIdx % 4 === 0 ? 'GOPAL_RUN' : 'YING';
        const charStandRight = createFull3DCharacter(charTypeRight);
        charStandRight.position.set(4.5, 0, 34);
        charStandRight.rotation.y = Math.PI + 0.25;
        segGroup.add(charStandRight);
        animatedCharacters.push({
          group: charStandRight,
          swingSpeed: charTypeRight === 'YING' ? 6.2 : 4.8,
          type: charTypeRight,
        });
      } else {
        // Lush BoBoiBoy park trees along sidewalks with blossom flowers
        const treeLeft = createBoBoiBoyTree('OAK');
        treeLeft.position.set(-7.2, 0, 18);
        const treeRight = createBoBoiBoyTree('OAK');
        treeRight.position.set(7.2, 0, 42);
        segGroup.add(treeLeft, treeRight);

        // Cheering full 3D cartoon character on sidewalk
        const charTypeLeft = segIdx % 3 === 0 ? 'TOK_ABA' : 'BOBOIBOY';
        const charStandLeft = createFull3DCharacter(charTypeLeft);
        charStandLeft.position.set(-4.5, 0, 20);
        charStandLeft.rotation.y = Math.PI - 0.25;
        segGroup.add(charStandLeft);
        animatedCharacters.push({
          group: charStandLeft,
          swingSpeed: 3.5,
          type: charTypeLeft,
        });

        const charTypeRight = segIdx % 3 === 0 ? 'OCHOBOT' : 'GOPAL_RUN';
        const charStandRight = createFull3DCharacter(charTypeRight);
        charStandRight.position.set(4.5, 0, 38);
        charStandRight.rotation.y = Math.PI + 0.25;
        segGroup.add(charStandRight);
        animatedCharacters.push({
          group: charStandRight,
          swingSpeed: 4.8,
          type: charTypeRight,
        });

        // Distant village houses far in the background hills (x = ±42) to keep path open
        const houseLeft = createMalaysianHouse(segIdx);
        houseLeft.position.set(-42, 0, SEGMENT_LENGTH / 2);
        houseLeft.scale.set(0.7, 0.7, 0.7);
        houseLeft.rotation.y = Math.PI / 2;
        segGroup.add(houseLeft);

        const houseRight = createMalaysianHouse(segIdx + 2);
        houseRight.position.set(42, 0, SEGMENT_LENGTH / 2);
        houseRight.scale.set(0.7, 0.7, 0.7);
        houseRight.rotation.y = -Math.PI / 2;
        segGroup.add(houseRight);
      }

      // 7. Overhead Tok Aba Kokotiam Banner every 2 segments
      if (segIdx % 2 === 0) {
        const banner = createKokotiamBanner();
        banner.position.set(0, 0, SEGMENT_LENGTH / 2);
        segGroup.add(banner);
      }

      scene.add(segGroup);
      return { group: segGroup, baseZ: segZ, index: segIdx };
    };

    // Initialize all segments
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      segments.push(buildSegment(i, i * SEGMENT_LENGTH));
    }

    // Clouds in the sky (Fluffy 3D cartoon clouds)
    const cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 });
    const clouds: THREE.Group[] = [];
    for (let c = 0; c < 20; c++) {
      const cloudGroup = new THREE.Group();
      const numPuffs = 3 + Math.floor(Math.random() * 3);
      for (let p = 0; p < numPuffs; p++) {
        const puff = new THREE.Mesh(
          new THREE.DodecahedronGeometry(5 + Math.random() * 4, 1),
          cloudMat
        );
        puff.position.set(p * 4.5 - 4.5, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 3);
        cloudGroup.add(puff);
      }
      cloudGroup.position.set(
        (Math.random() - 0.5) * 200,
        32 + Math.random() * 20,
        c * 80
      );
      scene.add(cloudGroup);
      clouds.push(cloudGroup);
    }

    // --- OBSTACLES POOL & GENERATION ---
    const obstacles: ObstacleData[] = generateObstacleCourse(2400);
    const obstacleMeshMap = new Map<string, THREE.Group>();

    obstacles.forEach((obs) => {
      const mesh = createObstacleMesh(obs);
      scene.add(mesh);
      obstacleMeshMap.set(obs.id, mesh);
    });

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation & Pacing variables
    let animationFrameId = 0;
    let lastTime = performance.now();
    let currentLaneX = 0;
    let headBobPhase = 0;
    let nextSegIdx = NUM_SEGMENTS;

    // Software WebGL pacing helper
    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          animationFrameId = window.setTimeout(poll, 10);
        } else {
          gl.deleteSync(sync);
          animationFrameId = window.setTimeout(cb, 90);
        }
      };
      animationFrameId = window.setTimeout(poll, 10);
    }

    // MAIN RENDER & FORWARD MOVEMENT LOOP
    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const s = stateRef.current;

      if (s.isPlaying) {
        s.elapsedSeconds += dt;
        const currentSpeedMultiplier = SPEED_MULTIPLIERS[s.speedLevel];
        const effectiveSpeed = BASE_RUN_SPEED * currentSpeedMultiplier;

        // Move forward continuously along +Z
        s.currentZ += effectiveSpeed * dt;

        // Update Sun Light and Sky Dome to follow player forward
        sunLight.position.set(currentLaneX + 30, 50, s.currentZ + 40);
        sunLight.target.position.set(currentLaneX, 0, s.currentZ + 20);
        skyDome.position.set(currentLaneX, 35, s.currentZ);

        // Recycle world segments that fall behind player
        segments.forEach((seg) => {
          if (seg.group.position.z + SEGMENT_LENGTH < s.currentZ - 40) {
            let maxZ = 0;
            segments.forEach((other) => {
              if (other.group.position.z > maxZ) maxZ = other.group.position.z;
            });
            seg.group.position.z = maxZ + SEGMENT_LENGTH;
            seg.index = nextSegIdx++;
          }
        });

        // Recycle clouds
        clouds.forEach((cloud) => {
          if (cloud.position.z < s.currentZ - 40) {
            cloud.position.z += 20 * 80;
            cloud.position.x = (Math.random() - 0.5) * 200;
          }
        });

        // Animate full 3D BoBoiBoy characters (arms jogging/cheering, legs jogging, ochobot floating)
        const timeSec = s.elapsedSeconds;
        animatedCharacters.forEach((item) => {
          const rightArm = item.group.getObjectByName('rightArm');
          if (rightArm) {
            rightArm.rotation.x = Math.sin(timeSec * item.swingSpeed) * 0.6;
          }
          const leftArm = item.group.getObjectByName('leftArm');
          if (leftArm) {
            leftArm.rotation.x = -Math.sin(timeSec * item.swingSpeed) * 0.6;
          }
          const rightLeg = item.group.getObjectByName('rightLeg');
          if (rightLeg) {
            rightLeg.rotation.x = -Math.sin(timeSec * item.swingSpeed) * 0.45;
          }
          const leftLeg = item.group.getObjectByName('leftLeg');
          if (leftLeg) {
            leftLeg.rotation.x = Math.sin(timeSec * item.swingSpeed) * 0.45;
          }
          if (item.type === 'OCHOBOT') {
            item.group.position.y = 1.4 + Math.sin(timeSec * 3.5) * 0.25;
            item.group.rotation.y = Math.sin(timeSec * 2.0) * 0.25;
          }
        });

        // Animate Ochobot floating next to Kokotiam
        scene.traverse((obj) => {
          if (obj.name === 'ochobot') {
            obj.position.y = 2.8 + Math.sin(timeSec * 3.5) * 0.25;
            obj.rotation.y = Math.sin(timeSec * 2.0) * 0.3;
          }
        });

        // Warm-up Phase Transition
        const currentPhaseIdx = getCurrentPhaseIndex(s.elapsedSeconds);
        if (currentPhaseIdx !== s.lastAnnouncedPhase) {
          s.lastAnnouncedPhase = currentPhaseIdx;
          soundEngine.setTempo(WARMUP_PHASES[currentPhaseIdx].targetBpm);
          soundEngine.playWhistleCue();
          s.onPhaseComplete();
        }

        // Check for upcoming obstacles ahead of camera (+Z)
        const lookaheadDistance = effectiveSpeed * 3.2;
        let activePrompt: ActiveActionPrompt | null = null;

        for (const obs of obstacles) {
          // Recycle obstacle forward if it falls behind
          if (obs.zPos < s.currentZ - 30) {
            let maxObsZ = 0;
            obstacles.forEach((o) => {
              if (o.zPos > maxObsZ) maxObsZ = o.zPos;
            });
            obs.zPos = maxObsZ + 60 + Math.floor(Math.random() * 20);
            obs.cleared = false;
            const mesh = obstacleMeshMap.get(obs.id);
            if (mesh) {
              mesh.position.z = obs.zPos;
            }
          }

          const distanceToObs = obs.zPos - s.currentZ;

          // Ahead in prompt window
          if (distanceToObs > 0 && distanceToObs < lookaheadDistance) {
            const timeRemainingRatio = Math.max(0, Math.min(1, distanceToObs / lookaheadDistance));

            if (s.lastWhistleObstacleId !== obs.id && distanceToObs < lookaheadDistance * 0.88) {
              s.lastWhistleObstacleId = obs.id;
              soundEngine.playWhistleCue();
            }

            activePrompt = {
              type: obs.type,
              title: obs.actionBM,
              subtitle: obs.tipBM,
              timeRemainingRatio,
              targetDistance: distanceToObs,
            };

            // In AUTO_TAYANGAN:
            if (s.gameMode === 'AUTO_TAYANGAN') {
              if (distanceToObs < effectiveSpeed * 1.05 && !obs.cleared) {
                if (obs.type === 'LOMPAT' && !s.isJumping) {
                  performJump();
                } else if (obs.type === 'TUNDUK' && !s.isDucking) {
                  performDuck();
                } else if (obs.type === 'KIRI') {
                  s.targetLane = -1;
                } else if (obs.type === 'KANAN') {
                  s.targetLane = 1;
                }
              }
            }

            break;
          }

          // Clearance evaluation
          if (!obs.cleared && Math.abs(distanceToObs) < 2.5) {
            obs.cleared = true;
            s.clearedCount++;

            let playerAction: ActionType | null = null;
            if (s.isJumping) playerAction = 'LOMPAT';
            else if (s.isDucking) playerAction = 'TUNDUK';
            else if (s.targetLane === -1) playerAction = 'KIRI';
            else if (s.targetLane === 1) playerAction = 'KANAN';

            const evalResult = evaluateActionSuccess(
              obs.type,
              playerAction,
              s.targetLane,
              obs.lane
            );

            if (evalResult.success) {
              s.score += evalResult.scoreDelta + s.streak * 10;
              s.streak++;
              soundEngine.playSuccessChime();
              s.onFeedback(evalResult.feedbackBM, true);
            } else {
              s.streak = 0;
              s.onFeedback(evalResult.feedbackBM, false);
            }
          }
        }

        s.onActivePromptChange(activePrompt);

        // Update physical metrics for Year 5 pupils
        const metrics = estimatePhysicalMetrics(s.elapsedSeconds, currentSpeedMultiplier);
        s.onMetricsUpdate({
          elapsedSeconds: Math.floor(s.elapsedSeconds),
          totalDurationSeconds: s.totalDuration,
          currentPhaseIndex: currentPhaseIdx,
          stepsEstimated: metrics.steps,
          caloriesBurned: metrics.calories,
          score: s.score,
          streak: s.streak,
          successfulActions: s.clearedCount,
        });

        // Check session completion
        if (s.elapsedSeconds >= s.totalDuration) {
          s.isPlaying = false;
          soundEngine.stopMusic();
          soundEngine.playCelebrationFanfare();
          s.onSessionFinish();
        }

        // --- CAMERA KINEMATICS (FIRST-PERSON FORWARD POV) ---
        // Note: Camera points along +Z. In standard right-handed space, viewer's visual LEFT is +X, visual RIGHT is -X.
        // Therefore, s.targetLane (-1 for KIRI, +1 for KANAN) maps to targetX = -s.targetLane * 2.8.
        const targetX = -s.targetLane * 2.8;
        currentLaneX = THREE.MathUtils.damp(currentLaneX, targetX, 8, dt);

        headBobPhase += dt * (12.5 * currentSpeedMultiplier);
        const bobY = Math.sin(headBobPhase) * 0.08;
        const bobX = Math.cos(headBobPhase * 0.5) * 0.04;

        if (s.isJumping) {
          s.jumpTime += dt;
          const jumpDuration = 0.65;
          if (s.jumpTime >= jumpDuration) {
            s.isJumping = false;
            s.cameraYOffset = 0;
          } else {
            const t = s.jumpTime / jumpDuration;
            s.cameraYOffset = Math.sin(t * Math.PI) * 1.35;
          }
        }

        if (s.isDucking) {
          s.duckTime += dt;
          const duckDuration = 0.75;
          if (s.duckTime >= duckDuration) {
            s.isDucking = false;
            s.cameraYOffset = 0;
          } else {
            const t = s.duckTime / duckDuration;
            s.cameraYOffset = -Math.sin(t * Math.PI) * 0.85;
          }
        }

        // Camera position
        camera.position.x = currentLaneX + bobX;
        camera.position.y = s.cameraBaseY + s.cameraYOffset + (s.isJumping || s.isDucking ? 0 : bobY);
        camera.position.z = s.currentZ;

        // Look forward along +Z
        const lookAheadZ = s.currentZ + 40;
        const lookAheadY = s.cameraBaseY + s.cameraYOffset * 0.15 + (s.isJumping || s.isDucking ? 0 : bobY * 0.15);
        const lookAheadX = currentLaneX + bobX * 0.15;
        camera.lookAt(lookAheadX, lookAheadY, lookAheadZ);

        // Dynamic tilt (rolls naturally into lane change)
        const laneVelocity = (targetX - currentLaneX);
        camera.rotation.z += laneVelocity * 0.025 + (s.isJumping || s.isDucking ? 0 : Math.sin(headBobPhase * 0.5) * 0.012);
        if (s.isJumping) {
          camera.rotation.x -= 0.04;
        } else if (s.isDucking) {
          camera.rotation.x += 0.06;
        }
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      animationFrameId = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (isSoftwareGl) {
        clearTimeout(animationFrameId);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      data-testid="three-canvas-container"
      className="absolute inset-0 w-full h-full overflow-hidden select-none"
    />
  );
};
