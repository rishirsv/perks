export type BuilderContext = {
  templateRoot: string;
  assetsManifestPath: string;
};

export type BuilderResult = {
  warnings?: string[];
};

export type SlideBuilder = (slideSpec: Record<string, unknown>, context: BuilderContext) => BuilderResult;

export function notImplemented(name: string): never {
  throw new Error(`Builder ${name} is scaffold-only and not implemented yet.`);
}
