import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useInteractionStore } from '../../stores/modules/interactionStore';
import { useThreeStore } from '../../stores/modules/threeStore';

class InteractionSystem {
  constructor() {
    this.interactionStore = useInteractionStore();
    this.threeStore = useThreeStore();
    this.engine = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.touchStart = new THREE.Vector2();
    this.touchEnd = new THREE.Vector2();
    this.selectedObject = null;
    this.isDragging = false;
    this.isSelecting = false;
    this.currentTool = 'camera';
    this.currentTransformMode = 'translate';
    this.keyboardState = {};
    this.gestureState = {
      isPinching: false,
      previousDistance: 0
    };
  }

  initialize(engine) {
    this.engine = engine;
    this.setupEventListeners();
    this.setupControls();
  }

  setupControls() {
    if (!this.engine) return;

    const camera = this.engine.camera;
    const renderer = this.engine.renderer;

    this.engine.controls = new OrbitControls(camera, renderer.domElement);
    this.engine.controls.enableDamping = true;
    this.engine.controls.dampingFactor = 0.05;
    this.engine.controls.screenSpacePanning = false;
    this.engine.controls.minDistance = 1;
    this.engine.controls.maxDistance = 10;
    this.engine.controls.minPolarAngle = 0;
    this.engine.controls.maxPolarAngle = Math.PI;

    this.threeStore.setControls(this.engine.controls);
  }

  setupEventListeners() {
    if (!this.engine || !this.engine.renderer) return;

    const element = this.engine.renderer.domElement;

    // 鼠标事件
    element.addEventListener('mousedown', this.handleMouseDown.bind(this));
    element.addEventListener('mousemove', this.handleMouseMove.bind(this));
    element.addEventListener('mouseup', this.handleMouseUp.bind(this));
    element.addEventListener('mousewheel', this.handleMouseWheel.bind(this));

    // 触摸事件
    element.addEventListener('touchstart', this.handleTouchStart.bind(this));
    element.addEventListener('touchmove', this.handleTouchMove.bind(this));
    element.addEventListener('touchend', this.handleTouchEnd.bind(this));

    // 键盘事件
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));

    // 窗口大小变化
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleMouseDown(event) {
    event.preventDefault();

    this.updateMousePosition(event.clientX, event.clientY);

    switch (this.currentTool) {
      case 'select':
        this.selectObject();
        break;
      case 'camera':
        this.isDragging = true;
        break;
    }

    this.interactionStore.setIsDragging(this.isDragging);
  }

  handleMouseMove(event) {
    event.preventDefault();

    this.updateMousePosition(event.clientX, event.clientY);

    if (this.isDragging) {
      // 相机控制由OrbitControls处理
    }

    if (this.selectedObject && this.currentTool === 'select') {
      // 可以在这里实现对象拖拽
    }
  }

  handleMouseUp(event) {
    event.preventDefault();

    this.isDragging = false;
    this.interactionStore.setIsDragging(false);
  }

  handleMouseWheel(event) {
    event.preventDefault();

    // 缩放由OrbitControls处理
  }

  handleTouchStart(event) {
    event.preventDefault();

    if (event.touches.length === 1) {
      this.touchStart.set(
        (event.touches[0].clientX / window.innerWidth) * 2 - 1,
        -(event.touches[0].clientY / window.innerHeight) * 2 + 1
      );
    } else if (event.touches.length === 2) {
      this.gestureState.isPinching = true;
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      this.gestureState.previousDistance = Math.sqrt(dx * dx + dy * dy);
    }
  }

  handleTouchMove(event) {
    event.preventDefault();

    if (event.touches.length === 1) {
      this.touchEnd.set(
        (event.touches[0].clientX / window.innerWidth) * 2 - 1,
        -(event.touches[0].clientY / window.innerHeight) * 2 + 1
      );

      // 计算移动距离
      const deltaX = this.touchEnd.x - this.touchStart.x;
      const deltaY = this.touchEnd.y - this.touchStart.y;

      // 可以在这里实现触摸拖拽
      this.touchStart.copy(this.touchEnd);
    } else if (event.touches.length === 2) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 实现双指缩放
      if (this.gestureState.isPinching) {
        const delta = distance - this.gestureState.previousDistance;
        this.zoom(delta * 0.01);
        this.gestureState.previousDistance = distance;
      }
    }
  }

  handleTouchEnd(event) {
    event.preventDefault();

    this.gestureState.isPinching = false;
  }

  handleKeyDown(event) {
    this.keyboardState[event.key.toLowerCase()] = true;

    // 处理键盘快捷键
    this.handleKeyboardShortcuts(event.key.toLowerCase());
  }

  handleKeyUp(event) {
    this.keyboardState[event.key.toLowerCase()] = false;
  }

  handleResize() {
    if (!this.engine || !this.engine.renderer || !this.engine.camera) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.engine.camera.aspect = width / height;
    this.engine.camera.updateProjectionMatrix();
    this.engine.renderer.setSize(width, height);
  }

  handleKeyboardShortcuts(key) {
    const shortcuts = this.interactionStore.getKeyboardShortcuts();

    switch (key) {
      case shortcuts.camera:
        this.setTool('camera');
        break;
      case shortcuts.select:
        this.setTool('select');
        break;
      case shortcuts.translate:
        this.setTransformMode('translate');
        break;
      case shortcuts.rotate:
        this.setTransformMode('rotate');
        break;
      case shortcuts.scale:
        this.setTransformMode('scale');
        break;
      case shortcuts.frontView:
        this.setViewPreset('front');
        break;
      case shortcuts.sideView:
        this.setViewPreset('side');
        break;
      case shortcuts.topView:
        this.setViewPreset('top');
        break;
      case shortcuts.backView:
        this.setViewPreset('back');
        break;
      case shortcuts.zoomIn:
        this.zoom(0.1);
        break;
      case shortcuts.zoomOut:
        this.zoom(-0.1);
        break;
      case shortcuts.reset:
        this.resetView();
        break;
    }
  }

  updateMousePosition(clientX, clientY) {
    this.mouse.set(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1
    );
  }

  selectObject() {
    if (!this.engine || !this.engine.camera || !this.engine.scene) return;

    this.raycaster.setFromCamera(this.mouse, this.engine.camera);
    const intersects = this.raycaster.intersectObjects(this.engine.scene.children, true);

    if (intersects.length > 0) {
      const selected = intersects[0].object;
      this.selectedObject = selected;
      this.interactionStore.setSelectedObject(selected);
      return selected;
    } else {
      this.selectedObject = null;
      this.interactionStore.setSelectedObject(null);
      return null;
    }
  }

  setTool(tool) {
    this.currentTool = tool;
    this.interactionStore.setCurrentTool(tool);
  }

  setTransformMode(mode) {
    this.currentTransformMode = mode;
    this.interactionStore.setCurrentTransformMode(mode);
  }

  setViewPreset(presetName) {
    const presets = this.interactionStore.getViewPresets();
    const preset = presets[presetName];

    if (!preset || !this.engine || !this.engine.camera) return;

    const camera = this.engine.camera;
    const controls = this.engine.controls;

    camera.position.set(...preset.position);
    camera.lookAt(...preset.target);

    if (controls) {
      controls.target.set(...preset.target);
      controls.update();
    }
  }

  zoom(delta) {
    if (!this.engine || !this.engine.camera) return;

    const camera = this.engine.camera;
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    camera.position.addScaledVector(direction, -delta);
  }

  resetView() {
    this.setViewPreset('front');
  }

  translateObject(object, delta) {
    if (!object) return;
    object.position.add(delta);
  }

  rotateObject(object, delta) {
    if (!object) return;
    object.rotation.add(delta);
  }

  scaleObject(object, factor) {
    if (!object) return;
    object.scale.multiplyScalar(factor);
  }

  getSelectedObject() {
    return this.selectedObject;
  }

  clearSelection() {
    this.selectedObject = null;
    this.interactionStore.setSelectedObject(null);
  }

  update() {
    if (this.engine && this.engine.controls) {
      this.engine.controls.update();
    }

    // 处理持续的键盘输入
    this.handleContinuousKeyboardInput();
  }

  handleContinuousKeyboardInput() {
    // 可以在这里实现持续的键盘输入处理
    // 例如：按住方向键移动相机
  }

  setCameraPosition(position) {
    if (!this.engine || !this.engine.camera) return;

    this.engine.camera.position.set(position.x, position.y, position.z);
    this.interactionStore.setCameraPosition(position);
  }

  setCameraTarget(target) {
    if (!this.engine || !this.engine.camera || !this.engine.controls) return;

    this.engine.camera.lookAt(target.x, target.y, target.z);
    if (this.engine.controls) {
      this.engine.controls.target.set(target.x, target.y, target.z);
      this.engine.controls.update();
    }
    this.interactionStore.setCameraTarget(target);
  }

  enableControls(enabled) {
    if (!this.engine || !this.engine.controls) return;

    this.engine.controls.enabled = enabled;
  }

  setControlDamping(enabled, factor = 0.05) {
    if (!this.engine || !this.engine.controls) return;

    this.engine.controls.enableDamping = enabled;
    this.engine.controls.dampingFactor = factor;
  }

  setControlLimits(minDistance, maxDistance, minPolarAngle, maxPolarAngle) {
    if (!this.engine || !this.engine.controls) return;

    this.engine.controls.minDistance = minDistance;
    this.engine.controls.maxDistance = maxDistance;
    this.engine.controls.minPolarAngle = minPolarAngle;
    this.engine.controls.maxPolarAngle = maxPolarAngle;
  }

  dispose() {
    // 移除事件监听器
    if (this.engine && this.engine.renderer) {
      const element = this.engine.renderer.domElement;
      element.removeEventListener('mousedown', this.handleMouseDown.bind(this));
      element.removeEventListener('mousemove', this.handleMouseMove.bind(this));
      element.removeEventListener('mouseup', this.handleMouseUp.bind(this));
      element.removeEventListener('mousewheel', this.handleMouseWheel.bind(this));
      element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
      element.removeEventListener('touchmove', this.handleTouchMove.bind(this));
      element.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
    window.removeEventListener('resize', this.handleResize.bind(this));

    // 释放控件
    if (this.engine && this.engine.controls) {
      this.engine.controls.dispose();
    }
  }
}

export default InteractionSystem;