interface ImportMetaEnv {
  readonly VITE_KEY: string;
  readonly VITE_QUOTE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
