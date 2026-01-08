import { defineStore } from 'pinia';

export const useInteractionStore = defineStore('interaction', {
  state: () => ({
    isDragging: false,
    isSelecting: false,
    currentTool: 'camera',
    currentTransformMode: 'translate',
    selectedObject: null,
    cameraPosition: { x: 0, y: 0, z: 5 },
    cameraTarget: { x: 0, y: 0, z: 0 },
    viewPresets: {
      front: { position: [0, 0, 5], target: [0, 0, 0] },
      side: { position: [5, 0, 0], target: [0, 0, 0] },
      top: { position: [0, 5, 0], target: [0, 0, 0] },
      back: { position: [0, 0, -5], target: [0, 0, 0] }
    },
    keyboardShortcuts: {
      camera: 'c',
      select: 's',
      translate: 't',
      rotate: 'r',
      scale: 'e',
      frontView: '1',
      sideView: '2',
      topView: '3',
      backView: '4',
      zoomIn: '+',
      zoomOut: '-',
      reset: 'space'
    },
    mouseSensitivity: {
      rotation: 1,
      zoom: 1,
      pan: 1
    },
    touchSensitivity: {
      rotation: 1,
      zoom: 1,
      pan: 1
    },
    loading: false,
    error: null
  }),

  getters: {
    isInteracting: (state) => state.isDragging || state.isSelecting,
    getCurrentTool: (state) => state.currentTool,
    getCurrentTransformMode: (state) => state.currentTransformMode,
    getSelectedObject: (state) => state.selectedObject,
    getCameraPosition: (state) => state.cameraPosition,
    getCameraTarget: (state) => state.cameraTarget,
    getViewPreset: (state) => (presetName) => {
      return state.viewPresets[presetName] || state.viewPresets.front;
    },
    getKeyboardShortcut: (state) => (action) => {
      return state.keyboardShortcuts[action] || '';
    }
  },

  actions: {
    setLoading(status) {
      this.loading = status;
    },

    setError(error) {
      this.error = error;
    },

    clearError() {
      this.error = null;
    },

    setDragging(status) {
      this.isDragging = status;
    },

    setSelecting(status) {
      this.isSelecting = status;
    },

    setCurrentTool(tool) {
      const validTools = ['camera', 'select', 'transform'];
      if (validTools.includes(tool)) {
        this.currentTool = tool;
      }
    },

    setTransformMode(mode) {
      const validModes = ['translate', 'rotate', 'scale'];
      if (validModes.includes(mode)) {
        this.currentTransformMode = mode;
      }
    },

    selectObject(object) {
      this.selectedObject = object;
    },

    deselectObject() {
      this.selectedObject = null;
    },

    updateCameraPosition(position) {
      this.cameraPosition = { ...this.cameraPosition, ...position };
    },

    updateCameraTarget(target) {
      this.cameraTarget = { ...this.cameraTarget, ...target };
    },

    setViewPreset(presetName) {
      if (this.viewPresets[presetName]) {
        const preset = this.viewPresets[presetName];
        this.cameraPosition = {
          x: preset.position[0],
          y: preset.position[1],
          z: preset.position[2]
        };
        this.cameraTarget = {
          x: preset.target[0],
          y: preset.target[1],
          z: preset.target[2]
        };
      }
    },

    updateMouseSensitivity(sensitivity) {
      this.mouseSensitivity = { ...this.mouseSensitivity, ...sensitivity };
    },

    updateTouchSensitivity(sensitivity) {
      this.touchSensitivity = { ...this.touchSensitivity, ...sensitivity };
    },

    updateKeyboardShortcut(action, key) {
      if (this.keyboardShortcuts[action]) {
        this.keyboardShortcuts[action] = key;
      }
    },

    resetToDefault() {
      this.isDragging = false;
      this.isSelecting = false;
      this.currentTool = 'camera';
      this.currentTransformMode = 'translate';
      this.selectedObject = null;
      this.cameraPosition = { x: 0, y: 0, z: 5 };
      this.cameraTarget = { x: 0, y: 0, z: 0 };
      this.mouseSensitivity = {
        rotation: 1,
        zoom: 1,
        pan: 1
      };
      this.touchSensitivity = {
        rotation: 1,
        zoom: 1,
        pan: 1
      };
    }
  }
});