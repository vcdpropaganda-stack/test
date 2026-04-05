import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function buildMessagePath(path: string, message: string) {
  const [pathWithoutHash, hash = ""] = path.split("#", 2);
  const url = new URL(pathWithoutHash, "http://localhost");
  url.searchParams.set("message", message);

  return `${url.pathname}${url.search}${hash ? `#${hash}` : ""}`;
}
