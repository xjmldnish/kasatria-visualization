import * as THREE from 'three'
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { getNetWorthBand } from '../utils/colorClassifier'
import { createDoubleHelixTargets, createGridTargets, createSphereTargets, createTableTargets } from './layouts'

function createTile(person, onSelect) {
  const element = document.createElement('article')
  element.className = `person-tile ${getNetWorthBand(person.netWorth)}`
  element.tabIndex = 0
  element.setAttribute('role', 'button')
  element.setAttribute('aria-label', `${person.name}, ${person.age}, ${person.country}, ${person.interest}, ${person.netWorth.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`)
  element.innerHTML = `<img src="${person.photo}" alt=""><div><strong>${person.name}</strong><span>${person.age} · ${person.country}</span><span>${person.interest}</span><b>${person.netWorth.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</b></div>`
  let pointerStart
  const selectPerson = (event) => {
    event.stopPropagation()
    onSelect(person)
  }
  element.addEventListener('pointerdown', (event) => {
    event.stopPropagation()
    pointerStart = [event.clientX, event.clientY]
  })
  element.addEventListener('pointerup', (event) => {
    event.stopPropagation()
    const distance = pointerStart ? Math.hypot(event.clientX - pointerStart[0], event.clientY - pointerStart[1]) : Infinity
    if (distance < 8) selectPerson(event)
  })
  element.addEventListener('click', selectPerson)
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') selectPerson(event)
  })
  return element
}

export function mountScene(container, people, layout, onSelect) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(42, 1, 1, 10000)
  camera.position.z = 2700
  const renderer = new CSS3DRenderer()
  renderer.domElement.className = 'three-stage'
  container.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enablePan = false
  controls.minDistance = 1000
  controls.maxDistance = 4500
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.25

  const targets = layout === 'sphere'
    ? createSphereTargets(people.length)
    : layout === 'helix'
      ? createDoubleHelixTargets(people.length)
      : layout === 'grid'
        ? createGridTargets(people.length)
      : createTableTargets(people.length)
  const objects = people.map((person) => {
    const object = new CSS3DObject(createTile(person, onSelect))
    object.position.set((Math.random() - 0.5) * 3000, (Math.random() - 0.5) * 2500, (Math.random() - 0.5) * 2000)
    scene.add(object)
    return object
  })

  let frameId
  let startedAt = performance.now()
  let disposed = false
  const resize = () => {
    const { width, height } = container.getBoundingClientRect()
    camera.aspect = width / Math.max(height, 1)
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }
  const observer = new ResizeObserver(resize)
  observer.observe(container)
  resize()

  const render = (time) => {
    if (disposed) return
    const progress = Math.min((time - startedAt) / 1700, 1)
    const ease = 1 - (1 - progress) ** 3
    objects.forEach((object, index) => {
      object.position.lerp(targets[index].position, 0.04 + ease * 0.08)
      object.quaternion.slerp(targets[index].quaternion, 0.06 + ease * 0.08)
    })
    controls.autoRotate = progress >= 1
    controls.update()
    renderer.render(scene, camera)
    frameId = requestAnimationFrame(render)
  }
  frameId = requestAnimationFrame(render)

  return () => {
    disposed = true
    cancelAnimationFrame(frameId)
    observer.disconnect()
    controls.dispose()
    renderer.domElement.remove()
  }
}
