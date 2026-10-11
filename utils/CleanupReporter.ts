import fs from "fs";
import path from "path";
import type { FullConfig, FullResult, Reporter } from "@playwright/test/reporter";

/**
 * After-run cleanup: deletes the per-test output folder (screenshots, diffs, traces)
 * when the whole run PASSED. Failed/timed-out/interrupted runs keep everything for debugging.
 * Set KEEP_RESULTS=true to skip cleanup. Snapshots (baselines) and playwright-report are never touched.
 */
class CleanupReporter implements Reporter {
  private outputDirs = new Set<string>();
  private rootDir = process.cwd();

  onBegin(config: FullConfig): void {
    this.rootDir = config.rootDir;
    for (const project of config.projects) this.outputDirs.add(project.outputDir);
  }

  async onEnd(result: FullResult): Promise<void> {
    if (process.env.KEEP_RESULTS === "true") return;
    if (result.status !== "passed") {
      console.log(`[cleanup] run ${result.status}: keeping test-results for debugging`);
      return;
    }
    for (const dir of this.outputDirs) {
      const resolved = path.resolve(dir);
      // Safety: only delete a folder strictly inside the project, never the project itself.
      if (!resolved.startsWith(path.resolve(this.rootDir) + path.sep)) continue;
      fs.rmSync(resolved, { recursive: true, force: true });
      console.log(`[cleanup] run passed: removed ${path.relative(process.cwd(), resolved)}`);
    }
  }
}

export default CleanupReporter;
