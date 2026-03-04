export function wrapLegacyBuilder(builder) {
  if (typeof builder !== 'function') {
    throw new Error('builder-adapters: expected a function builder');
  }

  return function wrappedBuilder(pptx, slideSpec, ctx) {
    return builder(pptx, slideSpec, ctx);
  };
}
