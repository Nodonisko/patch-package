"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const process_1 = __importDefault(require("process"));
const minimist_1 = __importDefault(require("minimist"));
const applyPatches_1 = require("./applyPatches");
const getAppRootPath_1 = require("./getAppRootPath");
const makePatch_1 = require("./makePatch");
const makeRegExp_1 = require("./makeRegExp");
const detectPackageManager_1 = require("./detectPackageManager");
const path_1 = require("./path");
const path_2 = require("path");
const slash = require("slash");
const is_ci_1 = __importDefault(require("is-ci"));
const appPath = getAppRootPath_1.getAppRootPath();
const argv = minimist_1.default(process_1.default.argv.slice(2), {
    boolean: [
        "use-yarn",
        "case-sensitive-path-filtering",
        "reverse",
        "help",
        "version",
        "error-on-fail",
        "create-issue",
    ],
    string: ["patch-dir"],
});
const packageNames = argv._;
console.log(chalk_1.default.bold("patch-package"), 
// tslint:disable-next-line:no-var-requires
require(path_1.join(__dirname, "../package.json")).version);
if (argv.version || argv.v) {
    // noop
}
else if (argv.help || argv.h) {
    printHelp();
}
else {
    const patchDir = slash(path_2.normalize((argv["patch-dir"] || "patches") + path_2.sep));
    if (patchDir.startsWith("/")) {
        throw new Error("--patch-dir must be a relative path");
    }
    if (packageNames.length) {
        const includePaths = makeRegExp_1.makeRegExp(argv.include, "include", /.*/, argv["case-sensitive-path-filtering"]);
        const excludePaths = makeRegExp_1.makeRegExp(argv.exclude, "exclude", /^package\.json$/, argv["case-sensitive-path-filtering"]);
        const packageManager = detectPackageManager_1.detectPackageManager(appPath, argv["use-yarn"] ? "yarn" : null);
        const createIssue = argv["create-issue"];
        packageNames.forEach((packagePathSpecifier) => {
            makePatch_1.makePatch({
                packagePathSpecifier,
                appPath,
                packageManager,
                includePaths,
                excludePaths,
                patchDir,
                createIssue,
            });
        });
    }
    else {
        console.log("Applying patches...");
        const reverse = !!argv["reverse"];
        // don't want to exit(1) on postinsall locally.
        // see https://github.com/ds300/patch-package/issues/86
        const shouldExitWithError = !!argv["error-on-fail"] || is_ci_1.default || process_1.default.env.NODE_ENV === "test";
        applyPatches_1.applyPatchesForApp({ appPath, reverse, patchDir, shouldExitWithError });
    }
}
function printHelp() {
    console.log(`
Usage:

  1. Patching packages
  ====================

    ${chalk_1.default.bold("patch-package")}

  Without arguments, the ${chalk_1.default.bold("patch-package")} command will attempt to find and apply
  patch files to your project. It looks for files named like

     ./patches/<package-name>+<version>.patch

  Options:

    ${chalk_1.default.bold("--patch-dir <dirname>")}

      Specify the name for the directory in which the patch files are located.
      
    ${chalk_1.default.bold("--error-on-fail")}
    
      Forces patch-package to exit with code 1 after failing.
    
      When running locally patch-package always exits with 0 by default.
      This happens even after failing to apply patches because otherwise 
      yarn.lock and package.json might get out of sync with node_modules,
      which can be very confusing.
      
      --error-on-fail is ${chalk_1.default.bold("switched on")} by default on CI.
      
      See https://github.com/ds300/patch-package/issues/86 for background.

    ${chalk_1.default.bold("--reverse")}
        
      Un-applies all patches.

      Note that this will fail if the patched files have changed since being
      patched. In that case, you'll probably need to re-install 'node_modules'.

      This option was added to help people using CircleCI avoid an issue around caching
      and patch file updates (https://github.com/ds300/patch-package/issues/37),
      but might be useful in other contexts too.
      

  2. Creating patch files
  =======================

    ${chalk_1.default.bold("patch-package")} <package-name>${chalk_1.default.italic("[ <package-name>]")}

  When given package names as arguments, patch-package will create patch files
  based on any changes you've made to the versions installed by yarn/npm.

  Options:
  
    ${chalk_1.default.bold("--create-issue")}
    
       For packages whose source is hosted on GitHub this option opens a web
       browser with a draft issue based on your diff.

    ${chalk_1.default.bold("--use-yarn")}

        By default, patch-package checks whether you use npm or yarn based on
        which lockfile you have. If you have both, it uses npm by default.
        Set this option to override that default and always use yarn.

    ${chalk_1.default.bold("--exclude <regexp>")}

        Ignore paths matching the regexp when creating patch files.
        Paths are relative to the root dir of the package to be patched.

        Default: 'package\\.json$'

    ${chalk_1.default.bold("--include <regexp>")}

        Only consider paths matching the regexp when creating patch files.
        Paths are relative to the root dir of the package to be patched.

        Default '.*'

    ${chalk_1.default.bold("--case-sensitive-path-filtering")}

        Make regexps used in --include or --exclude filters case-sensitive.
    
    ${chalk_1.default.bold("--patch-dir")}

        Specify the name for the directory in which to put the patch files.
`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBeUI7QUFDekIsc0RBQTZCO0FBQzdCLHdEQUErQjtBQUUvQixpREFBbUQ7QUFDbkQscURBQWlEO0FBQ2pELDJDQUF1QztBQUN2Qyw2Q0FBeUM7QUFDekMsaUVBQTZEO0FBQzdELGlDQUE2QjtBQUM3QiwrQkFBcUM7QUFDckMsK0JBQStCO0FBQy9CLGtEQUF3QjtBQUV4QixNQUFNLE9BQU8sR0FBRywrQkFBYyxFQUFFLENBQUE7QUFDaEMsTUFBTSxJQUFJLEdBQUcsa0JBQVEsQ0FBQyxpQkFBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFDM0MsT0FBTyxFQUFFO1FBQ1AsVUFBVTtRQUNWLCtCQUErQjtRQUMvQixTQUFTO1FBQ1QsTUFBTTtRQUNOLFNBQVM7UUFDVCxlQUFlO1FBQ2YsY0FBYztLQUNmO0lBQ0QsTUFBTSxFQUFFLENBQUMsV0FBVyxDQUFDO0NBQ3RCLENBQUMsQ0FBQTtBQUNGLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUE7QUFFM0IsT0FBTyxDQUFDLEdBQUcsQ0FDVCxlQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztBQUMzQiwyQ0FBMkM7QUFDM0MsT0FBTyxDQUFDLFdBQUksQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FDcEQsQ0FBQTtBQUVELElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFO0lBQzFCLE9BQU87Q0FDUjtLQUFNLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFO0lBQzlCLFNBQVMsRUFBRSxDQUFBO0NBQ1o7S0FBTTtJQUNMLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxnQkFBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLFVBQUcsQ0FBQyxDQUFDLENBQUE7SUFDekUsSUFBSSxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQTtLQUN2RDtJQUNELElBQUksWUFBWSxDQUFDLE1BQU0sRUFBRTtRQUN2QixNQUFNLFlBQVksR0FBRyx1QkFBVSxDQUM3QixJQUFJLENBQUMsT0FBTyxFQUNaLFNBQVMsRUFDVCxJQUFJLEVBQ0osSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQ3RDLENBQUE7UUFDRCxNQUFNLFlBQVksR0FBRyx1QkFBVSxDQUM3QixJQUFJLENBQUMsT0FBTyxFQUNaLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQ3RDLENBQUE7UUFDRCxNQUFNLGNBQWMsR0FBRywyQ0FBb0IsQ0FDekMsT0FBTyxFQUNQLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ2pDLENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDeEMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLG9CQUE0QixFQUFFLEVBQUU7WUFDcEQscUJBQVMsQ0FBQztnQkFDUixvQkFBb0I7Z0JBQ3BCLE9BQU87Z0JBQ1AsY0FBYztnQkFDZCxZQUFZO2dCQUNaLFlBQVk7Z0JBQ1osUUFBUTtnQkFDUixXQUFXO2FBQ1osQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7S0FDSDtTQUFNO1FBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO1FBQ2xDLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDakMsK0NBQStDO1FBQy9DLHVEQUF1RDtRQUN2RCxNQUFNLG1CQUFtQixHQUN2QixDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLGVBQUksSUFBSSxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssTUFBTSxDQUFBO1FBQ3BFLGlDQUFrQixDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQyxDQUFBO0tBQ3hFO0NBQ0Y7QUFFRCxTQUFTLFNBQVM7SUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQzs7Ozs7O01BTVIsZUFBSyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUM7OzJCQUVOLGVBQUssQ0FBQyxJQUFJLENBQ2pDLGVBQWUsQ0FDaEI7Ozs7Ozs7TUFPRyxlQUFLLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDOzs7O01BSW5DLGVBQUssQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUM7Ozs7Ozs7OzsyQkFTUixlQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQzs7OztNQUk5QyxlQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O01BZXZCLGVBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGtCQUFrQixlQUFLLENBQUMsTUFBTSxDQUMzRCxtQkFBbUIsQ0FDcEI7Ozs7Ozs7TUFPRyxlQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDOzs7OztNQUs1QixlQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQzs7Ozs7O01BTXhCLGVBQUssQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUM7Ozs7Ozs7TUFPaEMsZUFBSyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQzs7Ozs7OztNQU9oQyxlQUFLLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDOzs7O01BSTdDLGVBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDOzs7Q0FHOUIsQ0FBQyxDQUFBO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIlxuaW1wb3J0IHByb2Nlc3MgZnJvbSBcInByb2Nlc3NcIlxuaW1wb3J0IG1pbmltaXN0IGZyb20gXCJtaW5pbWlzdFwiXG5cbmltcG9ydCB7IGFwcGx5UGF0Y2hlc0ZvckFwcCB9IGZyb20gXCIuL2FwcGx5UGF0Y2hlc1wiXG5pbXBvcnQgeyBnZXRBcHBSb290UGF0aCB9IGZyb20gXCIuL2dldEFwcFJvb3RQYXRoXCJcbmltcG9ydCB7IG1ha2VQYXRjaCB9IGZyb20gXCIuL21ha2VQYXRjaFwiXG5pbXBvcnQgeyBtYWtlUmVnRXhwIH0gZnJvbSBcIi4vbWFrZVJlZ0V4cFwiXG5pbXBvcnQgeyBkZXRlY3RQYWNrYWdlTWFuYWdlciB9IGZyb20gXCIuL2RldGVjdFBhY2thZ2VNYW5hZ2VyXCJcbmltcG9ydCB7IGpvaW4gfSBmcm9tIFwiLi9wYXRoXCJcbmltcG9ydCB7IG5vcm1hbGl6ZSwgc2VwIH0gZnJvbSBcInBhdGhcIlxuaW1wb3J0IHNsYXNoID0gcmVxdWlyZShcInNsYXNoXCIpXG5pbXBvcnQgaXNDaSBmcm9tIFwiaXMtY2lcIlxuXG5jb25zdCBhcHBQYXRoID0gZ2V0QXBwUm9vdFBhdGgoKVxuY29uc3QgYXJndiA9IG1pbmltaXN0KHByb2Nlc3MuYXJndi5zbGljZSgyKSwge1xuICBib29sZWFuOiBbXG4gICAgXCJ1c2UteWFyblwiLFxuICAgIFwiY2FzZS1zZW5zaXRpdmUtcGF0aC1maWx0ZXJpbmdcIixcbiAgICBcInJldmVyc2VcIixcbiAgICBcImhlbHBcIixcbiAgICBcInZlcnNpb25cIixcbiAgICBcImVycm9yLW9uLWZhaWxcIixcbiAgICBcImNyZWF0ZS1pc3N1ZVwiLFxuICBdLFxuICBzdHJpbmc6IFtcInBhdGNoLWRpclwiXSxcbn0pXG5jb25zdCBwYWNrYWdlTmFtZXMgPSBhcmd2Ll9cblxuY29uc29sZS5sb2coXG4gIGNoYWxrLmJvbGQoXCJwYXRjaC1wYWNrYWdlXCIpLFxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdmFyLXJlcXVpcmVzXG4gIHJlcXVpcmUoam9pbihfX2Rpcm5hbWUsIFwiLi4vcGFja2FnZS5qc29uXCIpKS52ZXJzaW9uLFxuKVxuXG5pZiAoYXJndi52ZXJzaW9uIHx8IGFyZ3Yudikge1xuICAvLyBub29wXG59IGVsc2UgaWYgKGFyZ3YuaGVscCB8fCBhcmd2LmgpIHtcbiAgcHJpbnRIZWxwKClcbn0gZWxzZSB7XG4gIGNvbnN0IHBhdGNoRGlyID0gc2xhc2gobm9ybWFsaXplKChhcmd2W1wicGF0Y2gtZGlyXCJdIHx8IFwicGF0Y2hlc1wiKSArIHNlcCkpXG4gIGlmIChwYXRjaERpci5zdGFydHNXaXRoKFwiL1wiKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIi0tcGF0Y2gtZGlyIG11c3QgYmUgYSByZWxhdGl2ZSBwYXRoXCIpXG4gIH1cbiAgaWYgKHBhY2thZ2VOYW1lcy5sZW5ndGgpIHtcbiAgICBjb25zdCBpbmNsdWRlUGF0aHMgPSBtYWtlUmVnRXhwKFxuICAgICAgYXJndi5pbmNsdWRlLFxuICAgICAgXCJpbmNsdWRlXCIsXG4gICAgICAvLiovLFxuICAgICAgYXJndltcImNhc2Utc2Vuc2l0aXZlLXBhdGgtZmlsdGVyaW5nXCJdLFxuICAgIClcbiAgICBjb25zdCBleGNsdWRlUGF0aHMgPSBtYWtlUmVnRXhwKFxuICAgICAgYXJndi5leGNsdWRlLFxuICAgICAgXCJleGNsdWRlXCIsXG4gICAgICAvXnBhY2thZ2VcXC5qc29uJC8sXG4gICAgICBhcmd2W1wiY2FzZS1zZW5zaXRpdmUtcGF0aC1maWx0ZXJpbmdcIl0sXG4gICAgKVxuICAgIGNvbnN0IHBhY2thZ2VNYW5hZ2VyID0gZGV0ZWN0UGFja2FnZU1hbmFnZXIoXG4gICAgICBhcHBQYXRoLFxuICAgICAgYXJndltcInVzZS15YXJuXCJdID8gXCJ5YXJuXCIgOiBudWxsLFxuICAgIClcbiAgICBjb25zdCBjcmVhdGVJc3N1ZSA9IGFyZ3ZbXCJjcmVhdGUtaXNzdWVcIl1cbiAgICBwYWNrYWdlTmFtZXMuZm9yRWFjaCgocGFja2FnZVBhdGhTcGVjaWZpZXI6IHN0cmluZykgPT4ge1xuICAgICAgbWFrZVBhdGNoKHtcbiAgICAgICAgcGFja2FnZVBhdGhTcGVjaWZpZXIsXG4gICAgICAgIGFwcFBhdGgsXG4gICAgICAgIHBhY2thZ2VNYW5hZ2VyLFxuICAgICAgICBpbmNsdWRlUGF0aHMsXG4gICAgICAgIGV4Y2x1ZGVQYXRocyxcbiAgICAgICAgcGF0Y2hEaXIsXG4gICAgICAgIGNyZWF0ZUlzc3VlLFxuICAgICAgfSlcbiAgICB9KVxuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKFwiQXBwbHlpbmcgcGF0Y2hlcy4uLlwiKVxuICAgIGNvbnN0IHJldmVyc2UgPSAhIWFyZ3ZbXCJyZXZlcnNlXCJdXG4gICAgLy8gZG9uJ3Qgd2FudCB0byBleGl0KDEpIG9uIHBvc3RpbnNhbGwgbG9jYWxseS5cbiAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2RzMzAwL3BhdGNoLXBhY2thZ2UvaXNzdWVzLzg2XG4gICAgY29uc3Qgc2hvdWxkRXhpdFdpdGhFcnJvciA9XG4gICAgICAhIWFyZ3ZbXCJlcnJvci1vbi1mYWlsXCJdIHx8IGlzQ2kgfHwgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwidGVzdFwiXG4gICAgYXBwbHlQYXRjaGVzRm9yQXBwKHsgYXBwUGF0aCwgcmV2ZXJzZSwgcGF0Y2hEaXIsIHNob3VsZEV4aXRXaXRoRXJyb3IgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBwcmludEhlbHAoKSB7XG4gIGNvbnNvbGUubG9nKGBcblVzYWdlOlxuXG4gIDEuIFBhdGNoaW5nIHBhY2thZ2VzXG4gID09PT09PT09PT09PT09PT09PT09XG5cbiAgICAke2NoYWxrLmJvbGQoXCJwYXRjaC1wYWNrYWdlXCIpfVxuXG4gIFdpdGhvdXQgYXJndW1lbnRzLCB0aGUgJHtjaGFsay5ib2xkKFxuICAgIFwicGF0Y2gtcGFja2FnZVwiLFxuICApfSBjb21tYW5kIHdpbGwgYXR0ZW1wdCB0byBmaW5kIGFuZCBhcHBseVxuICBwYXRjaCBmaWxlcyB0byB5b3VyIHByb2plY3QuIEl0IGxvb2tzIGZvciBmaWxlcyBuYW1lZCBsaWtlXG5cbiAgICAgLi9wYXRjaGVzLzxwYWNrYWdlLW5hbWU+Kzx2ZXJzaW9uPi5wYXRjaFxuXG4gIE9wdGlvbnM6XG5cbiAgICAke2NoYWxrLmJvbGQoXCItLXBhdGNoLWRpciA8ZGlybmFtZT5cIil9XG5cbiAgICAgIFNwZWNpZnkgdGhlIG5hbWUgZm9yIHRoZSBkaXJlY3RvcnkgaW4gd2hpY2ggdGhlIHBhdGNoIGZpbGVzIGFyZSBsb2NhdGVkLlxuICAgICAgXG4gICAgJHtjaGFsay5ib2xkKFwiLS1lcnJvci1vbi1mYWlsXCIpfVxuICAgIFxuICAgICAgRm9yY2VzIHBhdGNoLXBhY2thZ2UgdG8gZXhpdCB3aXRoIGNvZGUgMSBhZnRlciBmYWlsaW5nLlxuICAgIFxuICAgICAgV2hlbiBydW5uaW5nIGxvY2FsbHkgcGF0Y2gtcGFja2FnZSBhbHdheXMgZXhpdHMgd2l0aCAwIGJ5IGRlZmF1bHQuXG4gICAgICBUaGlzIGhhcHBlbnMgZXZlbiBhZnRlciBmYWlsaW5nIHRvIGFwcGx5IHBhdGNoZXMgYmVjYXVzZSBvdGhlcndpc2UgXG4gICAgICB5YXJuLmxvY2sgYW5kIHBhY2thZ2UuanNvbiBtaWdodCBnZXQgb3V0IG9mIHN5bmMgd2l0aCBub2RlX21vZHVsZXMsXG4gICAgICB3aGljaCBjYW4gYmUgdmVyeSBjb25mdXNpbmcuXG4gICAgICBcbiAgICAgIC0tZXJyb3Itb24tZmFpbCBpcyAke2NoYWxrLmJvbGQoXCJzd2l0Y2hlZCBvblwiKX0gYnkgZGVmYXVsdCBvbiBDSS5cbiAgICAgIFxuICAgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kczMwMC9wYXRjaC1wYWNrYWdlL2lzc3Vlcy84NiBmb3IgYmFja2dyb3VuZC5cblxuICAgICR7Y2hhbGsuYm9sZChcIi0tcmV2ZXJzZVwiKX1cbiAgICAgICAgXG4gICAgICBVbi1hcHBsaWVzIGFsbCBwYXRjaGVzLlxuXG4gICAgICBOb3RlIHRoYXQgdGhpcyB3aWxsIGZhaWwgaWYgdGhlIHBhdGNoZWQgZmlsZXMgaGF2ZSBjaGFuZ2VkIHNpbmNlIGJlaW5nXG4gICAgICBwYXRjaGVkLiBJbiB0aGF0IGNhc2UsIHlvdSdsbCBwcm9iYWJseSBuZWVkIHRvIHJlLWluc3RhbGwgJ25vZGVfbW9kdWxlcycuXG5cbiAgICAgIFRoaXMgb3B0aW9uIHdhcyBhZGRlZCB0byBoZWxwIHBlb3BsZSB1c2luZyBDaXJjbGVDSSBhdm9pZCBhbiBpc3N1ZSBhcm91bmQgY2FjaGluZ1xuICAgICAgYW5kIHBhdGNoIGZpbGUgdXBkYXRlcyAoaHR0cHM6Ly9naXRodWIuY29tL2RzMzAwL3BhdGNoLXBhY2thZ2UvaXNzdWVzLzM3KSxcbiAgICAgIGJ1dCBtaWdodCBiZSB1c2VmdWwgaW4gb3RoZXIgY29udGV4dHMgdG9vLlxuICAgICAgXG5cbiAgMi4gQ3JlYXRpbmcgcGF0Y2ggZmlsZXNcbiAgPT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICR7Y2hhbGsuYm9sZChcInBhdGNoLXBhY2thZ2VcIil9IDxwYWNrYWdlLW5hbWU+JHtjaGFsay5pdGFsaWMoXG4gICAgXCJbIDxwYWNrYWdlLW5hbWU+XVwiLFxuICApfVxuXG4gIFdoZW4gZ2l2ZW4gcGFja2FnZSBuYW1lcyBhcyBhcmd1bWVudHMsIHBhdGNoLXBhY2thZ2Ugd2lsbCBjcmVhdGUgcGF0Y2ggZmlsZXNcbiAgYmFzZWQgb24gYW55IGNoYW5nZXMgeW91J3ZlIG1hZGUgdG8gdGhlIHZlcnNpb25zIGluc3RhbGxlZCBieSB5YXJuL25wbS5cblxuICBPcHRpb25zOlxuICBcbiAgICAke2NoYWxrLmJvbGQoXCItLWNyZWF0ZS1pc3N1ZVwiKX1cbiAgICBcbiAgICAgICBGb3IgcGFja2FnZXMgd2hvc2Ugc291cmNlIGlzIGhvc3RlZCBvbiBHaXRIdWIgdGhpcyBvcHRpb24gb3BlbnMgYSB3ZWJcbiAgICAgICBicm93c2VyIHdpdGggYSBkcmFmdCBpc3N1ZSBiYXNlZCBvbiB5b3VyIGRpZmYuXG5cbiAgICAke2NoYWxrLmJvbGQoXCItLXVzZS15YXJuXCIpfVxuXG4gICAgICAgIEJ5IGRlZmF1bHQsIHBhdGNoLXBhY2thZ2UgY2hlY2tzIHdoZXRoZXIgeW91IHVzZSBucG0gb3IgeWFybiBiYXNlZCBvblxuICAgICAgICB3aGljaCBsb2NrZmlsZSB5b3UgaGF2ZS4gSWYgeW91IGhhdmUgYm90aCwgaXQgdXNlcyBucG0gYnkgZGVmYXVsdC5cbiAgICAgICAgU2V0IHRoaXMgb3B0aW9uIHRvIG92ZXJyaWRlIHRoYXQgZGVmYXVsdCBhbmQgYWx3YXlzIHVzZSB5YXJuLlxuXG4gICAgJHtjaGFsay5ib2xkKFwiLS1leGNsdWRlIDxyZWdleHA+XCIpfVxuXG4gICAgICAgIElnbm9yZSBwYXRocyBtYXRjaGluZyB0aGUgcmVnZXhwIHdoZW4gY3JlYXRpbmcgcGF0Y2ggZmlsZXMuXG4gICAgICAgIFBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgcm9vdCBkaXIgb2YgdGhlIHBhY2thZ2UgdG8gYmUgcGF0Y2hlZC5cblxuICAgICAgICBEZWZhdWx0OiAncGFja2FnZVxcXFwuanNvbiQnXG5cbiAgICAke2NoYWxrLmJvbGQoXCItLWluY2x1ZGUgPHJlZ2V4cD5cIil9XG5cbiAgICAgICAgT25seSBjb25zaWRlciBwYXRocyBtYXRjaGluZyB0aGUgcmVnZXhwIHdoZW4gY3JlYXRpbmcgcGF0Y2ggZmlsZXMuXG4gICAgICAgIFBhdGhzIGFyZSByZWxhdGl2ZSB0byB0aGUgcm9vdCBkaXIgb2YgdGhlIHBhY2thZ2UgdG8gYmUgcGF0Y2hlZC5cblxuICAgICAgICBEZWZhdWx0ICcuKidcblxuICAgICR7Y2hhbGsuYm9sZChcIi0tY2FzZS1zZW5zaXRpdmUtcGF0aC1maWx0ZXJpbmdcIil9XG5cbiAgICAgICAgTWFrZSByZWdleHBzIHVzZWQgaW4gLS1pbmNsdWRlIG9yIC0tZXhjbHVkZSBmaWx0ZXJzIGNhc2Utc2Vuc2l0aXZlLlxuICAgIFxuICAgICR7Y2hhbGsuYm9sZChcIi0tcGF0Y2gtZGlyXCIpfVxuXG4gICAgICAgIFNwZWNpZnkgdGhlIG5hbWUgZm9yIHRoZSBkaXJlY3RvcnkgaW4gd2hpY2ggdG8gcHV0IHRoZSBwYXRjaCBmaWxlcy5cbmApXG59XG4iXX0=