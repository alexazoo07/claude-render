import { Config } from '@remotion/cli/config';
// En el PC (Windows) no se puede descargar Chrome Headless Shell: usamos Edge (Chromium) instalado.
// En la nube (GitHub Actions, Linux) Remotion descarga su propio navegador y la concurrencia se pasa por CLI.
if (process.platform === 'win32') {
  Config.setBrowserExecutable('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe');
  Config.setChromiumOpenGlRenderer('angle');
  Config.setConcurrency(8);
}
