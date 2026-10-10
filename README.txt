Replace index.html on robit-man/box main branch. Add .github/workflows/publish-alpine.yml to main. 
The workflow runs automatically when added, downloads Alpine 3.24.2 x86 ISO, verifies upstream SHA256,
and publishes to a separate linux-assets branch. Do NOT upload an ISO beside index.html.
The page reads https://raw.githubusercontent.com/robit-man/box/linux-assets/alpine-virt-3.24.2-x86.iso
and caches it in IndexedDB. The repository is autodetected on GitHub Pages.
If Actions push gets rejected, change repo Settings > Actions > General > Workflow permissions to
Read and write permissions, then rerun Publish Alpine image for browser VM.
Default relay wss://relay.widgetry.org/ is an example from v86 docs, not guaranteed to remain online.
Linux must be configured with DHCP inside the guest; no browser-origin can bypass CORS for ISO fetches.
