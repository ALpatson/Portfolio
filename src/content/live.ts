// Products that are live on the web, checked by /api/status and shown in the hero.
export const liveProducts = [
  { id: "pedan", name: "PɛDan", url: "https://pedan.homes/" },
  { id: "pin-and-codes", name: "Pin and Codes Store", url: "https://pinandcodes.store/" },
  { id: "knust-chess", name: "KNUST Chess Club", url: "https://www.knustchess.site/" },
  { id: "career-platform", name: "Career Platform", url: "https://www.careerplatform.online/" },
] as const;

export type LiveStatus = { id: string; name: string; host: string; up: boolean; ms: number | null };
