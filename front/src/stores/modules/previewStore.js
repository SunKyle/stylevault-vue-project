import { defineStore } from 'pinia';

export const usePreviewStore = defineStore('preview', {
  state: () => ({
    isPreviewing: false,
    currentView: 'front',
    qualityLevel: 'medium',
    performance: {
      fps: 0,
      renderTime: 0,
      drawCalls: 0,
    },
    previewSettings: {
      lighting: 'studio',
      background: 'white',
      shadows: true,
      postprocessing: true,
    },
    views: {
      front: {
        position: [0, 0, 5],
        target: [0, 0, 0],
        up: [0, 1, 0],
      },
      side: {
        position: [5, 0, 0],
        target: [0, 0, 0],
        up: [0, 1, 0],
      },
      top: {
        position: [0, 5, 0],
        target: [0, 0, 0],
        up: [0, 0, 1],
      },
      back: {
        position: [0, 0, -5],
        target: [0, 0, 0],
        up: [0, 1, 0],
      },
      threeQuarter: {
        position: [3, 1, 3],
        target: [0, 0, 0],
        up: [0, 1, 0],
      },
    },
    loading: false,
    error: null,
  }),

  getters: {
    isActive: state => state.isPreviewing,
    getCurrentView: state => state.currentView,
    getViewConfig: state => viewName => {
      return state.views[viewName] || state.views.front;
    },
    getViews: state => state.views,
    getPreviewSettings: state => state.previewSettings,
    getPerformance: state => state.performance,
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

    startPreview() {
      this.isPreviewing = true;
    },

    stopPreview() {
      this.isPreviewing = false;
    },

    setCurrentView(viewName) {
      if (this.views[viewName]) {
        this.currentView = viewName;
      }
    },

    setQualityLevel(level) {
      const validLevels = ['low', 'medium', 'high'];
      if (validLevels.includes(level)) {
        this.qualityLevel = level;
      }
    },

    updatePreviewSettings(settings) {
      this.previewSettings = { ...this.previewSettings, ...settings };
    },

    updatePerformance(performance) {
      this.performance = { ...this.performance, ...performance };
    },

    setPerformance(performance) {
      this.performance = { ...this.performance, ...performance };
    },

    addCustomView(name, config) {
      this.views[name] = {
        position: config.position || [0, 0, 5],
        target: config.target || [0, 0, 0],
        up: config.up || [0, 1, 0],
      };
    },

    removeCustomView(name) {
      if (this.views[name] && !['front', 'side', 'top', 'back', 'threeQuarter'].includes(name)) {
        delete this.views[name];
      }
    },

    resetToDefault() {
      this.isPreviewing = false;
      this.currentView = 'front';
      this.qualityLevel = 'medium';
      this.previewSettings = {
        lighting: 'studio',
        background: 'white',
        shadows: true,
        postprocessing: true,
      };
      this.performance = {
        fps: 0,
        renderTime: 0,
        drawCalls: 0,
      };
    },

    setLighting(lighting) {
      this.previewSettings.lighting = lighting;
    },

    setBackground(background) {
      this.previewSettings.background = background;
    },

    setShadows(shadows) {
      this.previewSettings.shadows = shadows;
    },

    setPostProcessing(postProcessing) {
      this.previewSettings.postprocessing = postProcessing;
    },

    setIsPreviewing(status) {
      this.isPreviewing = status;
    },
  },
});
