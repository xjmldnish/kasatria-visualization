import * as THREE from 'three'

export function createTableTargets(count) {
  return Array.from({ length: count }, (_, index) => {
    const column = index % 20
    const row = Math.floor(index / 20)
    const target = new THREE.Object3D()
    target.position.set((column - 9.5) * 155, (4.5 - row) * 185, 0)
    return target
  })
}

export function createSphereTargets(count) {
  return Array.from({ length: count }, (_, index) => {
    const target = new THREE.Object3D()
    const phi = Math.acos(-1 + (2 * index) / count)
    const theta = Math.sqrt(count * Math.PI) * phi
    target.position.setFromSphericalCoords(830, phi, theta)
    target.lookAt(target.position.clone().multiplyScalar(2))
    return target
  })
}

export function createDoubleHelixTargets(count) {
  const radius = 620
  const rise = 26
  const turns = 5
  return Array.from({ length: count }, (_, index) => {
    const strand = index % 2
    const step = Math.floor(index / 2)
    const angle = (step / (count / 2)) * Math.PI * 2 * turns + strand * Math.PI
    const target = new THREE.Object3D()
    target.position.set(Math.cos(angle) * radius, ((count / 2 - 1) / 2 - step) * rise, Math.sin(angle) * radius)
    target.lookAt(new THREE.Vector3(target.position.x * 2, target.position.y, target.position.z * 2))
    return target
  })
}

export function createGridTargets(count) {
  return Array.from({ length: count }, (_, index) => {
    const x = index % 5
    const y = Math.floor(index / 5) % 4
    const z = Math.floor(index / 20)
    const target = new THREE.Object3D()
    target.position.set((x - 2) * 270, (1.5 - y) * 240, (z - 4.5) * 260)
    return target
  })
}
