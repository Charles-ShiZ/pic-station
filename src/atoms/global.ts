import routes from "@/config/routes";
import { psdData } from "@/const";
import { atom } from "jotai";

const activeTabItemAtom = atom<{
  name: string;
  path: string;
}>(routes[0]);

const psdDataLoadedAtom = atom<typeof psdData>([]);
const currentPsdDataIdAtom = atom<string>("");

export { activeTabItemAtom, psdDataLoadedAtom, currentPsdDataIdAtom };
