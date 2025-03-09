import { useEffect, useRef, useState } from "react";

let worker: Worker;

export function initiate() {
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

export default function useTranslator() {
  // Model loading
  const [status, setStatus] = useState<string>("initiate");
  const [ready, setReady] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(false);
  const [progressItems, setProgressItems] = useState<
    {
      file: string;
      progress: string;
    }[]
  >([]);

  // Inputs and outputs
  const [input, setInput] = useState("I love walking my dog.");
  const [sourceLanguage, setSourceLanguage] = useState("eng_Latn");
  const [targetLanguage, setTargetLanguage] = useState("fra_Latn");
  const [output, setOutput] = useState("");

  useEffect(() => {
    console.log("%c👉 worker: ", "background:#41b883", worker); // 🐵
    if (!worker) {
      worker = new Worker(
        new URL("./workers/translator.worker.js", import.meta.url),
        {
          type: "module",
        }
      );
    }

    const onMessageReceived = (e: MessageEvent) => {
      setStatus(e.data.status);
      switch (e.data.status) {
        case "initiate":
          // Model file start load: add a new progress item to the list.
          setReady(false);
          setProgressItems((prev) => [...prev, e.data]);
          break;

        case "progress":
          // Model file progress: update one of the progress items.
          setProgressItems((prev) =>
            prev.map((item) => {
              if (item.file === e.data.file) {
                return { ...item, progress: e.data.progress };
              }
              return item;
            })
          );
          break;

        case "done":
          // Model file loaded: remove the progress item from the list.
          setProgressItems((prev) =>
            prev.filter((item) => item.file !== e.data.file)
          );
          break;

        case "ready":
          // Pipeline ready: the worker is ready to accept messages.
          setReady(true);
          break;

        case "update":
          // Generation update: update the output text.
          setOutput(e.data.output);
          break;

        case "complete":
          // Generation complete: re-enable the "Translate" button
          setDisabled(false);
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.addEventListener("message", onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.removeEventListener("message", onMessageReceived);
  }, []);

  const translate = ({
    text,
    srcLang,
    tgtLang,
  }: {
    text: string;
    srcLang: string;
    tgtLang: string;
  }) => {
    setDisabled(true);
    worker.postMessage({
      action: "translate",
      text: text,
      src_lang: srcLang,
      tgt_lang: tgtLang,
    });
  };

  return { output, status, translate };
}
