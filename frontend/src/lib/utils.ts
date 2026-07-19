import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL!;
const REDIRECT_URL = process.env.NEXT_PUBLIC_DEFAULT_REDIRECT_URL!;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRedirectUrl(searchParams: URLSearchParams): string {
  const redirectTo = searchParams.get("redirectTo");
  if (redirectTo) return redirectTo;

  const envUrl = REDIRECT_URL;
  if (envUrl) return envUrl;

  return "/";
}

export function getLoginUrl(pathname: string): string {
  const loginUrl = new URL("/auth/connect?app=the-port-mafia", HOME_URL);
  loginUrl.searchParams.set("redirectTo", pathname);

  return loginUrl.toString();
}