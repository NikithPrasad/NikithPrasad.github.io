import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

const ACCENTS = ['#f5c451', '#38bdf8', '#e63946', '#f5c451', '#38bdf8', '#e63946']

function makeRuneTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const context = canvas.getContext('2d')
  context.strokeStyle = 'rgba(255,255,255,.9)'
  context.fillStyle = 'rgba(255,255,255,.9)'
  context.lineWidth = 4
  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.strokeRect(35, 35, 442, 442)
  context.strokeRect(48, 48, 416, 416)
  context.beginPath()
  context.moveTo(75, 98); context.lineTo(437, 98)
  context.moveTo(75, 415); context.lineTo(437, 415)
  context.stroke()

  const columns = [108, 207, 306, 405]
  const marks = [
    [[0, 24, 58, 24], [29, 24, 29, 74], [0, 74, 58, 74], [0, 127, 58, 127], [0, 127, 0, 179], [0, 179, 58, 179], [29, 232, 29, 284], [0, 258, 58, 258]],
    [[29, 24, 29, 75], [0, 74, 58, 74], [0, 127, 58, 127], [29, 127, 29, 179], [0, 179, 58, 179], [0, 232, 58, 232], [58, 232, 58, 284]],
    [[0, 24, 58, 24], [0, 24, 0, 75], [58, 74, 58, 127], [0, 127, 58, 127], [29, 127, 29, 179], [29, 232, 29, 284], [0, 258, 58, 258]],
    [[29, 24, 29, 74], [0, 74, 58, 74], [0, 127, 0, 179], [0, 179, 58, 179], [58, 232, 58, 284], [0, 258, 58, 258]],
  ]
  columns.forEach((x, index) => {
    marks[index].forEach(([x1, y1, x2, y2]) => {
      context.beginPath(); context.moveTo(x + x1, 122 + y1); context.lineTo(x + x2, 122 + y2); context.stroke()
    })
    context.beginPath(); context.arc(x + 29, 390, 7, 0, Math.PI * 2); context.fill()
    context.beginPath(); context.arc(x + 29, 311, 4, 0, Math.PI * 2); context.fill()
  })
  context.beginPath()
  context.moveTo(244, 61); context.lineTo(256, 48); context.lineTo(268, 61); context.lineTo(256, 74); context.closePath()
  context.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function makeEmbers() {
  const count = 270
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const gold = new THREE.Color('#f5c451')
  const cyan = new THREE.Color('#38bdf8')
  const crimson = new THREE.Color('#e63946')
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 13
    positions[i * 3 + 1] = (Math.random() - 0.5) * 7.5
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1.5
    const tint = Math.random() > 0.76 ? crimson : (Math.random() > 0.48 ? gold : cyan)
    colors[i * 3] = tint.r
    colors[i * 3 + 1] = tint.g
    colors[i * 3 + 2] = tint.b
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const material = new THREE.PointsMaterial({
    size: 0.025,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  })
  return new THREE.Points(geometry, material)
}

export default function PoneglyphScene({ activeIndex }) {
  const hostRef = useRef(null)
  const targetAccent = useRef(new THREE.Color(ACCENTS[0]))

  useEffect(() => {
    targetAccent.current.set(ACCENTS[activeIndex] || ACCENTS[0])
  }, [activeIndex])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
    } catch {
      host.dataset.webgl = 'unavailable'
      return undefined
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 80)
    camera.position.set(0, 0, 9.5)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.setSize(host.clientWidth, host.clientHeight, false)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.domElement.className = 'poneglyph-webgl'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    host.appendChild(renderer.domElement)

    scene.add(new THREE.HemisphereLight(0x95c6dc, 0x09070a, 0.58))
    const keyLight = new THREE.DirectionalLight(0xffe9bf, 1.15)
    keyLight.position.set(-3.5, 5, 7)
    scene.add(keyLight)
    const rimLight = new THREE.PointLight(0xf5c451, 4.2, 14, 2)
    rimLight.position.set(2.1, 1.7, 3.5)
    scene.add(rimLight)

    const cubeRoot = new THREE.Group()
    cubeRoot.position.set(3, 0.02, -0.15)
    cubeRoot.rotation.set(-0.16, 0.36, 0)
    scene.add(cubeRoot)

    const initial = new THREE.Color(ACCENTS[activeIndex] || ACCENTS[0])
    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: '#090a0d',
      roughness: 0.38,
      metalness: 0.72,
      emissive: initial.clone().multiplyScalar(0.055),
      emissiveIntensity: 0.52,
    })
    const stone = new THREE.Mesh(new RoundedBoxGeometry(2.5, 2.5, 2.5, 4, 0.13), stoneMaterial)
    cubeRoot.add(stone)

    const runeTexture = makeRuneTexture()
    const runeMaterial = new THREE.MeshBasicMaterial({
      map: runeTexture,
      color: initial,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    })
    const face = new THREE.PlaneGeometry(2.1, 2.1)
    const runeFaces = [
      [[0, 0, 1.256], [0, 0, 0]],
      [[0, 0, -1.256], [0, Math.PI, 0]],
      [[1.256, 0, 0], [0, Math.PI / 2, 0]],
      [[-1.256, 0, 0], [0, -Math.PI / 2, 0]],
      [[0, 1.256, 0], [-Math.PI / 2, 0, 0]],
      [[0, -1.256, 0], [Math.PI / 2, 0, 0]],
    ]
    runeFaces.forEach(([position, rotation]) => {
      const rune = new THREE.Mesh(face, runeMaterial)
      rune.position.set(...position)
      rune.rotation.set(...rotation)
      cubeRoot.add(rune)
    })

    const edgeGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.53, 2.53, 2.53))
    const edgeMaterial = new THREE.LineBasicMaterial({ color: initial, transparent: true, opacity: 0.88, toneMapped: false })
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial)
    cubeRoot.add(edges)
    const haloMaterial = new THREE.LineBasicMaterial({ color: initial, transparent: true, opacity: 0.16, toneMapped: false })
    const halo = new THREE.LineSegments(edgeGeometry, haloMaterial)
    halo.scale.setScalar(1.018)
    cubeRoot.add(halo)

    const embers = makeEmbers()
    scene.add(embers)
    const currentAccent = initial.clone()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const clock = new THREE.Clock()
    let frame = 0
    let width = 0
    let height = 0
    const resize = () => {
      width = Math.max(host.clientWidth, 1)
      height = Math.max(host.clientHeight, 1)
      camera.aspect = width / height
      camera.position.z = width < 700 ? 11 : 9.5
      cubeRoot.position.x = width < 700 ? 1.45 : 3
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(host)

    const render = () => {
      frame = requestAnimationFrame(render)
      const delta = Math.min(clock.getDelta(), 0.05)
      const elapsed = clock.elapsedTime
      const colorEase = 1 - Math.exp(-3.6 * delta)
      currentAccent.lerp(targetAccent.current, colorEase)
      stoneMaterial.emissive.copy(currentAccent).multiplyScalar(0.055)
      runeMaterial.color.copy(currentAccent)
      edgeMaterial.color.copy(currentAccent)
      haloMaterial.color.copy(currentAccent)
      rimLight.color.copy(currentAccent)
      rimLight.position.x = 2.1 + Math.sin(elapsed * 0.3) * 0.45

      if (!reducedMotion) {
        cubeRoot.rotation.y += delta * 0.105
        cubeRoot.rotation.x = -0.16 + Math.sin(elapsed * 0.24) * 0.07
        cubeRoot.rotation.z = Math.sin(elapsed * 0.17) * 0.035
        embers.rotation.y = elapsed * 0.012
        embers.rotation.x = Math.sin(elapsed * 0.08) * 0.025
        stone.scale.setScalar(1 + Math.sin(elapsed * 0.42) * 0.008)
      }
      renderer.render(scene, camera)
    }
    render()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      renderer.dispose()
      renderer.domElement.remove()
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((material) => material.dispose())
        }
      })
      runeTexture.dispose()
      face.dispose()
      edgeGeometry.dispose()
    }
  }, [])

  return <div className="poneglyph-scene" ref={hostRef} aria-hidden="true" />
}
