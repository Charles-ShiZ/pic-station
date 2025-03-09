import { pipeline, env } from "@xenova/transformers";
env.localModelPath = "../../../models/nllb-200-distilled-600M";
env.allowRemoteModels = false;

export default class TranslationPipeline {
  static task = "translation";
  static model = "Xenova/nllb-200-distilled-600M";
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, {
        progress_callback,
      });
    }

    return this.instance;
  }
}
