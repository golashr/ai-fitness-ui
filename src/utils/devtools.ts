export function enableReactDebugging() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    window.__REACT_DEVTOOLS_APPEND_COMPONENT_STACK__ = true;
  }
}
