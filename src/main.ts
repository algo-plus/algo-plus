import customProblemPage from "@/scripts/baekjoon/problem";
import customGlobalPage from "./scripts/baekjoon/global";

const url: string = window.location.pathname;

console.info("url=", url);

if (url.startsWith("/problem/")) {
  customProblemPage();
}

if (url.startsWith("/")) {
  customGlobalPage();
}
