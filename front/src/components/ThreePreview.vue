<template>
  <div class="three-preview-container" ref="containerRef">
    <!-- 模型展示控制区域 -->
    <div class="preview-canvas" ref="canvasRef"></div>

    <div class="preview-controls" :class="{ collapsed: isCollapsed }">
      <!-- 可折叠面板标题 -->
      <div class="panel-header" @click="toggleCollapse">
        <h2 class="panel-title">{{ isCollapsed ? '设置' : '视图与参数设置' }}</h2>
        <button class="collapse-btn" :class="{ collapsed: isCollapsed }">
          {{ isCollapsed ? '›' : '‹' }}
        </button>
      </div>

      <div v-if="!isCollapsed" class="panel-content">
        <!-- 第一组：视图控制 -->
        <div class="control-section">
          <h3 class="section-title">视图控制</h3>
          <div class="control-group">
            <label>视图预设：</label>
            <button
              v-for="(view, name) in viewPresets"
              :key="name"
              @click="setViewPreset(name)"
              :class="{ active: currentView === name }"
            >
              {{ name }}
            </button>
          </div>
        </div>

        <!-- 第二组：渲染参数 -->
        <div class="control-section">
          <h3 class="section-title">渲染参数</h3>
          <div class="control-group">
            <label>质量等级：</label>
            <select v-model="qualityLevel" @change="setQuality(qualityLevel)">
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>

          <div class="control-group">
            <label>光照：</label>
            <select v-model="lighting" @change="setLighting(lighting)">
              <option value="studio">工作室</option>
              <option value="natural">自然光</option>
              <option value="dramatic">戏剧光</option>
            </select>
          </div>

          <div class="control-group">
            <label>背景：</label>
            <select v-model="background" @change="setBackground(background)">
              <option value="white">白色</option>
              <option value="black">黑色</option>
              <option value="gradient">渐变</option>
              <option value="environment">环境</option>
            </select>
          </div>

          <div class="control-group">
            <label>效果：</label>
            <label class="checkbox">
              <input type="checkbox" v-model="shadows" @change="toggleShadows(shadows)" />
              阴影
            </label>
            <label class="checkbox">
              <input
                type="checkbox"
                v-model="postProcessing"
                @change="togglePostProcessing(postProcessing)"
              />
              后处理
            </label>
          </div>
        </div>

        <!-- 第三组：操作工具 -->
        <div class="control-section">
          <h3 class="section-title">操作工具</h3>
          <div class="control-group">
            <label>变换模式：</label>
            <button
              v-for="mode in transformModes"
              :key="mode"
              @click="setTransformMode(mode)"
              :class="{ active: currentTransformMode === mode }"
            >
              {{ mode }}
            </button>
          </div>
          <div class="control-group">
            <label>工具：</label>
            <button
              v-for="tool in tools"
              :key="tool"
              @click="setTool(tool)"
              :class="{ active: currentTool === tool }"
            >
              {{ tool }}
            </button>
          </div>
          <div class="performance-stats">
            <div data-value="{{ performance.fps }}">FPS:</div>
            <div data-value="{{ Math.round(performance.renderTime) }}ms">渲染时间:</div>
            <div data-value="{{ performance.drawCalls }}">绘制调用:</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import * as THREE from 'three';
  import ThreeEngine from '../core/three/ThreeEngine';
  import FitSystem from '../core/fit/FitSystem';
  import PreviewSystem from '../core/preview/PreviewSystem';
  import InteractionSystem from '../core/interaction/InteractionSystem';
  import { usePreviewStore } from '../stores/modules/previewStore';
  import { useInteractionStore } from '../stores/modules/interactionStore';
  import { useOutfitStore } from '../stores/modules/outfitStore';

  export default {
    name: 'ThreePreview',
    props: {
      bodyModelPath: {
        type: String,
        default: '',
      },
      outfitId: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      const containerRef = ref(null);
      const canvasRef = ref(null);
      const previewStore = usePreviewStore();
      const interactionStore = useInteractionStore();
      const outfitStore = useOutfitStore();

      // 可折叠面板状态
      const isCollapsed = ref(false);
      const toggleCollapse = () => {
        isCollapsed.value = !isCollapsed.value;
      };

      let engine = null;
      let fitSystem = null;
      let previewSystem = null;
      let interactionSystem = null;
      let animationId = null;
      let bodyModel = null;
      let clothingObjects = new Map();

      const viewPresets = computed(() => previewStore.getViews);
      const currentView = computed(() => previewStore.currentView);
      const qualityLevel = computed({
        get: () => previewStore.qualityLevel,
        set: value => previewStore.setQualityLevel(value),
      });
      const lighting = computed({
        get: () => previewStore.previewSettings.lighting,
        set: value => previewStore.setLighting(value),
      });
      const background = computed({
        get: () => previewStore.previewSettings.background,
        set: value => previewStore.setBackground(value),
      });
      const shadows = computed({
        get: () => previewStore.previewSettings.shadows,
        set: value => previewStore.setShadows(value),
      });
      const postProcessing = computed({
        get: () => previewStore.previewSettings.postprocessing,
        set: value => previewStore.setPostProcessing(value),
      });
      const currentTool = computed(() => interactionStore.currentTool);
      const currentTransformMode = computed(() => interactionStore.currentTransformMode);
      const performance = computed(() => previewStore.performance);

      const tools = ['camera', 'select'];
      const transformModes = ['translate', 'rotate', 'scale'];

      const initThreeEngine = async () => {
        if (!canvasRef.value) return;

        // 强制获取容器真实尺寸（核心修复）
        const getContainerSize = () => {
          // 方法1：使用getBoundingClientRect获取更准确的尺寸
          const rect = canvasRef.value.getBoundingClientRect();
          let width = Math.max(rect.width, canvasRef.value.clientWidth);
          let height = Math.max(rect.height, canvasRef.value.clientHeight);

          // 方法2：如果尺寸仍为0，使用默认值或父容器尺寸
          if (width <= 0 || height <= 0) {
            // 尝试从父容器获取尺寸
            const parent = canvasRef.value.parentElement;
            if (parent) {
              const parentRect = parent.getBoundingClientRect();
              width = Math.max(parentRect.width, 800); // 默认最小宽度800
              height = Math.max(parentRect.height, 600); // 默认最小高度600
            } else {
              // 使用固定默认值
              width = 800;
              height = 600;
            }
          }

          return { width, height };
        };

        // 获取有效尺寸
        const { width, height } = getContainerSize();

        // 手动设置容器最小尺寸（确保布局稳定）
        canvasRef.value.style.minWidth = `${width}px`;
        canvasRef.value.style.minHeight = `${height}px`;

        // 立即执行引擎初始化
        engine = new ThreeEngine();
        await engine.initialize(canvasRef.value, {
          background: 0xffffff,
          antialias: true,
          shadows: true,
        });

        fitSystem = new FitSystem();
        previewSystem = new PreviewSystem();
        interactionSystem = new InteractionSystem();

        previewSystem.initialize(engine);
        interactionSystem.initialize(engine);

        await loadBodyModel();
        await loadOutfit();

        // ThreeEngine 已经在 initialize 方法中启动了渲染循环
        // 不需要再启动一个额外的动画循环
      };

      const loadBodyModel = async () => {
        if (!engine || !props.bodyModelPath) return;

        try {
          bodyModel = await engine.loadModel(props.bodyModelPath, { scene: true });
          if (bodyModel) {
            fitSystem.initialize(engine, bodyModel);

            // 确保相机能看到模型
            if (engine.camera && engine.scene) {
              // 计算模型的边界框
              const boundingBox = new THREE.Box3().setFromObject(bodyModel);
              const center = boundingBox.getCenter(new THREE.Vector3());
              const size = boundingBox.getSize(new THREE.Vector3());

              // 调整相机位置，确保能看到整个模型
              const distance = size.length() * 1.5;
              engine.camera.position.set(center.x, center.y, center.z + distance);
              engine.camera.lookAt(center);

              // 更新相机投影矩阵
              engine.camera.updateProjectionMatrix();

              // 强制触发一次渲染
              if (engine.renderer) {
                engine.renderer.render(engine.scene, engine.camera);
              }
            }
          }
        } catch (error) {
          console.error('Failed to load body model:', error);
        }
      };

      const loadOutfit = async () => {
        if (!engine || !props.outfitId || !bodyModel) return;

        const outfit = outfitStore.getOutfitById(props.outfitId);
        if (!outfit) return;

        // 清除现有的服装对象
        clothingObjects.forEach(object => {
          if (object) {
            engine.scene.remove(object);
          }
        });
        clothingObjects.clear();

        // 加载服装元素
        for (const clothingItem of outfit.items) {
          if (clothingItem && clothingItem.threeDProperties?.modelPath) {
            try {
              const clothingObject = await engine.loadModel(
                clothingItem.threeDProperties.modelPath
              );
              if (clothingObject) {
                engine.scene.add(clothingObject);
                clothingObjects.set(clothingItem.id, clothingObject);

                // 应用拟合
                fitSystem.fitClothing(clothingObject, clothingItem);
              }
            } catch (error) {
              console.error(`Failed to load clothing item ${clothingItem.id}:`, error);
            }
          }
        }
      };

      const handleResize = () => {
        if (!engine || !engine.renderer || !engine.camera) return;

        // 使用与 ThreeEngine 相同的尺寸获取逻辑
        const getValidSize = container => {
          const rect = container.getBoundingClientRect();
          let width = Math.max(rect.width, container.clientWidth);
          let height = Math.max(rect.height, container.clientHeight);

          if (width <= 0 || height <= 0) {
            const parent = container.parentElement;
            if (parent) {
              const parentRect = parent.getBoundingClientRect();
              width = Math.max(parentRect.width, 800);
              height = Math.max(parentRect.height, 600);
            } else {
              width = 800;
              height = 600;
            }
          }

          return { width, height };
        };

        const { width, height } = getValidSize(canvasRef.value);

        engine.renderer.setSize(width, height);
        engine.camera.aspect = width / height;
        engine.camera.updateProjectionMatrix();
      };

      const setViewPreset = name => {
        previewStore.setView(name);
      };

      const setQuality = level => {
        previewStore.setQualityLevel(level);
      };

      const setLighting = type => {
        previewStore.setLighting(type);
      };

      const setBackground = type => {
        previewStore.setBackground(type);
      };

      const setTool = tool => {
        interactionStore.setTool(tool);
      };

      const setTransformMode = mode => {
        interactionStore.setTransformMode(mode);
      };

      const toggleShadows = enabled => {
        previewStore.setShadows(enabled);
      };

      const togglePostProcessing = enabled => {
        previewStore.setPostProcessing(enabled);
      };

      const selectClothing = clothingId => {
        // 选择衣物的逻辑
        console.log('Selecting clothing:', clothingId);
        // 这里可以添加选中衣物的视觉反馈
        // 例如高亮显示选中的衣物，或在 3D 视图中聚焦该衣物
      };

      onMounted(() => {
        initThreeEngine();
        window.addEventListener('resize', handleResize);
      });

      onUnmounted(() => {
        window.removeEventListener('resize', handleResize);

        if (animationId) {
          cancelAnimationFrame(animationId);
        }

        if (previewSystem) {
          previewSystem.dispose();
        }

        if (interactionSystem) {
          interactionSystem.dispose();
        }

        if (engine) {
          engine.dispose();
        }
      });

      return {
        containerRef,
        canvasRef,
        viewPresets,
        currentView,
        qualityLevel,
        lighting,
        background,
        shadows,
        postProcessing,
        currentTool,
        currentTransformMode,
        performance,
        tools,
        transformModes,
        clothingObjects,
        setViewPreset,
        setQuality,
        setLighting,
        setBackground,
        setTool,
        setTransformMode,
        toggleShadows,
        togglePostProcessing,
        selectClothing,
        isCollapsed,
        toggleCollapse,
      };
    },
  };
</script>

<style scoped>
  .three-preview-container {
    width: 100%;
    height: 100%;
    position: relative;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  }

  /* 模型展示控制区域 */
  .model-display-control {
    flex: 1;
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f1f5f9;
    border-radius: 12px;
    margin: 10px;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .preview-controls {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgba(255, 255, 255, 0.98);
    padding: 0;
    border-radius: 12px;
    box-shadow:
      0 10px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    z-index: 40;
    max-width: 360px;
    min-width: 280px;
    backdrop-filter: blur(10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    overflow: hidden;
  }

  /* 可折叠面板标题 */
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    cursor: pointer;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.98) 0%,
      rgba(248, 250, 252, 0.98) 100%
    );
    border-bottom: 1px solid #f1f5f9;
  }

  .panel-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
  }

  .collapse-btn {
    background: none;
    border: none;
    font-size: 18px;
    font-weight: bold;
    color: #64748b;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .collapse-btn:hover {
    background: #f1f5f9;
    color: #334155;
  }

  /* 面板内容 */
  .panel-content {
    padding: 16px 20px;
    max-height: calc(100vh - 240px);
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;
  }

  /* 分组样式 */
  .control-section {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e2e8f0;
  }

  .control-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .section-title {
    margin-top: 0;
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* 折叠状态 */
  .preview-controls.collapsed {
    min-width: auto;
    max-width: auto;
    width: 60px;
  }

  .preview-controls.collapsed .panel-header {
    padding: 12px;
    justify-content: center;
  }

  .preview-controls.collapsed .panel-title {
    font-size: 12px;
    text-align: center;
  }

  .preview-controls.collapsed .collapse-btn {
    display: none;
  }

  .preview-controls.collapsed .panel-content {
    display: none;
  }

  .preview-controls::-webkit-scrollbar {
    width: 6px;
  }

  .preview-controls::-webkit-scrollbar-track {
    background: transparent;
  }

  .preview-controls::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 3px;
    border: 2px solid rgba(255, 255, 255, 0.98);
  }

  .preview-controls:hover {
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    transform: translateY(-4px);
  }

  .control-group {
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f1f5f9;
    transition: all 0.3s ease;
  }

  .control-group:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .control-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 12px;
    color: #334155;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    padding-left: 20px;
  }

  .control-group label::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 16px;
    background: linear-gradient(180deg, #4f46e5 0%, #8b5cf6 100%);
    border-radius: 2px;
  }

  .control-group button {
    margin-right: 6px;
    margin-bottom: 6px;
    padding: 5px 10px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: #ffffff;
    cursor: pointer;
    font-size: 11px;
    font-weight: 500;
    color: #334155;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;
  }

  .control-group button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.1), transparent);
    transition: left 0.5s ease;
  }

  .control-group button:hover::before {
    left: 100%;
  }

  .control-group button:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .control-group button.active {
    background: linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%);
    color: white;
    border-color: #4f46e5;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  }

  .control-group select {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 13px;
    background: #ffffff;
    color: #334155;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
  }

  .control-group select:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }

  .control-group select:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234f46e5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  }

  .checkbox {
    display: flex;
    align-items: center;
    margin-right: 16px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    position: relative;
    overflow: hidden;
  }

  .checkbox:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .checkbox input {
    margin-right: 8px;
    accent-color: #4f46e5;
    transform: scale(1.1);
    cursor: pointer;
  }

  .checkbox input:checked {
    animation: checkPulse 0.3s ease;
  }

  @keyframes checkPulse {
    0% {
      transform: scale(1.1);
    }
    50% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(1.1);
    }
  }

  .performance-stats {
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%);
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 10px;
    font-family: monospace;
    margin-top: 12px;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .performance-stats:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .performance-stats div {
    margin-bottom: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 0;
  }

  .performance-stats div:last-child {
    margin-bottom: 0;
  }

  .performance-stats div::after {
    content: attr(data-value);
    font-weight: 600;
    color: #93c5fd;
  }

  .preview-canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  .preview-canvas::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4f46e5 0%, #8b5cf6 50%, #ec4899 100%);
    z-index: 2;
  }

  .preview-canvas:hover {
    box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.15);
  }
</style>
