import { fetchBooomData } from "./fetch.ts";

fetchBooomData(20, 20).subscribe((v) => {
  console.info(JSON.stringify(v));
});
