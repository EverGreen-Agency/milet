import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const gsap = window.gsap;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const compactViewport = window.matchMedia('(max-width: 720px)').matches;

const STAGES = [
  {
    short: 'Centelha',
    title: 'Energia em estado puro',
    description: 'Um traço fino atravessa o espaço antes de descobrir sua frequência.'
  },
  {
    short: 'Frequência',
    title: 'A energia encontra um ritmo',
    description: 'A centelha se organiza como corrente alternada: amplitude, pulso e direção.'
  },
  {
    short: 'Estrutura',
    title: 'O sistema revela sua lógica',
    description: 'A frequência se fecha em uma estrutura triangular contínua, ainda leve e técnica.'
  },
  {
    short: 'Circuito',
    title: 'O percurso se torna infinito',
    description: 'O traço ganha largura e estabelece uma abertura central estável, sem começo ou fim visível.'
  },
  {
    short: 'Torção',
    title: 'Plano se transforma em volume',
    description: 'Uma torção contínua percorre a fita e converte o circuito em um corpo espacial inspirado na continuidade de Möbius.'
  },
  {
    short: 'Símbolo',
    title: 'A matéria passa a viver',
    description: 'Assimetria, espessura, refração e luz consolidam a assinatura âmbar da Milet.'
  }
];

const viewport = document.getElementById('objectViewport');
const canvas = document.getElementById('miletCanvas');
const loadingState = document.getElementById('loadingState');
const fallback = document.getElementById('webglFallback');
const stageBadge = document.getElementById('stageBadge');
const stageTitle = document.getElementById('stageTitle');
const stageHeading = document.getElementById('stageHeading');
const stageDescription = document.getElementById('stageDescription');
const meshMetric = document.getElementById('meshMetric');
const interactionHint = document.getElementById('interactionHint');
const stageButtons = [...document.querySelectorAll('.stage-step')];
const scrubber = document.getElementById('stageScrubber');
const scrubberOutput = document.getElementById('scrubberOutput');
const prevButton = document.getElementById('stagePrev');
const playButton = document.getElementById('stagePlay');
const playIcon = document.getElementById('playIcon');
const playLabel = document.getElementById('playLabel');
const nextButton = document.getElementById('stageNext');
const speedSelect = document.getElementById('stageSpeed');
const loopButton = document.getElementById('loopToggle');
const wireButton = document.getElementById('wireToggle');
const cameraReset = document.getElementById('cameraReset');

if (!gsap) {
  showFallback('A biblioteca de coreografia não pôde ser carregada.');
  throw new Error('GSAP is required for the 3D motion timeline.');
}

const SEGMENTS = compactViewport ? 96 : 144;
const WIDTH_SEGMENTS = compactViewport ? 10 : 12;
const ROW = WIDTH_SEGMENTS + 1;
const LAYER_STRIDE = (SEGMENTS + 1) * ROW;
const VERTEX_COUNT = LAYER_STRIDE * 2;
const BASE_DURATION = 12;
const STEP_TIME = BASE_DURATION / (STAGES.length - 1);
const TAU = Math.PI * 2;

let renderer;
let composer;
let bloomPass;
let controls;
let camera;
let scene;
let objectRoot;
let geometry;
let primaryMaterial;
let wireMaterial;
let wireMesh;
let particleField;
let masterTimeline;
let manualTween;
let wireForced = false;
let loopActive = true;
let userOrbiting = false;
let currentUiStage = -1;
let lastRenderedProgress = Number.NaN;

const motionState = { progress: 0 };
const stagePositions = [];
const timer = new THREE.Timer();
timer.connect(document);
const paleAmber = new THREE.Color(0xffd98a);
const livingAmber = new THREE.Color(0xd38d29);
const symbolCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 2.02, 0),
  new THREE.Vector3(0.82, 1.68, 0),
  new THREE.Vector3(1.5, 0.9, 0),
  new THREE.Vector3(1.78, -0.12, 0),
  new THREE.Vector3(1.44, -1.08, 0),
  new THREE.Vector3(0.58, -1.65, 0),
  new THREE.Vector3(-0.44, -1.68, 0),
  new THREE.Vector3(-1.28, -1.16, 0),
  new THREE.Vector3(-1.72, -0.24, 0),
  new THREE.Vector3(-1.48, 0.74, 0),
  new THREE.Vector3(-0.72, 1.58, 0)
], true, 'centripetal', 0.45);

try {
  initializeScene();
  initializeTimeline();
  bindInteractions();
  updateMorph(true);
  resizeRenderer();
  renderer.setAnimationLoop(renderFrame);
  requestAnimationFrame(() => loadingState.classList.add('is-hidden'));
} catch (error) {
  console.error(error);
  showFallback('Não foi possível construir a cena WebGL neste navegador.');
}

function initializeScene() {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !compactViewport,
    alpha: false,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compactViewport ? 1.25 : 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.94;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070604);
  scene.fog = new THREE.FogExp2(0x070604, 0.045);

  camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
  camera.position.set(0, 0.12, compactViewport ? 9.2 : 8.2);

  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.065;
  controls.enablePan = false;
  controls.minDistance = 5.4;
  controls.maxDistance = 12;
  controls.minPolarAngle = Math.PI * 0.28;
  controls.maxPolarAngle = Math.PI * 0.72;
  controls.target.set(0, 0.08, 0);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0xffe4b0, 0x1d0e04, 1.05));

  const keyLight = new THREE.SpotLight(0xffd08a, 34, 18, Math.PI * 0.22, 0.72, 1.4);
  keyLight.position.set(4.6, 5.2, 6.2);
  scene.add(keyLight);

  const edgeLight = new THREE.PointLight(0xff7d20, 18, 13, 1.7);
  edgeLight.position.set(-4.5, -2.2, 3.4);
  scene.add(edgeLight);

  const coolFill = new THREE.DirectionalLight(0xfff5dd, 1.15);
  coolFill.position.set(-3, 1, -4);
  scene.add(coolFill);

  objectRoot = new THREE.Group();
  objectRoot.rotation.set(-0.08, -0.06, -0.025);
  objectRoot.scale.setScalar(compactViewport ? 0.78 : 0.84);
  scene.add(objectRoot);

  geometry = createRibbonGeometry();
  for (let stage = 0; stage < STAGES.length; stage += 1) {
    stagePositions.push(buildStagePositions(stage));
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(stagePositions[0].slice(), 3).setUsage(THREE.DynamicDrawUsage));
  geometry.computeVertexNormals();

  primaryMaterial = new THREE.MeshPhysicalMaterial({
    color: paleAmber,
    emissive: new THREE.Color(0x6f2804),
    emissiveIntensity: 0.38,
    metalness: 0.04,
    roughness: 0.24,
    transmission: 0.08,
    thickness: 1.25,
    ior: 1.48,
    clearcoat: 1,
    clearcoatRoughness: 0.18,
    side: THREE.DoubleSide
  });

  const primaryMesh = new THREE.Mesh(geometry, primaryMaterial);
  primaryMesh.renderOrder = 1;
  objectRoot.add(primaryMesh);

  wireMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd996,
    wireframe: true,
    transparent: true,
    opacity: 0.04,
    depthWrite: false
  });
  wireMesh = new THREE.Mesh(geometry, wireMaterial);
  wireMesh.scale.setScalar(1.004);
  wireMesh.renderOrder = 2;
  objectRoot.add(wireMesh);

  particleField = createParticleField();
  scene.add(particleField);

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.42, 0.64, 0.86);
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  meshMetric.textContent = `${VERTEX_COUNT.toLocaleString('pt-BR')} VÉRTICES`;

  controls.addEventListener('start', () => {
    userOrbiting = true;
    interactionHint.classList.add('is-hidden');
  });
  controls.addEventListener('end', () => {
    userOrbiting = false;
  });

  const resizeObserver = new ResizeObserver(resizeRenderer);
  resizeObserver.observe(viewport);
}

function createRibbonGeometry() {
  const indices = [];

  for (let i = 0; i < SEGMENTS; i += 1) {
    for (let j = 0; j < WIDTH_SEGMENTS; j += 1) {
      const topA = i * ROW + j;
      const topB = (i + 1) * ROW + j;
      const topC = (i + 1) * ROW + j + 1;
      const topD = i * ROW + j + 1;
      const bottomA = topA + LAYER_STRIDE;
      const bottomB = topB + LAYER_STRIDE;
      const bottomC = topC + LAYER_STRIDE;
      const bottomD = topD + LAYER_STRIDE;

      indices.push(topA, topB, topD, topB, topC, topD);
      indices.push(bottomA, bottomD, bottomB, bottomB, bottomD, bottomC);
    }

    connectLongEdge(indices, i, 0);
    connectLongEdge(indices, i, WIDTH_SEGMENTS);
  }

  const ribbonGeometry = new THREE.BufferGeometry();
  ribbonGeometry.setIndex(indices);
  return ribbonGeometry;
}

function connectLongEdge(indices, segment, widthIndex) {
  const topA = segment * ROW + widthIndex;
  const topB = (segment + 1) * ROW + widthIndex;
  const bottomA = topA + LAYER_STRIDE;
  const bottomB = topB + LAYER_STRIDE;
  const flip = widthIndex === 0;

  if (flip) {
    indices.push(topA, bottomA, topB, topB, bottomA, bottomB);
  } else {
    indices.push(topA, topB, bottomA, topB, bottomB, bottomA);
  }
}

function buildStagePositions(stageIndex) {
  const output = new Float32Array(VERTEX_COUNT * 3);
  const closed = stageIndex >= 2;
  const epsilon = 1 / SEGMENTS;
  const zAxis = new THREE.Vector3(0, 0, 1);
  const tangent = new THREE.Vector3();
  const widthDirection = new THREE.Vector3();
  const thicknessDirection = new THREE.Vector3();

  for (let i = 0; i <= SEGMENTS; i += 1) {
    const u = i / SEGMENTS;
    const beforeU = closed ? wrap01(u - epsilon) : Math.max(0, u - epsilon);
    const afterU = closed ? wrap01(u + epsilon) : Math.min(1, u + epsilon);
    const center = sampleCenterline(stageIndex, u);
    const before = sampleCenterline(stageIndex, beforeU);
    const after = sampleCenterline(stageIndex, afterU);

    tangent.subVectors(after, before).normalize();
    widthDirection.crossVectors(zAxis, tangent).normalize();
    if (widthDirection.lengthSq() < 0.001) {
      widthDirection.set(0, 1, 0);
    }

    const twist = stageTwist(stageIndex, u);
    widthDirection.applyAxisAngle(tangent, twist).normalize();
    thicknessDirection.crossVectors(tangent, widthDirection).normalize();

    const width = stageWidth(stageIndex, u);
    const thickness = stageThickness(stageIndex, u);

    for (let j = 0; j <= WIDTH_SEGMENTS; j += 1) {
      const lateral = (j / WIDTH_SEGMENTS - 0.5) * width;
      for (let layer = 0; layer < 2; layer += 1) {
        const vertical = (layer === 0 ? 0.5 : -0.5) * thickness;
        const vertexIndex = layer * LAYER_STRIDE + i * ROW + j;
        const offset = vertexIndex * 3;

        output[offset] = center.x + widthDirection.x * lateral + thicknessDirection.x * vertical;
        output[offset + 1] = center.y + widthDirection.y * lateral + thicknessDirection.y * vertical;
        output[offset + 2] = center.z + widthDirection.z * lateral + thicknessDirection.z * vertical;
      }
    }
  }

  return output;
}

function sampleCenterline(stageIndex, u) {
  if (stageIndex === 0) {
    const x = THREE.MathUtils.lerp(-2.7, 2.05, u);
    const y = -0.58 + 1.08 * u + 0.44 * Math.sin(Math.PI * u);
    const z = 0.09 * Math.sin(TAU * 2.5 * u) * Math.sin(Math.PI * u);
    return new THREE.Vector3(x, y, z);
  }

  if (stageIndex === 1) {
    const envelope = 0.72 + 0.28 * Math.sin(Math.PI * u);
    const x = THREE.MathUtils.lerp(-2.85, 2.85, u);
    const y = Math.sin(TAU * 1.35 * u - 0.42) * 0.62 * envelope;
    const z = Math.sin(TAU * 2.7 * u) * 0.13;
    return new THREE.Vector3(x, y, z);
  }

  const angle = TAU * u;
  const curvePoint = symbolCurve.getPointAt(u === 1 ? 0 : u);
  const structureScale = stageIndex === 2 ? 0.94 : 1;
  let x = curvePoint.x * structureScale;
  let y = curvePoint.y * structureScale;
  let z = 0;

  if (stageIndex >= 4) {
    z = 0.18 * Math.sin(angle * 2 + 0.35);
  }

  if (stageIndex === 5) {
    const asymmetry = 0.08 * Math.sin(angle) + 0.045 * Math.sin(angle * 2);
    x += asymmetry + 0.04;
    y += 0.035 * Math.cos(angle * 2);
    z = 0.26 * Math.sin(angle * 2 + 0.28) + 0.055 * Math.cos(angle * 3);
  }

  return new THREE.Vector3(x, y, z);
}

function stageWidth(stageIndex, u) {
  if (stageIndex === 0) return 0.055 + 0.075 * Math.sin(Math.PI * u);
  if (stageIndex === 1) return 0.095;
  if (stageIndex === 2) return 0.075;
  if (stageIndex === 3) return 0.31;
  if (stageIndex === 4) return 0.66;

  const angle = TAU * u;
  return 0.7 * (1 + 0.18 * Math.cos(angle - 0.35) + 0.055 * Math.sin(angle * 2));
}

function stageThickness(stageIndex, u) {
  if (stageIndex <= 1) return 0.025;
  if (stageIndex === 2) return 0.034;
  if (stageIndex === 3) return 0.07;
  if (stageIndex === 4) return 0.12;
  return 0.17 * (0.92 + 0.08 * Math.cos(TAU * u));
}

function stageTwist(stageIndex, u) {
  if (stageIndex < 4) return 0;
  const baseTwist = TAU * u;
  return stageIndex === 5 ? baseTwist + 0.12 * Math.sin(TAU * u) : baseTwist;
}

function wrap01(value) {
  return (value + 1) % 1;
}

function createParticleField() {
  const count = compactViewport ? 90 : 160;
  const values = new Float32Array(count * 3);
  let seed = 7417;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < count; i += 1) {
    const radius = 2.7 + random() * 3.2;
    const angle = random() * TAU;
    values[i * 3] = Math.cos(angle) * radius;
    values[i * 3 + 1] = (random() - 0.5) * 5.4;
    values[i * 3 + 2] = (random() - 0.5) * 4.4;
  }

  const pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute('position', new THREE.BufferAttribute(values, 3));
  const pointsMaterial = new THREE.PointsMaterial({
    color: 0xf5bc61,
    size: compactViewport ? 0.025 : 0.032,
    transparent: true,
    opacity: 0.23,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  return new THREE.Points(pointsGeometry, pointsMaterial);
}

function initializeTimeline() {
  masterTimeline = gsap.timeline({
    paused: true,
    repeat: -1,
    yoyo: true,
    onUpdate: updateMorph,
    onComplete: () => setPlaying(false)
  });
  masterTimeline.to(motionState, { progress: 5, duration: BASE_DURATION, ease: 'none' }, 0);
  STAGES.forEach((_, index) => masterTimeline.addLabel(`stage-${index}`, index * STEP_TIME));
  masterTimeline.timeScale(Number(speedSelect.value));
}

function updateMorph(force = false) {
  const progress = THREE.MathUtils.clamp(motionState.progress, 0, 5);
  if (!force && Math.abs(progress - lastRenderedProgress) < 0.00001) return;
  lastRenderedProgress = progress;

  const fromIndex = Math.floor(progress);
  const toIndex = Math.min(5, fromIndex + 1);
  const rawBlend = progress - fromIndex;
  const blend = rawBlend * rawBlend * (3 - 2 * rawBlend);
  const from = stagePositions[fromIndex];
  const to = stagePositions[toIndex];
  const positions = geometry.attributes.position.array;

  for (let index = 0; index < positions.length; index += 1) {
    positions[index] = THREE.MathUtils.lerp(from[index], to[index], blend);
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();

  updateMaterial(progress);
  updateInterface(progress);
}

function updateMaterial(progress) {
  const life = THREE.MathUtils.smoothstep(progress, 2.7, 5);
  const structureFocus = Math.max(0, 1 - Math.abs(progress - 2));
  primaryMaterial.color.copy(paleAmber).lerp(livingAmber, life);
  primaryMaterial.emissiveIntensity = THREE.MathUtils.lerp(0.5, 0.12, life);
  primaryMaterial.roughness = THREE.MathUtils.lerp(0.34, 0.2, life);
  primaryMaterial.transmission = THREE.MathUtils.lerp(0.03, 0.24, life);
  primaryMaterial.thickness = THREE.MathUtils.lerp(0.32, 1.65, life);
  primaryMaterial.clearcoatRoughness = THREE.MathUtils.lerp(0.3, 0.1, life);

  wireMaterial.opacity = wireForced ? 0.36 : 0.025 + structureFocus * 0.78;
  wireMesh.visible = wireMaterial.opacity > 0.02;
  particleField.material.opacity = THREE.MathUtils.lerp(0.34, 0.1, life);
  bloomPass.strength = THREE.MathUtils.lerp(0.58, 0.34, life);
}

function updateInterface(progress) {
  const stageIndex = THREE.MathUtils.clamp(Math.round(progress), 0, 5);
  scrubber.value = String(progress);
  scrubberOutput.value = `${Math.round((progress / 5) * 100)}%`;
  scrubberOutput.textContent = scrubberOutput.value;

  if (stageIndex === currentUiStage) return;
  currentUiStage = stageIndex;
  const stage = STAGES[stageIndex];
  stageBadge.textContent = `ETAPA ${String(stageIndex + 1).padStart(2, '0')} / 06`;
  stageTitle.textContent = stage.short;
  stageHeading.textContent = stage.title;
  stageDescription.textContent = stage.description;

  stageButtons.forEach((button, index) => {
    const active = index === stageIndex;
    button.classList.toggle('is-active', active);
    if (active) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
}

function bindInteractions() {
  stageButtons.forEach((button) => {
    button.addEventListener('click', () => seekStage(Number(button.dataset.stage)));
  });

  scrubber.addEventListener('input', () => {
    stopManualTween();
    masterTimeline.pause();
    masterTimeline.time((Number(scrubber.value) / 5) * BASE_DURATION, false);
    setPlaying(false);
  });

  prevButton.addEventListener('click', () => {
    const target = Math.max(0, Math.round(motionState.progress) - 1);
    seekStage(target);
  });

  nextButton.addEventListener('click', () => {
    const target = Math.min(5, Math.round(motionState.progress) + 1);
    seekStage(target);
  });

  playButton.addEventListener('click', () => {
    stopManualTween();
    if (!masterTimeline.paused()) {
      masterTimeline.pause();
      setPlaying(false);
      return;
    }

    if (motionState.progress >= 4.999 && !loopActive) {
      masterTimeline.restart();
    } else {
      masterTimeline.play();
    }
    setPlaying(true);
  });

  speedSelect.addEventListener('change', () => {
    masterTimeline.timeScale(Number(speedSelect.value));
  });

  loopButton.addEventListener('click', () => {
    loopActive = !loopActive;
    masterTimeline.repeat(loopActive ? -1 : 0).yoyo(loopActive);
    loopButton.classList.toggle('is-active', loopActive);
    loopButton.setAttribute('aria-pressed', String(loopActive));
    loopButton.textContent = loopActive ? 'Loop ativo' : 'Loop desligado';
  });

  wireButton.addEventListener('click', () => {
    wireForced = !wireForced;
    wireButton.classList.toggle('is-active', wireForced);
    wireButton.setAttribute('aria-pressed', String(wireForced));
    wireButton.textContent = wireForced ? 'Ocultar malha' : 'Ver malha';
    updateMaterial(motionState.progress);
  });

  cameraReset.addEventListener('click', resetCamera);

  window.addEventListener('keydown', (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
    if (event.code === 'Space') {
      event.preventDefault();
      playButton.click();
    } else if (event.key === 'ArrowLeft') {
      prevButton.click();
    } else if (event.key === 'ArrowRight') {
      nextButton.click();
    }
  });

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    showFallback('O contexto WebGL foi interrompido. Recarregue a página para reiniciar.');
  });

  window.addEventListener('pagehide', disposeScene, { once: true });
}

function seekStage(stageIndex) {
  const safeIndex = THREE.MathUtils.clamp(stageIndex, 0, 5);
  stopManualTween();
  masterTimeline.pause();
  setPlaying(false);
  manualTween = masterTimeline.tweenTo(`stage-${safeIndex}`, {
    duration: prefersReducedMotion ? 0.01 : Math.max(0.38, Math.abs(motionState.progress - safeIndex) * 0.42),
    ease: 'power2.inOut',
    onComplete: () => {
      manualTween = null;
    }
  });
}

function stopManualTween() {
  if (!manualTween) return;
  manualTween.kill();
  manualTween = null;
}

function setPlaying(playing) {
  playButton.setAttribute('aria-pressed', String(playing));
  playIcon.textContent = playing ? 'Ⅱ' : '▶';
  playLabel.textContent = playing ? 'Pausar' : 'Reproduzir';
}

function resetCamera() {
  controls.enabled = false;
  const targetPosition = { x: 0, y: 0.12, z: compactViewport ? 9.2 : 8.2 };
  gsap.to(camera.position, {
    ...targetPosition,
    duration: prefersReducedMotion ? 0.01 : 0.8,
    ease: 'power2.inOut',
    onUpdate: () => controls.update(),
    onComplete: () => {
      controls.target.set(0, 0.08, 0);
      controls.enabled = true;
      controls.update();
    }
  });
  gsap.to(objectRoot.rotation, {
    x: -0.08,
    y: -0.06,
    z: -0.025,
    duration: prefersReducedMotion ? 0.01 : 0.8,
    ease: 'power2.inOut'
  });
}

function renderFrame(timestamp) {
  timer.update(timestamp);
  const delta = Math.min(timer.getDelta(), 0.05);
  const elapsed = timer.getElapsed();
  controls.update();

  if (!prefersReducedMotion && !userOrbiting) {
    objectRoot.rotation.y += delta * (masterTimeline && !masterTimeline.paused() ? 0.055 : 0.018);
    objectRoot.rotation.x = -0.08 + Math.sin(elapsed * 0.28) * 0.025;
    particleField.rotation.z += delta * 0.008;
    particleField.rotation.y -= delta * 0.012;
  }

  composer.render();
}

function resizeRenderer() {
  if (!renderer || !composer || !camera) return;
  const width = Math.max(1, viewport.clientWidth);
  const height = Math.max(1, viewport.clientHeight);
  renderer.setSize(width, height, false);
  composer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  bloomPass.resolution.set(width, height);
}

function showFallback(message) {
  if (loadingState) loadingState.classList.add('is-hidden');
  if (!fallback) return;
  const paragraph = fallback.querySelector('p');
  if (paragraph && message) paragraph.textContent = message;
  fallback.hidden = false;
}

function disposeScene() {
  if (renderer) renderer.setAnimationLoop(null);
  timer.dispose();
  if (geometry) geometry.dispose();
  if (primaryMaterial) primaryMaterial.dispose();
  if (wireMaterial) wireMaterial.dispose();
  if (particleField) {
    particleField.geometry.dispose();
    particleField.material.dispose();
  }
  if (composer) composer.dispose();
  if (renderer) renderer.dispose();
}
