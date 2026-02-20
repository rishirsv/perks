export interface RenderDeckOptions {
  allowSparse?: boolean;
  qaOutputPath?: string;
}

export interface RenderDeckResult {
  outputPath: string;
  qaPath: string;
  warnings: string[];
}

export async function renderDeck(_deckSpecPath: string, _templateRoot: string, _options: RenderDeckOptions = {}): Promise<RenderDeckResult> {
  throw new Error(
    'templates/diligence-plus/runtime/renderDeck.ts is scaffold-only. Use generator/runtime/render-deck.js until this runtime is implemented.',
  );
}
