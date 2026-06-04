(function attachHumanisVitalHUD(global) {
  "use strict";

  const DEFAULT_HUMANIS_DATA = {
    id: "H-001",
    nome: "Humanis",
    raca: "Humanis",
    status: "ATIVO",
    pv: { atual: 26, maximo: 26 },
    estresse: { atual: 2, maximo: 7 },
    cosmos: { atual: 0, maximo: 0 },
    saturacao: { atual: 0, maximo: 10 },
    defesa: { ca: 12, fisica: 35, termica: 20, eletrica: 25, cosmica: 15 },
    sinaisVitais: {
      frequenciaCardiaca: 72,
      pressaoArterial: "120/80",
      frequenciaRespiratoria: 16,
      temperatura: 36.7,
      saturacaoOxigenio: 99,
    },
    recursos: { hidratacao: 78, nutricao: 62 },
    condicoes: { sangramento: "NENHUM", alerta: "NENHUM ALERTA" },
    corpo: {
      cabeca: 100,
      pescoco: 100,
      torax: 100,
      abdomen: 100,
      bracoDireito: 100,
      bracoEsquerdo: 100,
      pernaDireita: 100,
      pernaEsquerda: 100,
    },
    equipamento: {
      nome: "Equipamento Biometrico",
      sistema: "Sistema Integrado",
      versao: "3.7.2",
    },
  };

  const humanisThreeViewers = new WeakMap();
  let humanisThreeModulesPromise = null;

  function defaultHumanisModelUrl() {
    const locationRef = global.location;
    return locationRef && locationRef.protocol === "file:" ? "./assets/models/humanis.glb" : "/assets/models/humanis.glb";
  }

  function loadHumanisThreeModules() {
    if (!humanisThreeModulesPromise) {
      humanisThreeModulesPromise = Promise.all([
        import("three"),
        import("three/addons/loaders/GLTFLoader.js"),
      ])
        .then(([THREE, loaderModule]) => ({ THREE, GLTFLoader: loaderModule.GLTFLoader }))
        .catch((error) => {
          humanisThreeModulesPromise = null;
          throw error;
        });
    }

    return humanisThreeModulesPromise;
  }

  function escapeHud(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function clampHud(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, Number(value) || 0));
  }

  function percentHud(current, max) {
    const safeMax = Number(max) || 0;
    if (safeMax <= 0) return 0;
    return clampHud((Number(current) / safeMax) * 100);
  }

  function deepMerge(base, patch) {
    const output = { ...base };
    Object.entries(patch || {}).forEach(([key, value]) => {
      if (value && typeof value === "object" && !Array.isArray(value) && base[key] && typeof base[key] === "object") {
        output[key] = deepMerge(base[key], value);
      } else if (value !== undefined) {
        output[key] = value;
      }
    });
    return output;
  }

  function colorForCondition(value) {
    const safeValue = clampHud(value);
    if (safeValue >= 70) return "var(--hvh-green)";
    if (safeValue >= 35) return "var(--hvh-yellow)";
    return "var(--hvh-red)";
  }

  function pvStatus(pv) {
    const p = percentHud(pv.atual, pv.maximo);
    if (p <= 0) return "CRÍTICO";
    if (p <= 25) return "RISCO";
    if (p <= 50) return "FERIDO";
    return "ESTÁVEL";
  }

  function stressStatus(estresse) {
    const p = percentHud(estresse.atual, estresse.maximo);
    if (p >= 80) return "COLAPSO";
    if (p >= 55) return "ALTO";
    if (p >= 30) return "TENSÃO";
    return "NÍVEL BAIXO";
  }

  function createBar(value, color = "var(--hvh-cyan)") {
    const safeValue = clampHud(value);
    return `
      <div class="hvh-bar" aria-hidden="true">
        <span class="hvh-bar-fill" style="width:${safeValue}%; background:${color}; box-shadow:0 0 14px ${color};"></span>
      </div>
    `;
  }

  function createSegmentBar(current, max, color = "var(--hvh-cyan)") {
    const safeMax = Math.max(1, Math.min(14, Number(max) || 1));
    const safeCurrent = clampHud(current, 0, safeMax);
    return `
      <div class="hvh-segments" aria-hidden="true">
        ${Array.from({ length: safeMax }).map((_, index) => `
          <span class="hvh-segment ${index < safeCurrent ? "active" : ""}" style="${index < safeCurrent ? `background:${color}; box-shadow:0 0 10px ${color};` : ""}"></span>
        `).join("")}
      </div>
    `;
  }

  function createBodyPart(label, value) {
    const safeValue = clampHud(value);
    const color = colorForCondition(safeValue);
    return `
      <div class="hvh-body-part">
        <span>${escapeHud(label)}</span>
        <strong style="color:${color}">${Math.round(safeValue)}%</strong>
        ${createBar(safeValue, color)}
      </div>
    `;
  }

  function createPanel(title, icon, content, extraClass = "") {
    return `
      <section class="hvh-panel ${escapeHud(extraClass)}">
        <div class="hvh-panel-title">
          <span>${escapeHud(icon)}</span>
          <h3>${escapeHud(title)}</h3>
        </div>
        ${content}
      </section>
    `;
  }

  function humanisPartLabel(partName) {
    const labels = {
      cabeca: "Cabeca",
      pescoco: "Pescoco",
      torax: "Torax",
      abdomen: "Abdomen",
      bracoDireito: "Braco direito",
      bracoEsquerdo: "Braco esquerdo",
      pernaDireita: "Perna direita",
      pernaEsquerda: "Perna esquerda",
    };

    return labels[partName] || "Regiao corporal";
  }

  function getHumanisPartValue(data, partName) {
    return Math.round(clampHud(data.corpo?.[partName] ?? 100));
  }

  function normalizeHumanisPartName(value) {
    const normalized = String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");

    if (/head|skull|face|cabeca|cranio/.test(normalized)) return "cabeca";
    if (/neck|pescoco|cervical/.test(normalized)) return "pescoco";
    if (/abdomen|belly|stomach|pelvis|quadril/.test(normalized)) return "abdomen";
    if (/rightarm|armright|bracodireito|rarm|forearmr|maodireita|handright/.test(normalized)) return "bracoDireito";
    if (/leftarm|armleft|bracoesquerdo|larm|forearml|maoesquerda|handleft/.test(normalized)) return "bracoEsquerdo";
    if (/rightleg|legright|pernadireita|rleg|footright|pedireito/.test(normalized)) return "pernaDireita";
    if (/leftleg|legleft|pernaesquerda|lleg|footleft|peesquerdo/.test(normalized)) return "pernaEsquerda";
    if (/chest|torso|spine|body|torax|peito/.test(normalized)) return "torax";
    return "torax";
  }

  function showHumanisTooltip(scan, tooltip, label, value, clientX, clientY) {
    if (!scan || !tooltip) return;
    tooltip.textContent = `${label}: ${Math.round(clampHud(value))}%`;
    tooltip.hidden = false;

    const rect = scan.getBoundingClientRect();
    const tooltipWidth = tooltip.offsetWidth || 128;
    const tooltipHeight = tooltip.offsetHeight || 38;
    const x = clampHud(clientX - rect.left + 14, 8, Math.max(8, rect.width - tooltipWidth - 8));
    const y = clampHud(clientY - rect.top - tooltipHeight - 8, 8, Math.max(8, rect.height - tooltipHeight - 8));
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  }

  function hideHumanisTooltip(tooltip) {
    if (tooltip) tooltip.hidden = true;
  }

  function triggerHumanisBodyPartClick(container, data, partName, value) {
    if (!partName) return;

    const safeValue = Math.round(clampHud(value));
    if (typeof data.onBodyPartClick === "function") {
      data.onBodyPartClick(partName, safeValue);
    }

    container.dispatchEvent(new CustomEvent("humanis:body-part-click", {
      bubbles: true,
      detail: { partName, value: safeValue },
    }));
  }

  function setupHumanisBodyInteractions(container, data) {
    const scan = container.querySelector("[data-hvh-human-viewer]");
    const tooltip = container.querySelector(".hvh-body-tooltip");
    const zones = container.querySelectorAll(".hvh-body-zone");

    zones.forEach((zone) => {
      zone.addEventListener("pointerenter", (event) => {
        zone.classList.add("is-hovered");
        showHumanisTooltip(scan, tooltip, zone.dataset.label, zone.dataset.value, event.clientX, event.clientY);
      });

      zone.addEventListener("pointermove", (event) => {
        showHumanisTooltip(scan, tooltip, zone.dataset.label, zone.dataset.value, event.clientX, event.clientY);
      });

      zone.addEventListener("pointerleave", () => {
        zone.classList.remove("is-hovered");
        hideHumanisTooltip(tooltip);
      });

      zone.addEventListener("click", () => {
        triggerHumanisBodyPartClick(container, data, zone.dataset.part, zone.dataset.value);
      });

      zone.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        triggerHumanisBodyPartClick(container, data, zone.dataset.part, zone.dataset.value);
      });
    });
  }

  function setHumanisThreeFallback(scan, status) {
    if (!scan) return;
    scan.classList.remove("three-loading", "three-ready");
    scan.classList.add("three-fallback");
    if (status) status.textContent = "Modelo 3D nao encontrado - usando SVG holografico";
  }

  function disposeHumanisObject(object) {
    if (!object || typeof object.traverse !== "function") return;

    object.traverse((child) => {
      if (child.geometry && typeof child.geometry.dispose === "function") child.geometry.dispose();

      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.filter(Boolean).forEach((material) => {
        Object.values(material).forEach((value) => {
          if (value && typeof value.dispose === "function") value.dispose();
        });
        if (typeof material.dispose === "function") material.dispose();
      });
    });
  }

  function cleanupHumanisViewer(container) {
    const viewer = humanisThreeViewers.get(container);
    if (!viewer) return;
    viewer.dispose();
    humanisThreeViewers.delete(container);
  }

  function canPreflightHumanisModel(modelUrl) {
    try {
      const url = new URL(modelUrl, global.location?.href || "http://localhost/");
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (error) {
      return false;
    }
  }

  function preflightHumanisModel(modelUrl, signal) {
    if (!canPreflightHumanisModel(modelUrl) || typeof global.fetch !== "function") return Promise.resolve();
    return global.fetch(modelUrl, { method: "HEAD", cache: "no-store", signal }).then((response) => {
      if (!response.ok) throw new Error(`Modelo Humanis indisponivel: ${response.status}`);
    });
  }

  function humanisModelCandidates(modelUrl) {
    const primary = modelUrl || defaultHumanisModelUrl();
    const candidates = [primary];

    if (/\.glb(?:$|\?)/i.test(primary)) {
      candidates.push(primary.replace(/\.glb(?=$|\?)/i, ".gltf"));
    } else if (/\.gltf(?:$|\?)/i.test(primary)) {
      candidates.push(primary.replace(/\.gltf(?=$|\?)/i, ".glb"));
    }

    return [...new Set(candidates)];
  }

  function findAvailableHumanisModelUrl(candidates, signal) {
    const tryCandidate = (index) => {
      const candidate = candidates[index];
      if (!candidate) return Promise.reject(new Error("Modelo Humanis indisponivel."));
      return preflightHumanisModel(candidate, signal)
        .then(() => candidate)
        .catch(() => tryCandidate(index + 1));
    };

    return tryCandidate(0);
  }

  function setupHumanisThreeViewer(container, data) {
    const scan = container.querySelector("[data-hvh-human-viewer]");
    const viewer = container.querySelector(".hvh-three-viewer");
    const canvas = container.querySelector(".hvh-three-canvas");
    const status = container.querySelector(".hvh-three-status");
    if (!scan || !viewer || !canvas) return;

    const modelUrl = viewer.dataset.modelUrl || defaultHumanisModelUrl();
    const modelCandidates = humanisModelCandidates(modelUrl);
    const abortController = typeof AbortController === "function" ? new AbortController() : null;
    let disposed = false;
    let frameId = 0;
    let renderer = null;
    let scene = null;
    let model = null;
    let resizeObserver = null;
    let resizeHandler = null;

    const dispose = () => {
      disposed = true;
      if (abortController) abortController.abort();
      if (frameId) global.cancelAnimationFrame(frameId);
      if (resizeObserver) resizeObserver.disconnect();
      if (resizeHandler) global.removeEventListener("resize", resizeHandler);
      disposeHumanisObject(model);
      if (renderer) renderer.dispose();
    };

    humanisThreeViewers.set(container, { dispose });
    scan.classList.add("three-loading");

    findAvailableHumanisModelUrl(modelCandidates, abortController?.signal)
      .then((availableModelUrl) => loadHumanisThreeModules().then((modules) => ({ ...modules, availableModelUrl })))
      .then(({ THREE, GLTFLoader, availableModelUrl }) => {
        if (disposed) return;

        scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
        camera.position.set(0, 0.8, 4.15);

        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 2));

        const group = new THREE.Group();
        scene.add(group);

        scene.add(new THREE.AmbientLight(0x7cecff, 1.15));
        const mainLight = new THREE.PointLight(0x7cecff, 2.6, 10);
        mainLight.position.set(0, 1.8, 3.2);
        scene.add(mainLight);
        const backLight = new THREE.PointLight(0x9b4dff, 1.1, 8);
        backLight.position.set(1.8, 1, -2.6);
        scene.add(backLight);

        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0x27d9ff,
          transparent: true,
          opacity: 0.35,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.012, 12, 96), ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -1.72;
        scene.add(ring);

        const loader = new GLTFLoader();
        const loadModelCandidate = (candidateIndex) => {
          const candidateUrl = modelCandidates[candidateIndex];
          if (!candidateUrl) {
            if (!disposed) setHumanisThreeFallback(scan, status);
            return;
          }

          loader.load(candidateUrl, (gltf) => {
          if (disposed) return;

          model = gltf.scene || gltf.scenes?.[0];
          if (!model) {
            setHumanisThreeFallback(scan, status);
            return;
          }

          let meshCount = 0;
          model.traverse((child) => {
            if (!child.isMesh) return;
            meshCount += 1;
            child.userData.bodyPart = normalizeHumanisPartName(child.name || child.parent?.name);
            child.material = new THREE.MeshStandardMaterial({
              color: 0x27d9ff,
              emissive: 0x27d9ff,
              emissiveIntensity: 0.72,
              roughness: 0.18,
              metalness: 0.18,
              transparent: true,
              opacity: 0.42,
              wireframe: true,
              depthWrite: false,
            });
          });

          if (!meshCount) {
            setHumanisThreeFallback(scan, status);
            return;
          }

          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          const maxSize = Math.max(size.x, size.y, size.z, 1);
          model.scale.setScalar(3.25 / maxSize);
          group.add(model);

          scan.classList.remove("three-loading", "three-fallback");
          scan.classList.add("three-ready");

          const raycaster = new THREE.Raycaster();
          const pointer = new THREE.Vector2();
          let hoveredMesh = null;
          let dragging = false;
          let lastX = 0;
          let lastY = 0;

          const resize = () => {
            if (disposed) return;
            const width = Math.max(160, viewer.clientWidth || 220);
            const height = Math.max(280, viewer.clientHeight || 420);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
          };

          const setHoveredMesh = (mesh) => {
            if (hoveredMesh === mesh) return;
            if (hoveredMesh?.material) {
              hoveredMesh.material.opacity = 0.42;
              hoveredMesh.material.emissiveIntensity = 0.72;
            }
            hoveredMesh = mesh;
            if (hoveredMesh?.material) {
              hoveredMesh.material.opacity = 0.8;
              hoveredMesh.material.emissiveIntensity = 1.7;
            }
          };

          const pickMesh = (event) => {
            const rect = canvas.getBoundingClientRect();
            if (!rect.width || !rect.height) return null;
            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
            raycaster.setFromCamera(pointer, camera);
            const hit = raycaster.intersectObjects(group.children, true).find((entry) => entry.object?.isMesh);
            return hit?.object || null;
          };

          const showMeshTooltip = (mesh, event) => {
            if (!mesh) {
              hideHumanisTooltip(container.querySelector(".hvh-body-tooltip"));
              return;
            }

            const partName = mesh.userData.bodyPart || "torax";
            showHumanisTooltip(
              scan,
              container.querySelector(".hvh-body-tooltip"),
              humanisPartLabel(partName),
              getHumanisPartValue(data, partName),
              event.clientX,
              event.clientY,
            );
          };

          canvas.addEventListener("pointerdown", (event) => {
            dragging = true;
            lastX = event.clientX;
            lastY = event.clientY;
            canvas.setPointerCapture?.(event.pointerId);
          });

          canvas.addEventListener("pointermove", (event) => {
            if (dragging) {
              group.rotation.y += (event.clientX - lastX) * 0.012;
              group.rotation.x = clampHud(group.rotation.x + (event.clientY - lastY) * 0.008, -0.55, 0.55);
              lastX = event.clientX;
              lastY = event.clientY;
              return;
            }

            const mesh = pickMesh(event);
            setHoveredMesh(mesh);
            showMeshTooltip(mesh, event);
          });

          canvas.addEventListener("pointerleave", () => {
            dragging = false;
            setHoveredMesh(null);
            hideHumanisTooltip(container.querySelector(".hvh-body-tooltip"));
          });

          canvas.addEventListener("pointerup", (event) => {
            dragging = false;
            canvas.releasePointerCapture?.(event.pointerId);
          });

          canvas.addEventListener("wheel", (event) => {
            event.preventDefault();
            camera.position.z = clampHud(camera.position.z + event.deltaY * 0.003, 3.1, 5.2);
          }, { passive: false });

          canvas.addEventListener("click", (event) => {
            const mesh = hoveredMesh || pickMesh(event);
            const partName = mesh?.userData.bodyPart;
            if (partName) triggerHumanisBodyPartClick(container, data, partName, getHumanisPartValue(data, partName));
          });

          resize();
          if (typeof ResizeObserver === "function") {
            resizeObserver = new ResizeObserver(resize);
            resizeObserver.observe(viewer);
          } else {
            resizeHandler = resize;
            global.addEventListener("resize", resizeHandler);
          }

          const animate = () => {
            if (disposed) return;
            if (!dragging) group.rotation.y += 0.0045;
            ring.rotation.z += 0.012;
            renderer.render(scene, camera);
            frameId = global.requestAnimationFrame(animate);
          };

          animate();
          }, undefined, () => {
            if (!disposed) loadModelCandidate(candidateIndex + 1);
          });
        };

        loadModelCandidate(Math.max(0, modelCandidates.indexOf(availableModelUrl)));
      })
      .catch(() => {
        if (!disposed) setHumanisThreeFallback(scan, status);
      });
  }

  function createHumanisSilhouette(data) {
    const partValue = (part) => Math.round(clampHud(data.corpo?.[part] ?? 100));
    const zone = (part, label, content) => `
      <g class="hvh-body-zone" data-part="${escapeHud(part)}" data-label="${escapeHud(label)}" data-value="${partValue(part)}" tabindex="0" role="button" aria-label="${escapeHud(`${label}: ${partValue(part)}%`)}">
        ${content}
      </g>
    `;

    return `
      <div class="hvh-human-scan hvh-human-rotator" data-hvh-human-viewer>
        <div class="hvh-scan-line"></div>
        <div class="hvh-scan-base"><span></span><span></span><span></span></div>
        <div class="hvh-three-viewer" data-model-url="${escapeHud(data.modelUrl || data.modelo3d || defaultHumanisModelUrl())}" aria-label="Viewer 3D Humanis">
          <canvas class="hvh-three-canvas"></canvas>
          <span class="hvh-three-status">Aguardando /assets/models/humanis.glb</span>
        </div>

        <div class="hvh-human-rotation-stage">
          <svg viewBox="0 0 220 460" class="hvh-human-svg hvh-human-svg-rotating" aria-label="Diagrama corporal Humanis">
            <defs>
              <radialGradient id="hvhHumanGlow" cx="50%" cy="34%" r="66%">
                <stop offset="0%" stop-color="#d9fbff" stop-opacity="0.72" />
                <stop offset="45%" stop-color="#27d9ff" stop-opacity="0.34" />
                <stop offset="100%" stop-color="#06131f" stop-opacity="0.02" />
              </radialGradient>
              <linearGradient id="hvhBodyFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#7cecff" stop-opacity="0.32" />
                <stop offset="55%" stop-color="#1da6ff" stop-opacity="0.18" />
                <stop offset="100%" stop-color="#27d9ff" stop-opacity="0.08" />
              </linearGradient>
              <linearGradient id="hvhHumanSideGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#27d9ff" stop-opacity="0.08" />
                <stop offset="50%" stop-color="#7cecff" stop-opacity="0.55" />
                <stop offset="100%" stop-color="#9b4dff" stop-opacity="0.12" />
              </linearGradient>
            </defs>

            <ellipse cx="110" cy="238" rx="82" ry="210" fill="url(#hvhHumanSideGlow)" opacity="0.08" />
            <ellipse cx="110" cy="448" rx="58" ry="11" class="hvh-human-shadow" />

            <g class="hvh-human-shell">
              ${zone("cabeca", "Cabeça", '<circle cx="110" cy="47" r="34" fill="url(#hvhHumanGlow)" stroke="#7cecff" stroke-width="2" />')}
              ${zone("pescoco", "Pescoço", '<path d="M94 96h32l6 33H88l6-33Z" fill="url(#hvhBodyFill)" stroke="#7cecff" stroke-width="2" />')}
              ${zone("torax", "Tórax", '<path d="M82 91 C96 105, 124 105, 138 91 C151 126, 154 169, 147 223 C141 263, 132 293, 124 326 L96 326 C88 293, 79 263, 73 223 C66 169, 69 126, 82 91Z" fill="url(#hvhHumanGlow)" stroke="#7cecff" stroke-width="2" />')}
              ${zone("abdomen", "Abdômen", '<path d="M81 298c16 14 42 14 58 0l11 36c-24 17-56 17-80 0l11-36Z" fill="url(#hvhBodyFill)" stroke="#7cecff" stroke-width="2" />')}
              ${zone("bracoDireito", "Braço direito", '<path d="M75 115 C45 138, 35 184, 27 237 C24 257, 22 279, 20 303" fill="none" stroke="#7cecff" stroke-width="8" stroke-linecap="round" opacity="0.72" />')}
              ${zone("bracoEsquerdo", "Braço esquerdo", '<path d="M145 115 C175 138, 185 184, 193 237 C196 257, 198 279, 200 303" fill="none" stroke="#7cecff" stroke-width="8" stroke-linecap="round" opacity="0.72" />')}
              ${zone("pernaDireita", "Perna direita", '<path d="M99 326 C94 365, 91 402, 86 448" fill="none" stroke="#7cecff" stroke-width="9" stroke-linecap="round" opacity="0.75" />')}
              ${zone("pernaEsquerda", "Perna esquerda", '<path d="M121 326 C126 365, 129 402, 134 448" fill="none" stroke="#7cecff" stroke-width="9" stroke-linecap="round" opacity="0.75" />')}
            </g>

            <g class="hvh-human-mesh" aria-hidden="true">
              <path d="M110 101v333" />
              <path d="M81 132h58M72 169h76M70 205h80M75 241h70M82 282h56M74 333h72" />
              <path d="M82 129c18 29 38 29 56 0M80 203c20 13 40 13 60 0M82 298c18 15 38 15 56 0" />
              <path d="M76 143l-34 154M144 143l34 154M88 331l-16 106M132 331l16 106" />
              <path d="M92 126l36 0M86 161l48 0M84 196l52 0M89 232l42 0" />
            </g>

            <g class="hvh-human-organs" aria-hidden="true">
              <path d="M98 166c-19 10-25 31-21 57 3 19 18 27 31 18 3-26 2-53-10-75Z" />
              <path d="M122 166c19 10 25 31 21 57-3 19-18 27-31 18-3-26-2-53 10-75Z" />
              <path d="M110 203c10-17 35-1 16 19l-16 16-16-16c-19-20 6-36 16-19Z" />
              <path d="M110 105c-7 20 7 30 0 49s7 30 0 49 7 30 0 49 7 30 0 49" />
            </g>

            <g class="hvh-human-joints" aria-hidden="true">
              <circle cx="110" cy="101" r="4" />
              <circle cx="75" cy="139" r="4" />
              <circle cx="145" cy="139" r="4" />
              <circle cx="42" cy="224" r="4" />
              <circle cx="178" cy="224" r="4" />
              <circle cx="82" cy="326" r="4" />
              <circle cx="138" cy="326" r="4" />
              <circle cx="78" cy="396" r="3.5" />
              <circle cx="142" cy="396" r="3.5" />
            </g>
          </svg>
        </div>

        <div class="hvh-body-tooltip" role="tooltip" hidden></div>
        <div class="hvh-rotation-label">HOLOSCAN HUMANIS // AUTO-ROTAÇÃO</div>
      </div>
    `;
  }

  function injectHumanisHudStyles() {
    if (document.getElementById("humanis-vital-hud-styles")) return;

    const style = document.createElement("style");
    style.id = "humanis-vital-hud-styles";
    style.textContent = `
      :root {
        --hvh-bg: #02070d;
        --hvh-panel: rgba(3, 14, 24, 0.93);
        --hvh-panel-soft: rgba(8, 27, 44, 0.74);
        --hvh-cyan: #27d9ff;
        --hvh-blue: #168fff;
        --hvh-red: #ff334a;
        --hvh-orange: #ff9b2f;
        --hvh-yellow: #ffd047;
        --hvh-green: #00ff8a;
        --hvh-purple: #9b4dff;
        --hvh-text: #c8f6ff;
        --hvh-muted: #69a8bd;
        --hvh-border: rgba(39, 217, 255, 0.45);
      }

      .hvh-root,
      .hvh-root * {
        box-sizing: border-box;
      }

      .hvh-root {
        width: 100%;
        color: var(--hvh-text);
        background:
          radial-gradient(circle at 50% 30%, rgba(39, 217, 255, 0.11), transparent 36%),
          radial-gradient(circle at 82% 80%, rgba(155, 77, 255, 0.08), transparent 32%),
          linear-gradient(135deg, #010409, #06101d 52%, #02070d);
        border: 1px solid var(--hvh-border);
        box-shadow: 0 0 35px rgba(39, 217, 255, 0.16), inset 0 0 55px rgba(39, 217, 255, 0.05);
        padding: 18px;
        position: relative;
        overflow: hidden;
        font-family: "Rajdhani", "Orbitron", "Segoe UI", Arial, sans-serif;
        clip-path: polygon(0 18px, 18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px));
      }

      .hvh-root::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(rgba(39, 217, 255, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(39, 217, 255, 0.04) 1px, transparent 1px);
        background-size: 28px 28px;
        pointer-events: none;
        mask-image: linear-gradient(to bottom, rgba(0,0,0,0.78), transparent 94%);
      }

      .hvh-root::after {
        content: "";
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(to bottom, rgba(255,255,255,0.025), rgba(255,255,255,0.025) 1px, transparent 1px, transparent 5px);
        pointer-events: none;
        opacity: 0.28;
      }

      .hvh-header,
      .hvh-grid {
        position: relative;
        z-index: 1;
      }

      .hvh-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        border: 1px solid rgba(39, 217, 255, 0.24);
        background: rgba(0, 0, 0, 0.28);
        padding: 14px 18px;
        margin-bottom: 14px;
        clip-path: polygon(0 0, 97% 0, 100% 35%, 100% 100%, 3% 100%, 0 65%);
      }

      .hvh-title h1 {
        margin: 0;
        color: var(--hvh-text);
        font-size: clamp(22px, 3vw, 38px);
        line-height: 1;
        letter-spacing: 2px;
        text-transform: uppercase;
        text-shadow: 0 0 16px rgba(39, 217, 255, 0.8);
      }

      .hvh-title span,
      .hvh-id {
        color: var(--hvh-muted);
        text-transform: uppercase;
        letter-spacing: 1.2px;
        font-size: 13px;
      }

      .hvh-title span {
        display: block;
        margin-top: 7px;
      }

      .hvh-id {
        min-width: 230px;
        display: grid;
        gap: 6px;
        text-align: right;
      }

      .hvh-id strong {
        color: var(--hvh-text);
      }

      .hvh-status {
        color: var(--hvh-green) !important;
        text-shadow: 0 0 12px rgba(0, 255, 138, 0.8);
      }

      .hvh-status::after {
        content: "";
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-left: 8px;
        border-radius: 50%;
        background: var(--hvh-green);
        box-shadow: 0 0 15px var(--hvh-green);
      }

      .hvh-grid {
        display: grid;
        grid-template-columns: minmax(270px, 1fr) minmax(300px, 1fr);
        gap: 14px;
      }

      .hvh-column {
        display: grid;
        gap: 14px;
        align-content: start;
      }

      .hvh-panel {
        background:
          linear-gradient(135deg, rgba(39, 217, 255, 0.08), transparent 45%),
          var(--hvh-panel);
        border: 1px solid var(--hvh-border);
        box-shadow: inset 0 0 22px rgba(39, 217, 255, 0.08), 0 0 18px rgba(0,0,0,0.35);
        padding: 16px;
        min-width: 0;
        clip-path: polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px));
      }

      .hvh-panel.red { border-color: rgba(255, 51, 74, 0.55); box-shadow: inset 0 0 22px rgba(255, 51, 74, 0.08); }
      .hvh-panel.orange { border-color: rgba(255, 155, 47, 0.5); box-shadow: inset 0 0 22px rgba(255, 155, 47, 0.08); }
      .hvh-panel.purple { border-color: rgba(155, 77, 255, 0.55); box-shadow: inset 0 0 22px rgba(155, 77, 255, 0.08); }
      .hvh-panel.cyan { border-color: rgba(39, 217, 255, 0.58); box-shadow: inset 0 0 22px rgba(39, 217, 255, 0.1); }

      .hvh-panel-title {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 14px;
        border-bottom: 1px solid rgba(39, 217, 255, 0.18);
        padding-bottom: 8px;
      }

      .hvh-panel-title span {
        min-width: 28px;
        min-height: 28px;
        display: inline-grid;
        place-items: center;
        color: var(--hvh-cyan);
        border: 1px solid rgba(39, 217, 255, 0.32);
        font-size: 12px;
        font-weight: 900;
        text-shadow: 0 0 12px currentColor;
      }

      .hvh-panel-title h3 {
        margin: 0;
        font-size: 17px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
      }

      .hvh-big-stat {
        display: grid;
        grid-template-columns: 86px 1fr;
        gap: 14px;
        align-items: center;
      }

      .hvh-icon-box {
        width: 78px;
        height: 78px;
        display: grid;
        place-items: center;
        border: 1px solid currentColor;
        clip-path: polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%);
        background: rgba(0,0,0,0.28);
        font-size: 22px;
        font-weight: 900;
        letter-spacing: 1px;
        text-shadow: 0 0 18px currentColor;
      }

      .hvh-value {
        font-size: clamp(32px, 4vw, 44px);
        font-weight: 900;
        line-height: 1;
        letter-spacing: 2px;
      }

      .hvh-value small {
        font-size: 18px;
        color: var(--hvh-muted);
      }

      .hvh-substatus {
        margin-top: 8px;
        font-size: 13px;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: var(--hvh-muted);
      }

      .hvh-segments {
        display: flex;
        gap: 4px;
        margin-top: 12px;
        flex-wrap: wrap;
      }

      .hvh-segment {
        width: 16px;
        height: 16px;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.05);
      }

      .hvh-bar {
        width: 100%;
        height: 8px;
        background: rgba(255,255,255,0.07);
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.06);
        margin-top: 6px;
      }

      .hvh-bar-fill {
        display: block;
        height: 100%;
        transition: width 0.3s ease;
      }

      .hvh-ecg {
        margin-top: 12px;
        width: 100%;
        height: 42px;
      }

      .hvh-ecg polyline {
        stroke-dasharray: 420;
        stroke-dashoffset: 420;
        animation: hvhEcg 2.2s linear infinite;
      }

      @keyframes hvhEcg {
        to { stroke-dashoffset: 0; }
      }

      .hvh-body-panel {
        min-height: 622px;
        display: grid;
        grid-template-rows: auto 1fr auto;
      }

      .hvh-body-layout {
        display: grid;
        grid-template-columns: minmax(110px, 1fr) minmax(170px, 0.9fr) minmax(110px, 1fr);
        gap: 10px;
        align-items: center;
      }

      .hvh-body-side {
        display: grid;
        gap: 24px;
      }

      .hvh-body-part {
        color: var(--hvh-text);
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 1.2px;
      }

      .hvh-body-part strong {
        display: block;
        margin-top: 3px;
        font-size: 22px;
        letter-spacing: 1px;
      }

      .hvh-human-scan {
        height: 460px;
        display: grid;
        place-items: center;
        position: relative;
        overflow: hidden;
        border-left: 1px solid rgba(39, 217, 255, 0.1);
        border-right: 1px solid rgba(39, 217, 255, 0.1);
        perspective: 900px;
        isolation: isolate;
      }

      .hvh-human-rotator {
        perspective: 900px;
      }

      .hvh-human-rotation-stage {
        position: relative;
        z-index: 2;
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
        transform-style: preserve-3d;
        transition: opacity 0.25s ease;
      }

      .hvh-human-svg {
        width: 100%;
        max-width: 220px;
        height: 100%;
        filter: drop-shadow(0 0 16px rgba(39, 217, 255, 0.68));
        opacity: 0.96;
        transform-origin: center;
        transform-style: preserve-3d;
      }

      .hvh-human-svg-rotating {
        animation: hvhHumanRotate 7s linear infinite;
        cursor: pointer;
      }

      .hvh-human-rotation-stage:hover .hvh-human-svg-rotating,
      .hvh-human-rotation-stage:focus-within .hvh-human-svg-rotating {
        animation-play-state: paused;
      }

      @keyframes hvhHumanRotate {
        0% { transform: rotateY(0deg) rotateX(0deg); }
        25% { transform: rotateY(18deg) rotateX(1deg); }
        50% { transform: rotateY(0deg) rotateX(0deg); }
        75% { transform: rotateY(-18deg) rotateX(-1deg); }
        100% { transform: rotateY(0deg) rotateX(0deg); }
      }

      .hvh-body-zone {
        transition: filter 0.2s ease, opacity 0.2s ease;
        cursor: pointer;
        opacity: 0.82;
        outline: none;
      }

      .hvh-body-zone:hover,
      .hvh-body-zone:focus,
      .hvh-body-zone.is-hovered {
        filter: drop-shadow(0 0 14px #00ffea);
        opacity: 1;
      }

      .hvh-three-viewer {
        position: absolute;
        inset: 8px 0 18px;
        z-index: 1;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
      }

      .hvh-three-canvas {
        width: 100%;
        height: 100%;
        display: block;
        cursor: grab;
        filter: drop-shadow(0 0 18px rgba(39, 217, 255, 0.7));
      }

      .hvh-three-canvas:active {
        cursor: grabbing;
      }

      .hvh-three-status {
        position: absolute;
        left: 50%;
        bottom: 34px;
        transform: translateX(-50%);
        min-width: 190px;
        padding: 5px 9px;
        color: var(--hvh-muted);
        background: rgba(2, 7, 13, 0.72);
        border: 1px solid rgba(39, 217, 255, 0.22);
        font-size: 10px;
        letter-spacing: 1.1px;
        text-align: center;
        text-transform: uppercase;
        pointer-events: none;
      }

      .hvh-human-scan.three-ready .hvh-three-viewer {
        opacity: 1;
        pointer-events: auto;
        z-index: 4;
      }

      .hvh-human-scan.three-ready .hvh-human-rotation-stage {
        opacity: 0;
        pointer-events: none;
      }

      .hvh-human-scan.three-ready .hvh-three-status {
        display: none;
      }

      .hvh-human-scan.three-fallback .hvh-three-status {
        opacity: 0.82;
      }

      .hvh-body-tooltip {
        position: absolute;
        z-index: 8;
        min-width: 126px;
        padding: 8px 10px;
        color: var(--hvh-text);
        background: rgba(2, 12, 20, 0.94);
        border: 1px solid rgba(39, 217, 255, 0.68);
        box-shadow: 0 0 18px rgba(39, 217, 255, 0.22);
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 1px;
        text-transform: uppercase;
        pointer-events: none;
      }

      .hvh-body-tooltip[hidden] {
        display: none;
      }

      .hvh-rotation-label {
        position: absolute;
        bottom: 8px;
        left: 50%;
        z-index: 5;
        transform: translateX(-50%);
        color: var(--hvh-muted);
        font-size: 11px;
        letter-spacing: 1.4px;
        text-transform: uppercase;
        opacity: 0.8;
        white-space: nowrap;
        pointer-events: none;
      }

      @media (prefers-reduced-motion: reduce) {
        .hvh-human-svg-rotating {
          animation: none;
        }
      }

      .hvh-human-shadow {
        fill: rgba(39, 217, 255, 0.22);
        filter: blur(2px);
        pointer-events: none;
      }

      .hvh-human-shell path {
        fill: url(#hvhBodyFill);
        stroke: #7cecff;
        stroke-width: 2;
        stroke-linejoin: round;
        vector-effect: non-scaling-stroke;
      }

      .hvh-human-mesh path {
        fill: none;
        stroke: rgba(200, 246, 255, 0.55);
        stroke-width: 1;
        stroke-linecap: round;
        vector-effect: non-scaling-stroke;
        pointer-events: none;
      }

      .hvh-human-organs path {
        fill: rgba(39, 217, 255, 0.08);
        stroke: rgba(216, 247, 255, 0.76);
        stroke-width: 1.4;
        stroke-linecap: round;
        stroke-linejoin: round;
        filter: drop-shadow(0 0 8px rgba(39, 217, 255, 0.42));
        vector-effect: non-scaling-stroke;
        pointer-events: none;
      }

      .hvh-human-organs path:nth-child(3) {
        fill: rgba(255, 51, 74, 0.18);
        stroke: var(--hvh-red);
        filter: drop-shadow(0 0 9px rgba(255, 51, 74, 0.48));
      }

      .hvh-human-joints circle {
        fill: #d9fbff;
        stroke: #27d9ff;
        stroke-width: 1.2;
        filter: drop-shadow(0 0 7px rgba(39, 217, 255, 0.64));
        pointer-events: none;
      }

      .hvh-scan-line {
        position: absolute;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--hvh-cyan), transparent);
        box-shadow: 0 0 18px var(--hvh-cyan);
        animation: hvhScan 3.4s ease-in-out infinite;
        z-index: 2;
      }

      @keyframes hvhScan {
        0%, 100% { top: 8%; opacity: 0.25; }
        50% { top: 92%; opacity: 1; }
      }

      .hvh-scan-base {
        position: absolute;
        right: 12px;
        bottom: 8px;
        left: 12px;
        height: 52px;
      }

      .hvh-scan-base span {
        position: absolute;
        inset: 0;
        border: 1px solid rgba(39, 217, 255, 0.46);
        border-radius: 50%;
        box-shadow: inset 0 0 14px rgba(39, 217, 255, 0.16), 0 0 24px rgba(39, 217, 255, 0.2);
      }

      .hvh-scan-base span:nth-child(2) { inset: 12px 24px; border-color: rgba(0, 255, 138, 0.26); }
      .hvh-scan-base span:nth-child(3) { inset: 24px 52px; border-color: rgba(39, 217, 255, 0.28); }

      .hvh-general-condition {
        margin-top: 12px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        font-size: 18px;
        color: var(--hvh-muted);
        border-top: 1px solid rgba(39, 217, 255, 0.18);
        padding-top: 12px;
      }

      .hvh-general-condition strong {
        color: var(--hvh-green);
        text-shadow: 0 0 14px var(--hvh-green);
      }

      .hvh-metric-list {
        display: grid;
        gap: 12px;
      }

      .hvh-metric {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        border-bottom: 1px solid rgba(39, 217, 255, 0.14);
        padding-bottom: 9px;
        font-size: 15px;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--hvh-muted);
      }

      .hvh-metric strong {
        color: var(--hvh-text);
        font-size: 18px;
        text-align: right;
      }

      .hvh-resource-row {
        margin-bottom: 14px;
      }

      .hvh-resource-row:last-child {
        margin-bottom: 0;
      }

      .hvh-resource-label {
        display: flex;
        justify-content: space-between;
        color: var(--hvh-muted);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 5px;
      }

      .hvh-defense-grid {
        display: grid;
        grid-template-columns: 95px 1fr;
        gap: 16px;
        align-items: center;
      }

      .hvh-ca {
        text-align: center;
        border-right: 1px solid rgba(39, 217, 255, 0.18);
      }

      .hvh-ca span {
        display: block;
        color: var(--hvh-muted);
        text-transform: uppercase;
        letter-spacing: 1.5px;
      }

      .hvh-ca strong {
        display: block;
        font-size: 46px;
        color: var(--hvh-text);
        text-shadow: 0 0 14px rgba(39, 217, 255, 0.45);
      }

      .hvh-defense-list {
        display: grid;
        gap: 8px;
      }

      .hvh-defense-item {
        display: grid;
        grid-template-columns: 80px 1fr 42px;
        gap: 8px;
        align-items: center;
        color: var(--hvh-muted);
        text-transform: uppercase;
        font-size: 13px;
        letter-spacing: 1px;
      }

      .hvh-alert-box {
        min-height: 60px;
        display: grid;
        place-items: center;
        color: var(--hvh-green);
        text-transform: uppercase;
        letter-spacing: 1.5px;
        text-align: center;
        text-shadow: 0 0 12px currentColor;
      }

      .hvh-equipment {
        display: grid;
        gap: 8px;
        color: var(--hvh-muted);
        text-transform: uppercase;
        letter-spacing: 1.1px;
      }

      .hvh-equipment strong {
        color: var(--hvh-text);
        font-size: 18px;
      }

      @media (max-width: 1150px) {
        .hvh-grid {
          grid-template-columns: 1fr;
        }

        .hvh-body-panel {
          min-height: auto;
        }
      }

      @media (max-width: 680px) {
        .hvh-root {
          padding: 10px;
        }

        .hvh-header {
          display: grid;
          text-align: left;
        }

        .hvh-id {
          text-align: left;
          min-width: unset;
        }

        .hvh-body-layout {
          grid-template-columns: 1fr;
        }

        .hvh-body-side {
          gap: 12px;
        }

        .hvh-human-scan {
          height: 360px;
        }

        .hvh-defense-grid,
        .hvh-big-stat {
          grid-template-columns: 1fr;
        }

        .hvh-ca {
          border-right: 0;
          border-bottom: 1px solid rgba(39, 217, 255, 0.18);
          padding-bottom: 12px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function renderHumanisVitalHUD(target, userData = {}) {
    injectHumanisHudStyles();

    const container = typeof target === "string" ? document.querySelector(target) : target;
    if (!container) throw new Error("Container da HUD Humanis nao encontrado.");
    cleanupHumanisViewer(container);

    const data = deepMerge(DEFAULT_HUMANIS_DATA, userData);
    const pvPercent = percentHud(data.pv.atual, data.pv.maximo);
    const stressPercent = percentHud(data.estresse.atual, data.estresse.maximo);
    const cosmosPercent = percentHud(data.cosmos.atual, data.cosmos.maximo);
    const saturationPercent = percentHud(data.saturacao.atual, data.saturacao.maximo);
    const pvColor = colorForCondition(pvPercent);
    const stressColor = stressPercent >= 60 ? "var(--hvh-red)" : stressPercent >= 30 ? "var(--hvh-orange)" : "var(--hvh-yellow)";
    const cosmosColor = "var(--hvh-purple)";
    const saturationColor = saturationPercent >= 100 ? "var(--hvh-cyan)" : saturationPercent >= 65 ? "var(--hvh-blue)" : "var(--hvh-green)";
    const saturationStatus = saturationPercent >= 100 ? "Saturacao maxima" : saturationPercent >= 65 ? "Fluxo alto" : "Fluxo estavel";
    container.innerHTML = `
      <div class="hvh-root">
        <header class="hvh-header">
          <div class="hvh-title">
            <h1>Monitoramento Vital - ${escapeHud(data.raca)}</h1>
            <span>Sistema biométrico integrado Solaris</span>
          </div>

          <div class="hvh-id">
            <div>ID: <strong>${escapeHud(data.id)}</strong></div>
            <div>Nome: <strong>${escapeHud(data.nome)}</strong></div>
            <div>Status: <strong class="hvh-status">${escapeHud(data.status)}</strong></div>
          </div>
        </header>

        <main class="hvh-grid">
          <div class="hvh-column">
            ${createPanel("PV - Pontos de Vida", "PV", `
              <div class="hvh-big-stat">
                <div class="hvh-icon-box" style="color:${pvColor}">PV</div>
                <div>
                  <div class="hvh-value" style="color:${pvColor}; text-shadow:0 0 14px ${pvColor};">
                    ${escapeHud(data.pv.atual)}<small> / ${escapeHud(data.pv.maximo)}</small>
                  </div>
                  ${createBar(pvPercent, pvColor)}
                  <div class="hvh-substatus">${Math.round(pvPercent)}% - ${escapeHud(pvStatus(data.pv))}</div>
                </div>
              </div>

              <svg class="hvh-ecg" viewBox="0 0 360 60" preserveAspectRatio="none" aria-hidden="true">
                <polyline fill="none" stroke="${pvColor}" stroke-width="2" points="0,35 20,35 28,12 37,52 47,35 75,35 83,23 94,35 120,35 128,12 137,52 147,35 180,35 188,22 198,35 230,35 238,12 247,52 257,35 290,35 298,23 308,35 360,35" />
              </svg>
            `, "red")}

            ${createPanel("Estresse", "ES", `
              <div class="hvh-big-stat">
                <div class="hvh-icon-box" style="color:${stressColor}">ES</div>
                <div>
                  <div class="hvh-value" style="color:${stressColor}; text-shadow:0 0 14px ${stressColor};">
                    ${escapeHud(data.estresse.atual)}<small> / ${escapeHud(data.estresse.maximo)}</small>
                  </div>
                  ${createSegmentBar(data.estresse.atual, data.estresse.maximo, stressColor)}
                  <div class="hvh-substatus" style="color:${stressColor};">${escapeHud(stressStatus(data.estresse))}</div>
                </div>
              </div>
            `, "orange")}

            ${createPanel("Cosmos", "CO", `
              <div class="hvh-big-stat">
                <div class="hvh-icon-box" style="color:${cosmosColor}">CO</div>
                <div>
                  <div class="hvh-value" style="color:${cosmosColor}; text-shadow:0 0 14px ${cosmosColor};">
                    ${escapeHud(data.cosmos.atual)}<small> / ${escapeHud(data.cosmos.maximo)}</small>
                  </div>
                  ${createSegmentBar(data.cosmos.atual, Math.max(1, data.cosmos.maximo || 1), cosmosColor)}
                  <div class="hvh-substatus" style="color:${cosmosColor};">Fluxo ${cosmosPercent > 15 ? "estavel" : "baixo"}</div>
                </div>
              </div>
            `, "purple")}

            ${createPanel("Defesas", "CA", `
              <div class="hvh-defense-grid">
                <div class="hvh-ca">
                  <span>CA</span>
                  <strong>${escapeHud(data.defesa.ca)}</strong>
                </div>

                <div class="hvh-defense-list">
                  <div class="hvh-defense-item"><span>Física</span>${createBar(data.defesa.fisica, "var(--hvh-blue)")}<strong>${escapeHud(data.defesa.fisica)}%</strong></div>
                  <div class="hvh-defense-item"><span>Térmica</span>${createBar(data.defesa.termica, "var(--hvh-red)")}<strong>${escapeHud(data.defesa.termica)}%</strong></div>
                  <div class="hvh-defense-item"><span>Elétrica</span>${createBar(data.defesa.eletrica, "var(--hvh-yellow)")}<strong>${escapeHud(data.defesa.eletrica)}%</strong></div>
                  <div class="hvh-defense-item"><span>Cósmica</span>${createBar(data.defesa.cosmica, "var(--hvh-purple)")}<strong>${escapeHud(data.defesa.cosmica)}%</strong></div>
                </div>
              </div>
            `)}
          </div>

          <div class="hvh-column">
            ${createPanel("Sinais Vitais", "ECG", `
              <div class="hvh-metric-list">
                <div class="hvh-metric"><span>Freq. Cardíaca</span><strong>${escapeHud(data.sinaisVitais.frequenciaCardiaca)} BPM</strong></div>
                <div class="hvh-metric"><span>Pressão Arterial</span><strong>${escapeHud(data.sinaisVitais.pressaoArterial)} mmHg</strong></div>
                <div class="hvh-metric"><span>Freq. Respiratória</span><strong>${escapeHud(data.sinaisVitais.frequenciaRespiratoria)} RPM</strong></div>
                <div class="hvh-metric"><span>Temperatura</span><strong>${escapeHud(data.sinaisVitais.temperatura)} &deg;C</strong></div>
                <div class="hvh-metric"><span>Sat. Oxigênio</span><strong>${escapeHud(data.sinaisVitais.saturacaoOxigenio)}%</strong></div>
              </div>
            `)}

            ${createPanel("Saturação", "SA", `
              <div class="hvh-big-stat">
                <div class="hvh-icon-box" style="color:${saturationColor}">SA</div>
                <div>
                  <div class="hvh-value" style="color:${saturationColor}; text-shadow:0 0 14px ${saturationColor};">
                    ${escapeHud(data.saturacao.atual)}<small> / ${escapeHud(data.saturacao.maximo)}</small>
                  </div>
                  ${createSegmentBar(data.saturacao.atual, data.saturacao.maximo, saturationColor)}
                  <div class="hvh-substatus" style="color:${saturationColor};">${escapeHud(saturationStatus)}</div>
                </div>
              </div>
            `, "cyan")}

            ${createPanel(data.equipamento.nome, "EQ", `
              <div class="hvh-equipment">
                <strong>${escapeHud(data.equipamento.sistema)}</strong>
                <span>Versão ${escapeHud(data.equipamento.versao)}</span>
                <span>Compatibilidade Solaris ativa</span>
              </div>
            `)}
          </div>
        </main>
      </div>
    `;

    setupHumanisBodyInteractions(container, data);
    setupHumanisThreeViewer(container, data);
  }

  global.renderHumanisVitalHUD = renderHumanisVitalHUD;
  global.DEFAULT_HUMANIS_DATA = DEFAULT_HUMANIS_DATA;
})(window);
