# BOX x86_64 — QEMU Wasm static workstation

This is a **new QEMU Wasm** front end, not a v86 ISO loader. It boots an x86_64 Alpine Linux guest via the [ktock/qemu-wasm-demo](https://github.com/ktock/qemu-wasm-demo) runtime. The VM executes in the browser using WebAssembly threads and QEMU TCG.

## Deploy with GitHub Pages

1. Commit `index.html`, `coi-serviceworker.js`, and `.github/workflows/deploy-qemu.yml` to the repository `main` branch.
2. In GitHub repository **Settings → Pages**, select **GitHub Actions** as the source. Ensure Actions are enabled.
3. Run **Actions → Deploy BOX QEMU x86_64 → Run workflow** (or push the files). The workflow fetches QEMU Wasm runtime assets and Alpine disk from the upstream published demo into a Pages deployment artifact. **Do not commit runtime binaries or an ISO.**
4. Open your GitHub Pages site. The first navigation may register the COI service worker and reload. Check the browser's `crossOriginIsolated` value if boot reports SharedArrayBuffer is unavailable.
5. Press **Boot x86_64**. Log in as `root` with no password at the `login:` prompt. Check `uname -m` and `/etc/alpine-release`.

## Node.js/npm

The upstream Alpine disk is built from Alpine 3.21 and does not guarantee Node/npm. On the first push, the workflow **attempts** a larger Alpine disk with Node/npm, Bash, Git and other tools baked in. The custom-image stage is marked experimental; the job deploys the upstream disk if the build fails. You can disable this expensive build in a manual run using `build_developer_image=false`. The manifest `runtime/manifest.json` indicates which disk deployed.

The **Install Node + npm** button sends the Alpine 3.21 repository command to the terminal. The guest's browser-side Fetch proxy can fail against an APK mirror that does not allow CORS. This is a network limitation, not an incorrectly typed command. Baking packages into the disk is preferable for this deployment.

## Network, uploads and persistence

The upstream QEMU stack uses browser-side HTTP(S) proxying. It cannot freely connect to endpoints blocked by CORS, and it is not a general-purpose outbound TCP socket stack. The browser and guest still require network access to the hosted assets.

Scripts uploaded through the UI are staged in Emscripten's `/.wasmenv/share` and can be accessed from Linux through the QEMU 9p shared filesystem (`wasm0` mount tag). The guest can mount the share at `/mnt/box` and read `/mnt/box/share`.

The upstream `init.sh` puts the guest root filesystem on a **tmpfs overlay**, which means changes made in the guest after boot are **not persistent**. BOX saves its command and script editor contents to localStorage, not the Linux guest filesystem. Uploaded files are staged per session only. A persistent writable guest disk is a separate feature requiring image and block-device changes.

## Single-HTML constraint

The application interface lives in one `index.html`, but QEMU Wasm requires compiled Wasm, worker scripts, packaged guest disk/kernel and a **same-origin** isolation service worker. Browsers cannot register a worker from a `data:` or foreign-origin URL, so a *literal* one-file-only GitHub Pages deployment is not achievable with this upstream threaded runtime. The included GitHub Actions workflow publishes these assets automatically with no manual ISO upload.

## Sources

- https://github.com/ktock/qemu-wasm
- https://github.com/ktock/qemu-wasm-demo/blob/main/docs/alpine-x86_64.html
- https://github.com/mame/xterm-pty
- https://github.com/gzuidhof/coi-serviceworker

This project includes experimental upstream components. The QEMU runtime, package installation, and custom-image build must be tested on the actual Pages deployment; they could not be end-to-end verified in the offline build environment.
