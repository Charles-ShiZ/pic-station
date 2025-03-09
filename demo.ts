class MyTranslationPipeline {
  static task = "translation";
  static model = "Xenova/nllb-200-distilled-600M";
  static instance: any = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = 123;
    }

    return this.instance;
  }
}

MyTranslationPipeline.getInstance();
console.log(MyTranslationPipeline.instance);
