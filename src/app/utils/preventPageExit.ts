export function preventPageExit(enable: boolean) {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
  
    if (enable) {
      window.addEventListener("beforeunload", handler);
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", () => window.history.pushState(null, "", window.location.href));
    } else {
      window.removeEventListener("beforeunload", handler);
    }
  }
  