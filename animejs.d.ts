declare module "animejs/lib/anime.es.js" {
  interface AnimeInstance {
    progress: number;
  }

  interface AnimeFunction {
    (params: unknown): unknown;
    remove(targets: unknown): void;
  }

  const anime: AnimeFunction;
  export default anime;
  export type { AnimeInstance };
}
