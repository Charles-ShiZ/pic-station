let worker: Worker;

export function initiateTranslator() {
  worker = new Worker(
    new URL("./workers/translator.worker.js", import.meta.url),
    {
      type: "module",
    }
  );
  worker.postMessage({
    action: "initiate",
  });
}

export function terminateWorker() {
  worker.terminate();
}

export default async function translator({
  text,
  srcLang,
  tgtLang,
}: {
  text: string;
  srcLang: string;
  tgtLang: string;
}) {
  const output = await new Promise<string>((resolve) => {
    const onMessageReceived = (e: MessageEvent) => {
      switch (e.data.status) {
        case "initiate":
          break;
        case "progress":
          break;
        case "done":
          break;
        case "ready":
          break;
        case "update":
          break;
        case "complete":
          resolve(e.data.output?.[0]?.translation_text);
          worker.removeEventListener("message", onMessageReceived);
          break;
      }
    };

    worker.addEventListener("message", onMessageReceived);
    worker.postMessage({
      action: "translate",
      text,
      src_lang: srcLang,
      tgt_lang: tgtLang,
    });
  });
  return output;
}
