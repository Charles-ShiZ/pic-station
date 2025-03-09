import TranslationPipeline from "./TranslationPipeline";

self.addEventListener("message", async (event) => {
  if (event.data.action === "initiate") {
    await TranslationPipeline.getInstance((x) => {
      self.postMessage(x);
    });
    self.postMessage({
      status: "done",
    });
  }
  if (event.data.action === "translate") {
    let output = await TranslationPipeline.instance(event.data.text, {
      tgt_lang: event.data.tgt_lang,
      src_lang: event.data.src_lang,
      // callback_function: (x) => {
      //   self.postMessage({
      //     status: "update",
      //     output: translator.tokenizer.decode(x[0].output_token_ids, {
      //       skip_special_tokens: true,
      //     }),
      //   });
      // },
    });
    self.postMessage({
      status: "complete",
      output: output,
    });
  }
});
